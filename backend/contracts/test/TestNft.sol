// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error TestNft__NonExistentToken();

contract TestNft is ERC721, ERC721Enumerable, ERC2981, Ownable {
    string public nftURI;

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

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) public onlyOwner {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    // The following functions are overrides required by Solidity.

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
