pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GitHubCommitNFT is ERC721, Ownable {
    uint256 public tokenId;
    address public topContributor;
    mapping(address => uint256) public commitCounts;

    event CommitAdded(address indexed user, uint256 count);
    event NFTTransferred(address indexed previousOwner, address indexed newOwner, uint256 tokenId);

    constructor() ERC721("GitHubCommitNFT", "GCNFT") {
        tokenId = 1;
    }

    // Add commits for a user and potentially transfer NFT
    function addCommits(address user, uint256 count) external onlyOwner {
        commitCounts[user] += count;
        emit CommitAdded(user, commitCounts[user]);

        // Check if the user surpasses the current top contributor
        if (topContributor == address(0) || commitCounts[user] > commitCounts[topContributor]) {
            address previousTopContributor = topContributor;
            topContributor = user;

            if (_exists(tokenId)) {
                _transfer(previousTopContributor, topContributor, tokenId);
                emit NFTTransferred(previousTopContributor, topContributor, tokenId);
            } else {
                _safeMint(topContributor, tokenId);
                emit NFTTransferred(address(0), topContributor, tokenId);
            }
        }
    }

    // Get the number of commits for a user
    function getCommitCount(address user) external view returns (uint256) {
        return commitCounts[user];
    }
}
