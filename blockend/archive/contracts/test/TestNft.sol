// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Errors
error TestNft__NonExistentToken();

/**
 * @author Gabriel Antony Xaviour
 * @title TestNft
 * @notice This is a recommended template contract for NeuralNFT creators.
 * @dev This is a ERC2981 contract which provides verifiable on-chain royalties to the creator of the NFT.
 */
contract TestNft is ERC721, ERC721Enumerable, ERC2981, Ownable {
    /// @notice Neural NFT metadata URI
    string public nftURI;

    /// @notice Initializes royalty, TokenURI and mints the NFT to the creator
    constructor(
        string memory name,
        string memory symbol,
        uint96 _royaltyFeesInBips,
        string memory _nftURI
    ) ERC721(name, symbol) {
        setRoyaltyInfo(owner(), _royaltyFeesInBips);
        nftURI = _nftURI;
        _safeMint(msg.sender, 0);
    }

    /// @notice Updates royalty data
    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) public onlyOwner {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    /// @notice The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (tokenId != 0) {
            revert TestNft__NonExistentToken();
        }
        return nftURI;
    }
}
