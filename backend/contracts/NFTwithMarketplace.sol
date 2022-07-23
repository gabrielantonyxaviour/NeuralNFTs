// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/// @notice imports
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @notice Error Declarations
error NeuralNFTMarketplace__PriceMustBeAboveZero();
error NeuralNFTMarketplace__NotApprovedForMarketplace();
error NeuralNFTMarketplace__AlreadyListed(uint256 tokenId);
error NeuralNFTMarketplace__NotOwner();
error NeuralNFTMarketplace__NotListed(uint256 tokenId);
error NeuralNFTMarketplace__PriceNotMet(uint256 tokenId, uint256 price);
error NeuralNFTMarketplace__NoProceeds();
error NeuralNFTMarketplace__TransferFailed();
error NeuralNFTMarketplace__InsufficientFunds();
error NeuralNFTMarketplace__AlreadyApproved();
error NeuralNFTMarketplace__RoyaltyFeesTooHigh(uint96);
error NeuralNFTMarketplace__CannotCallOutsideContract();

/**
 * @author Gabriel Antony Xaviour
 * @title NeuralNFTMarketplace
 * @notice A marketplace for NFTs with the sixth sense
 * @dev ENeural NFTs are ERC2981 to provide
 */
contract NeuralNFTMarketplace is ERC2981, ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // Structures
    struct Listing {
        uint256 price;
        address seller;
    }

    /// @notice 2% of the sale of a NFT goes to the owner of the contract
    uint256 public constant PLATFORM_FEE = 2;

    // Immutable variable
    address private immutable i_owner;

    // State variables
    mapping(uint256 => Listing) private s_listings; // tokenId => listing

    mapping(address => uint256) private s_earnings; // user => earnings

    uint256 public s_list_fee = 0.001 ether;

    /// @dev Fired for indexing data using theGraph protocol (https://thegraph.com/docs/en/about/)
    event ItemListed(address indexed seller, uint256 indexed tokenId, uint256 price);

    event ItemBought(address indexed buyer, uint256 indexed tokenId, uint256 price);

    event ItemCancelled(address indexed seller, uint256 indexed tokenId);

    event NewNftMinted(address indexed owner, uint256 indexed tokenId, uint256 royaltyFees);

    event NftRoyaltyUpdated(address indexed owner, uint256 indexed tokenId, uint256 royaltyFees);

    /// @notice Modifiers pre-defined for cleaner code
    modifier notListed(uint256 tokenId, address owner) {
        Listing memory listing = s_listings[tokenId];
        if (listing.price > 0) {
            revert NeuralNFTMarketplace__AlreadyListed(tokenId);
        }
        _;
    }

    modifier isListed(uint256 tokenId) {
        Listing memory listing = s_listings[tokenId];
        if (listing.price <= 0) {
            revert NeuralNFTMarketplace__NotListed(tokenId);
        }
        _;
    }

    modifier isOwner(uint256 tokenId, address spender) {
        if (spender != ownerOf(tokenId)) {
            revert NeuralNFTMarketplace__NotOwner();
        }
        _;
    }

    modifier isRoyaltyTooHigh(uint96 _royaltyFeesInBips) {
        if (_royaltyFeesInBips > 2000) {
            revert NeuralNFTMarketplace__RoyaltyFeesTooHigh(_royaltyFeesInBips);
        }
        _;
    }
    modifier isCalledFromContract() {
        if (msg.sender != address(this)) {
            revert NeuralNFTMarketplace__CannotCallOutsideContract();
        }
        _;
    }

    /// @notice Initializes the marketplace and owner of the contract.
    constructor() ERC721("NeuralNFT", "NNFT") {
        i_owner = msg.sender;
    }

    // Receive and Fallback functions
    receive() external payable {
        s_earnings[i_owner] += msg.value;
    }

    fallback() external payable {
        s_earnings[i_owner] += msg.value;
    }

    function approve(address to, uint256 tokenId) public override {
        super.approve(to, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override isCalledFromContract {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override isCalledFromContract {
        super.safeTransferFrom(from, to, tokenId);
    }

    function mintNft(
        string memory nftURI, // the CID returned from nftstorage
        address royaltyReceiver,
        uint96 _royaltyFeesInBips
    ) public isRoyaltyTooHigh(_royaltyFeesInBips) nonReentrant returns (uint256 newItemId) {
        newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        setRoyaltyInfo(newItemId, royaltyReceiver, _royaltyFeesInBips);
        _setTokenURI(newItemId, nftURI);
        _tokenIds.increment();
        emit NewNftMinted(msg.sender, newItemId, _royaltyFeesInBips);
    }

    function setRoyaltyInfo(
        uint256 _tokenId,
        address _receiver,
        uint96 _royaltyFeesInBips
    ) public isRoyaltyTooHigh(_royaltyFeesInBips) {
        _setTokenRoyalty(_tokenId, _receiver, _royaltyFeesInBips);
        emit NftRoyaltyUpdated(msg.sender, _tokenId, _royaltyFeesInBips);
    }

    /**
     * @notice Lists an NFT for sale on the marketplace
     * @param tokenId The ID of the NFT in the NFT contract
     * @param price The desired listing price by the seller
     */
    function listItem(uint256 tokenId, uint256 price)
        public
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
        if (getApproved(tokenId) != address(this)) {
            revert NeuralNFTMarketplace__NotApprovedForMarketplace();
        }

        s_earnings[i_owner] += msg.value;
        s_listings[tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, tokenId, price);
    }

    /**
     * @notice Buys an NFT which is on sale in the marketplace
     * @param tokenId The ID of the NFT in the NFT contract
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
        s_earnings[i_owner] = (msg.value * PLATFORM_FEE) / 100;
        delete (s_listings[tokenId]);
        safeTransferFrom(listing.seller, msg.sender, tokenId);
        emit ItemBought(msg.sender, tokenId, listing.price);
    }

    /**
     * @notice Cancels a listing by the user in the marketplace
     * @param tokenId The ID of the NFT in the NFT contract
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
     * @notice Updates a listing by the user which is on sale in the marketplace
     * @param tokenId The ID of the NFT in the NFT contract
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
    function withdrawProceeds() external nonReentrant {
        uint256 proceeds = s_earnings[msg.sender];
        if (proceeds <= 0) {
            revert NeuralNFTMarketplace__NoProceeds();
        }
        s_earnings[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert NeuralNFTMarketplace__TransferFailed();
        }
    }

    /// @notice The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @notice Getters and Setters

    function setListFee(uint256 newListFee) public {
        if (msg.sender != i_owner) {
            revert NeuralNFTMarketplace__NotOwner();
        }
        s_list_fee = newListFee;
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return s_listings[tokenId];
    }

    function getEarnings(address seller) external view returns (uint256) {
        return s_earnings[seller];
    }

    function getListFee() external view returns (uint256) {
        return s_list_fee;
    }

    function getPlatformFee() external pure returns (uint256) {
        return PLATFORM_FEE;
    }
}
