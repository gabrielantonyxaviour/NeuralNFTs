// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NeuralNFTMarketplace__PriceMustBeAboveZero();
error NeuralNFTMarketplace__NotApprovedForMarketplace();
error NeuralNFTMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NeuralNFTMarketplace__NotOwner();
error NeuralNFTMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NeuralNFTMarketplace__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price
);
error NeuralNFTMarketplace__NoProceeds();
error NeuralNFTMarketplace__TransferFailed();
error NeuralNFTMarketplace__InsufficientFunds();
error NeuralNFTMarketplace__AlreadyApproved();

/**
 * @author Gabriel Antony Xaviour
 * @title NeuralNFTMarketplace
 * @notice A marketplace for NFTs with the sixth sense
 * @dev Contract secured and protected by a reentrancy guard.
 */
contract NeuralNFTMarketplace is ReentrancyGuard {
    // Structures
    struct Listing {
        uint256 price;
        address seller;
    }

    // Constant variables
    uint256 public constant PLATFORM_FEE = 2;
    uint256 public constant LIST_FEE = 5 ether;

    // Immutable variable
    address private immutable i_owner;

    // State variables
    mapping(address => mapping(uint256 => Listing)) private s_listings; // nftAddress => tokenId => listing
    mapping(address => uint256) private s_earnings; // user => earnings
    mapping(address => bool) private s_approvedForMarketplace; // nftAddress => approvedOrNot?

    /// @dev Fired for indexing data using theGraph protocol (https://thegraph.com/docs/en/about/)
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCancelled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ApprovedNftAddress(
        address indexed owner,
        address indexed nftAddress,
        string abiHash
    );

    /// @notice Modifiers pre-defined for cleaner code
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NeuralNFTMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }
    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NeuralNFTMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }
    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NeuralNFTMarketplace__NotOwner();
        }
        _;
    }

    /// @notice Initializes the marketplace and owner of the contract.
    constructor() {
        i_owner = msg.sender;
    }

    // Receive and Fallback functions
    receive() external payable {
        s_earnings[i_owner] += msg.value;
    }

    fallback() external payable {
        s_earnings[i_owner] += msg.value;
    }

    /**
     * @notice Lists an NFT for sale on the marketplace
     * @param nftAddress The address of the contract of the NFT
     * @param tokenId The ID of the NFT in the NFT contract
     * @param price The desired listing price by the seller
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        public
        payable
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (msg.value < LIST_FEE) {
            revert NeuralNFTMarketplace__InsufficientFunds();
        }
        if (price <= 0) {
            revert NeuralNFTMarketplace__PriceMustBeAboveZero();
        }

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NeuralNFTMarketplace__NotApprovedForMarketplace();
        }

        s_earnings[i_owner] += msg.value;
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    /**
     * @notice Buys an NFT which is on sale in the marketplace
     * @param nftAddress The address of the contract of the NFT
     * @param tokenId The ID of the NFT in the NFT contract
     */
    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        nonReentrant
    {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (msg.value < listing.price) {
            revert NeuralNFTMarketplace__PriceNotMet(
                address(this),
                tokenId,
                listing.price
            );
        }
        s_earnings[listing.seller] =
            s_earnings[listing.seller] +
            (msg.value * (100 - PLATFORM_FEE)) /
            100;
        s_earnings[i_owner] = (msg.value * PLATFORM_FEE) / 100;
        delete (s_listings[nftAddress][tokenId]);

        IERC721(nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, listing.price);
    }

    /**
     * @notice Cancels a listing by the user in the marketplace
     * @param nftAddress The address of the contract of the NFT
     * @param tokenId The ID of the NFT in the NFT contract
     */
    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
        nonReentrant
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCancelled(msg.sender, nftAddress, tokenId);
    }

    /**
     * @notice Updates a listing by the user which is on sale in the marketplace
     * @param nftAddress The address of the contract of the NFT
     * @param tokenId The ID of the NFT in the NFT contract
     * @param newPrice The updated listing price proposed by the seller
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        payable
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        if (msg.value < LIST_FEE) {
            revert NeuralNFTMarketplace__InsufficientFunds();
        }
        if (newPrice <= 0) {
            revert NeuralNFTMarketplace__PriceMustBeAboveZero();
        }
        s_earnings[i_owner] += msg.value;
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
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

    /**
     * @notice Approves an NFT address to the user who approves it first.. It doesn't give royalties to the user it should be added in the NFT contract.
     * @param nftAddress The address of the contract of the NFT
     */
    function approveNftAddress(address nftAddress, string memory nftAbiHash)
        public
    {
        if (s_approvedForMarketplace[nftAddress]) {
            revert NeuralNFTMarketplace__AlreadyApproved();
        }

        s_approvedForMarketplace[nftAddress] = true;

        emit ApprovedNftAddress(msg.sender, nftAddress, nftAbiHash);
    }

    /// @notice Getter functions
    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getEarnings(address seller) external view returns (uint256) {
        return s_earnings[seller];
    }

    function isApproved(address nftAddress) external view returns (bool) {
        return s_approvedForMarketplace[nftAddress];
    }

    function getListFee() external pure returns (uint256) {
        return LIST_FEE;
    }

    function getPlatformFee() external pure returns (uint256) {
        return PLATFORM_FEE;
    }
}
