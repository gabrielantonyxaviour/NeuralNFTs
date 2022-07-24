// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/// @notice imports
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

/// @notice Error Declarations
error NeuralNFTMarketplace__PriceMustBeAboveZero();
error NeuralNFTMarketplace__AlreadyListed(uint256 tokenId);
error NeuralNFTMarketplace__NotOwner();
error NeuralNFTMarketplace__NotListed(uint256 tokenId);
error NeuralNFTMarketplace__PriceNotMet(uint256 tokenId, uint256 price);
error NeuralNFTMarketplace__NoEarnings();
error NeuralNFTMarketplace__TransferFailed();
error NeuralNFTMarketplace__InsufficientFunds();
error NeuralNFTMarketplace__AlreadyApproved();
error NeuralNFTMarketplace__RoyaltyFeesTooHigh(uint96);
error NeuralNFTMarketplace__CannotCallOutsideContract();
error NeuralNFTMarketplace__NotCreator();

/**
 * @author Gabriel Antony Xaviour
 * @title NeuralNFTMarketplace
 * @notice A marketplace for NFTs with the sixth sense
 * @dev ReentrancyGuard protects the contract from fraud. ERC2981 for on-chain non-custodial royalty. ERC721URIStorage to store URI for minted NeuralNFTs
 */
