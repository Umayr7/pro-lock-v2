pragma solidity >=0.5.0 <0.6.0;


contract UserContract {
    struct User {
        string name;
        string email;
        string password;
        address AccountNo;    
    }
    User[] public users;

    mapping (address => bool) public existUser;
    mapping (string => bool) private existEmail;

    event UserRegister(
        uint256 id,
        string name,
        string Password,
        address AccountNo
    );
    
    function _createUser(string memory _name,string memory _email,string memory _password,address _accountNo) internal{
        require(!existUser[_accountNo] && !existEmail[_email]);
        existUser[_accountNo] = true;
        existEmail[_email] = true;
        uint id = users.push(User(_name,_email, _password, _accountNo)) - 1;        
    
        emit UserRegister(id,_name,_password,_accountNo);
    }

    function registerUser(string memory _name,string memory _email,string memory _password) public {
        address  _accountNo = msg.sender;
        _createUser(_name,_email,_password,_accountNo);
    }

    function checkUser(string calldata _email, string calldata _password) external view returns(int) {
        int counter = -1;
        for (uint i = 0; i < users.length; i++) {
            if (uint(keccak256(abi.encodePacked(users[i].email))) == uint(keccak256(abi.encodePacked(_email)))) {
                if (uint(keccak256(abi.encodePacked(users[i].password))) == uint(keccak256(abi.encodePacked(_password)))){
                    counter = int256(i);
                    return counter;
                }              
            }    
        }
        return counter;
    }

}