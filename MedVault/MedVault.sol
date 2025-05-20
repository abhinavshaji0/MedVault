// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedVault {
    struct User {
        string name;
        string contact;
        string userType; // "patient" or "doctor"
        string dob; // Only for patients
        string bloodGroup; // Only for patients
        string gender; // Only for patients
        string licenseNo; // Only for doctors
        string hospitalName; // Only for doctors
        string faculty; // Only for doctors
    }

    mapping(address => User) public users; // Public mapping for open access to user details
    mapping(address => bool) public registeredUsers; // Public mapping for registration status

    // Register a new user
    function registerUser(
        string memory _name,
        string memory _contact,
        string memory _userType,
        string memory _dob,
        string memory _bloodGroup,
        string memory _gender,
        string memory _licenseNo,
        string memory _hospitalName,
        string memory _faculty
    ) public {
        require(!registeredUsers[msg.sender], "User already registered");
        require(
            keccak256(bytes(_userType)) == keccak256(bytes("patient")) || 
            keccak256(bytes(_userType)) == keccak256(bytes("doctor")), 
            "Invalid user type"
        );

        users[msg.sender] = User({
            name: _name,
            contact: _contact,
            userType: _userType,
            dob: keccak256(bytes(_userType)) == keccak256(bytes("patient")) ? _dob : "",
            bloodGroup: keccak256(bytes(_userType)) == keccak256(bytes("patient")) ? _bloodGroup : "",
            gender: keccak256(bytes(_userType)) == keccak256(bytes("patient")) ? _gender : "",
            licenseNo: keccak256(bytes(_userType)) == keccak256(bytes("doctor")) ? _licenseNo : "",
            hospitalName: keccak256(bytes(_userType)) == keccak256(bytes("doctor")) ? _hospitalName : "",
            faculty: keccak256(bytes(_userType)) == keccak256(bytes("doctor")) ? _faculty : ""
        });

        registeredUsers[msg.sender] = true;
    }

    // Get user details (public, no access control, allows any caller to view registered users)
    function getUserDetails(address _userAddress) public view returns (
        string memory name,
        string memory contact,
        string memory userType,
        string memory dob,
        string memory bloodGroup,
        string memory gender,
        string memory licenseNo,
        string memory hospitalName,
        string memory faculty
    ) {
        require(registeredUsers[_userAddress], "User not registered");
        User memory user = users[_userAddress];
        return (
            user.name,
            user.contact,
            user.userType,
            user.dob,
            user.bloodGroup,
            user.gender,
            user.licenseNo,
            user.hospitalName,
            user.faculty
        );
    }

    // Check if a user is registered (public, no access control)
    function isUserRegistered(address _userAddress) public view returns (bool) {
        return registeredUsers[_userAddress];
    }

    // Unregister a user (allow only the user to delete their account)
    function unregisterUser() public {
        require(registeredUsers[msg.sender], "User not registered");
        delete users[msg.sender]; // Clear user data
        registeredUsers[msg.sender] = false; // Mark as unregistered
    }
}