contract NeuralNFTMarketplace is ERC2981, ERC721URIStorage, ReentrancyGuard {
    // Structures
    struct Listing {
        uint256 price;
        address seller;
    }

    /// @notice Counter for tokenId of NeuralNFTs minted
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// @notice 2% of the sale of a NFT goes to the owner
    uint256 public constant PLATFORM_FEE = 2;

    // Immutable variable
    address private immutable i_owner;

    // State variables
    mapping(uint256 => Listing) private s_listings; // tokenId => listing

    mapping(address => uint256) private s_earnings; // user => earnings

    mapping(uint256 => address) private s_creator; // tokenId => creator

    /// @notice List fee modifiable by the owner
    uint256 public s_list_fee = 0.001 ether;

    /**
     * @notice These events are fired each time a function emits it
     * @dev Fired for indexing data using theGraph protocol (https://thegraph.com/docs/en/about/)
     */
    event ItemListed(address indexed seller, uint256 indexed tokenId, uint256 price);

    event ItemBought(address indexed buyer, uint256 indexed tokenId, uint256 price);

    event ItemCancelled(address indexed seller, uint256 indexed tokenId);

    event NewNftMinted(address indexed creator, uint256 indexed tokenId, uint96 royaltyFees);

    event NftRoyaltyUpdated(uint256 indexed tokenId, uint96 royaltyFees);

    /// @notice Reverts if the nft is listed
    modifier notListed(uint256 tokenId, address owner) {
        Listing memory listing = s_listings[tokenId];
        if (listing.price > 0) {
            revert NeuralNFTMarketplace__AlreadyListed(tokenId);
        }
        _;
    }

    /// @notice Reverts if the nft is not listed
    modifier isListed(uint256 tokenId) {
        Listing memory listing = s_listings[tokenId];
        if (listing.price <= 0) {
            revert NeuralNFTMarketplace__NotListed(tokenId);
        }
        _;
    }

    /// @notice Reverts if the caller is not the owner of the NFT
    modifier isOwner(uint256 tokenId, address spender) {
        if (spender != ownerOf(tokenId)) {
            revert NeuralNFTMarketplace__NotOwner();
        }
        _;
    }

    /// @notice Reverts if royalty percentage set is too high
    modifier isRoyaltyTooHigh(uint96 _royaltyFeesInBips) {
        if (_royaltyFeesInBips > 2000) {
            revert NeuralNFTMarketplace__RoyaltyFeesTooHigh(_royaltyFeesInBips);
        }
        _;
    }

    /// @notice Reverts if the caller is not the creator of the NFT
    modifier isCreator(uint256 tokenId, address caller) {
        if (s_creator[tokenId] != caller) {
            revert NeuralNFTMarketplace__NotCreator();
        }
        _;
    }

    /// @notice Initializes the marketplace and owner of the contract.
    constructor() ERC721("NeuralNFT", "NNFT") {
        i_owner = msg.sender;
    }

    /// @notice This function executes when eth is sent to the contract with no data
    receive() external payable {
        s_earnings[i_owner] += msg.value;
    }

    /// @notice This function executes when eth is sent to the contract with data
    fallback() external payable {
        s_earnings[i_owner] += msg.value;
    }

    /**
     * @notice Mints a NeuralNFT to the creator and fires NewNftMinted
     * @dev Mints an ERC2981 NFT and stores the URI with ERC721URIStorage
     * @param nftURI The URI of NeuralNFT metadata
     * @param royaltyReceiver Address that receives the royalty
     * @param _royaltyFeesInBips Royalty percentage desired expressed in bips
     */
    function mintNft(
        string memory nftURI,
        address royaltyReceiver,
        uint96 _royaltyFeesInBips
    ) external isRoyaltyTooHigh(_royaltyFeesInBips) nonReentrant returns (uint256 newItemId) {
        newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenRoyalty(newItemId, royaltyReceiver, _royaltyFeesInBips);
        _setTokenURI(newItemId, nftURI);
        s_creator[newItemId] = msg.sender;
        _tokenIds.increment();
        emit NewNftMinted(msg.sender, newItemId, _royaltyFeesInBips);
    }

    /**
     * @notice Sets the royalty receiver address, royalty fees and fires NewNftMinted
     * @param _tokenId The NeuralNFT tokenId to set royalty info
     * @param _receiver Address that receives the royalty
     * @param _royaltyFeesInBips Royalty percentage desired expressed in bips
     */
    function setRoyaltyInfo(
        uint256 _tokenId,
        address _receiver,
        uint96 _royaltyFeesInBips
    ) external isRoyaltyTooHigh(_royaltyFeesInBips) isCreator(_tokenId, msg.sender) {
        _setTokenRoyalty(_tokenId, _receiver, _royaltyFeesInBips);
        emit NftRoyaltyUpdated(_tokenId, _royaltyFeesInBips);
    }

    /**
     * @notice Lists a NeuralNFT for sale on the marketplace
     * @param tokenId The ID of the NeuralNFT
     * @param price The desired listing price by the seller
     */
    function listItem(uint256 tokenId, uint256 price)
        external
        payable
        notListed(tokenId, msg.sender)
        isOwner(tokenId, msg.sender)
    {
        if (msg.value < s_list_fee) {
            revert NeuralNFTMarketplace__InsufficientFunds();
        }
        if (price <= 0) {
            revert NeuralNFTMarketplace__PriceMustBeAboveZero();
        }
        approve(address(this), tokenId);

        s_earnings[i_owner] += msg.value;
        s_listings[tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, tokenId, price);
    }

    /**
     * @notice Buys a NeuralNFT which is listed in the marketplace
     * @dev Protected by nonReentrant
     * @param tokenId The ID of the NeuralNFT
     */
    function buyItem(uint256 tokenId) external payable isListed(tokenId) nonReentrant {
        Listing memory listing = s_listings[tokenId];
        if (msg.value < listing.price) {
            revert NeuralNFTMarketplace__PriceNotMet(tokenId, listing.price);
        }
        s_earnings[listing.seller] =
            s_earnings[listing.seller] +
            (msg.value * (100 - PLATFORM_FEE)) /
            100;
        s_earnings[i_owner] += (msg.value * PLATFORM_FEE) / 100;
        delete (s_listings[tokenId]);
        this.safeTransferFrom(listing.seller, msg.sender, tokenId);
        emit ItemBought(msg.sender, tokenId, listing.price);
    }

    /**
     * @notice Cancels a listing created by the user in the marketplace
     * @dev Protected by nonReentrant
     * @param tokenId The ID of the NeuralNFT
     */
    function cancelListing(uint256 tokenId)
        external
        isOwner(tokenId, msg.sender)
        isListed(tokenId)
        nonReentrant
    {
        delete (s_listings[tokenId]);
        emit ItemCancelled(msg.sender, tokenId);
    }

    /**
     * @notice Updates an existing listing by the seller in the marketplace
     * @dev Protected by nonReentrant
     * @param tokenId The ID of the NeuralNFT
     * @param newPrice The updated listing price proposed by the seller
     */
    function updateListing(uint256 tokenId, uint256 newPrice)
        external
        payable
        isOwner(tokenId, msg.sender)
        isListed(tokenId)
        nonReentrant
    {
        if (msg.value < s_list_fee) {
            revert NeuralNFTMarketplace__InsufficientFunds();
        }
        if (newPrice <= 0) {
            revert NeuralNFTMarketplace__PriceMustBeAboveZero();
        }
        s_earnings[i_owner] += msg.value;
        s_listings[tokenId].price = newPrice;
        emit ItemListed(msg.sender, tokenId, newPrice);
    }

    /**
     * @notice Withdraws the earnings made by the user in the marketplace
     * @dev Reentrancy guard put into action preventing multiple calls to this function
     */
    function withdrawEarnings() external nonReentrant {
        uint256 earnings = s_earnings[msg.sender];
        if (earnings <= 0) {
            revert NeuralNFTMarketplace__NoEarnings();
        }
        s_earnings[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: earnings}("");
        if (!success) {
            revert NeuralNFTMarketplace__TransferFailed();
        }
    }

    /**
     * @notice Sets list fee for NeuralNFTs in the marketplace
     * @dev Can be called only by the owner of the marketplace
     */
    function setListFee(uint256 newListFee) external {
        if (msg.sender != i_owner) {
            revert NeuralNFTMarketplace__NotOwner();
        }
        s_list_fee = newListFee;
    }

    /// @notice Gets list fee for NeuralNFTs in the marketplace
    function getListFee() external view returns (uint256) {
        return s_list_fee;
    }

    /// @notice Gets lisitng information for a listed NeuralNFT
    function getListing(uint256 tokenId) external view isListed(tokenId) returns (Listing memory) {
        return s_listings[tokenId];
    }

    /// @notice Gets current balance for a user in NeuralNFTMarketplace
    function getEarnings() external view returns (uint256) {
        return s_earnings[msg.sender];
    }

    /// @notice Gets the platform fee percentage for each NeuralNFT transactions
    function getPlatformFee() external pure returns (uint256) {
        return PLATFORM_FEE;
    }

    /// @notice Gets the creator of NeuralNFT token
    function getCreator(uint256 tokenId)
        external
        view
        isCreator(tokenId, msg.sender)
        returns (address)
    {
        return s_creator[tokenId];
    }

    /// @notice Overrides transferFrom from ERC721 contract with an added modifier notListed
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override notListed(tokenId, from) {
        super.transferFrom(from, to, tokenId);
    }

    /// @notice Overrides safeTransferFrom from ERC721 contract with an added modifier notListed
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override notListed(tokenId, from) {
        super.transferFrom(from, to, tokenId);
    }

    /// @notice This is a required override by ERC2981
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @notice This is a required override by ERC2981
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
