// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract RealEstate is ERC721URIStorage, Ownable{
    uint256 public propertyCount;
    struct Property {
        uint tokenId;
        uint price;
        address payable owner;
        bool isAvailable;
    }
    mapping(uint => Property) public properties;
    
    // Register Property Event
    event RegisterProperty(
        uint tokenId,
        uint price,
        address indexed owner
    );

    // But Property Event
    event BuyProperty(
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    // List Property Event
    event ListProperty(
        uint tokenId,
        uint price,
        address indexed owner
    );

    // UnList Property Event
    event UnListProperty(
        uint tokenId,
        uint price,
        address indexed owner
    );

    constructor() ERC721("Trust Property", "NFT") {}

    function addProperty(string memory _ipfsURI, uint _price) external  {
        require(_price > 0, "Price must be greater than zero");
        require(msg.sender != address(0));

        propertyCount++;
		uint256 tokenId = propertyCount;
    
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _ipfsURI);
        
        properties[tokenId] = Property (
            tokenId,
            _price,
            payable(msg.sender),
            false
        );

        // Trigger event
        emit RegisterProperty(
            tokenId,
            _price,
            msg.sender
        );
    }

    function listProperty(uint _tokenID) external {
        Property storage property = properties[_tokenID];
        require(msg.sender != address(0), "Address is zero address");
        require(property.owner == msg.sender,"Owner can only put thier Property on sale");
        require(_tokenID > 0 && _tokenID <= propertyCount, "Property doesn't exist");
        require(property.isAvailable == false,"Property is already onSale");
        // Set Availability to True
        property.isAvailable = true;
        
        emit ListProperty(
            property.tokenId,
            property.price,
            property.owner
        );
    }

    function unListProperty(uint _tokenID) external {
        Property storage property = properties[_tokenID];
        require(msg.sender != address(0), "Address is zero address");
        require(property.owner == msg.sender,"Owner can only put thier Property on sale");
        require(_tokenID > 0 && _tokenID <= propertyCount, "Property doesn't exist");
        require(property.isAvailable == true,"Property is already unlisted");
        // Set Availability to True
        property.isAvailable = false;
        
        emit UnListProperty(
            property.tokenId,
            property.price,
            property.owner
        );
    }

    function buyProperty(uint _tokenID) external payable  {
        Property storage property = properties[_tokenID];
        require(msg.sender != address(0), "Address is zero address");
        
        require(property.owner != msg.sender,"Owner cannot buy thier own Property");
        require(msg.value >= property.price,"Price is inSufficient");
        require(_tokenID > 0 && _tokenID <= propertyCount, "Property doesn't exist");

        // Transfer Amount to Owner
        property.owner.transfer(msg.value);
        
        // Set Availability to False
        property.isAvailable = false;
        
        // Transfer Ownership to new Owner
        _transfer(property.owner, msg.sender, property.tokenId);
        property.owner = payable(msg.sender);

        // Trigger event
        emit BuyProperty(
            property.tokenId,
            msg.value,
            property.owner,
            msg.sender
        );
    }
}