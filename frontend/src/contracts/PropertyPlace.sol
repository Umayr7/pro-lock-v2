pragma solidity >=0.5.0 <0.6.0;

contract PropertyPlace {
    
    uint public propertyCount = 0;

    struct Property {
        uint256 price;
        uint256 size;
        string image1;
        string propertyAddress;
        string description;
        bool available;    
    }
    // Property array
    Property[] public properties;

    // mapping
    mapping (uint => address)  propertyToOwner;
    mapping (address => uint) ownerPropertyCount;
    mapping (string => bool)  existProperty;

    // register event
    event PropertyRegister(
        uint256 id,
        uint256 price,
        uint256 size,
        string image1,
        string propertyAddress,
        string description,
        bool available
    );
    
    // Property Register
    function _createRegistry(uint _price,uint _size, string memory _image1,string memory _propertyAddress,string memory _description,bool _available) public{
        require(!existProperty[_propertyAddress] , "error failed");
        existProperty[_propertyAddress] = true;
        uint id = properties.push(Property(_price,_size,_image1,_propertyAddress,_description, _available)) - 1;        
        propertyCount++;
        propertyToOwner[id] = msg.sender;
        ownerPropertyCount[msg.sender]++;
        emit PropertyRegister(id,_price,_size,_image1,_propertyAddress,_description,_available);
    }


    // properties by owner
    function getPropertiesByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerPropertyCount[_owner]);
    uint counter = 0;
        for (uint i = 0; i < properties.length; i++) {
        if (propertyToOwner[i] == _owner) {
            result[counter] = i;
            counter++;
            }
        }
        return result;
    }
}