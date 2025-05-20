// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMedVault {
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
    ) external;

    function isUserRegistered(address _userAddress) external view returns (bool);
}

contract DoctorApproval {
    address public admin;
    IMedVault public medVault;

    struct DoctorRequest {
        address doctorAddress;
        string name;
        string contact;
        string licenseNo;
        string hospitalName;
        string faculty;
        bool isPending;
    }

    mapping(address => DoctorRequest) public pendingDoctors;
    address[] public pendingDoctorAddresses;

    event DoctorRequested(address indexed doctorAddress, string name);
    event DoctorApproved(address indexed doctorAddress);
    event DoctorRejected(address indexed doctorAddress);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor(address _medVaultAddress) {
        admin = msg.sender;
        medVault = IMedVault(_medVaultAddress);
    }

    function requestDoctorRegistration(
        string memory _name,
        string memory _contact,
        string memory _licenseNo,
        string memory _hospitalName,
        string memory _faculty
    ) external {
        require(!medVault.isUserRegistered(msg.sender), "User already registered in MedVault");
        require(!pendingDoctors[msg.sender].isPending, "Registration request already pending");

        pendingDoctors[msg.sender] = DoctorRequest({
            doctorAddress: msg.sender,
            name: _name,
            contact: _contact,
            licenseNo: _licenseNo,
            hospitalName: _hospitalName,
            faculty: _faculty,
            isPending: true
        });

        pendingDoctorAddresses.push(msg.sender);
        emit DoctorRequested(msg.sender, _name);
    }

    // Approve doctor by calling MedVault as the doctor
    function approveDoctor(address _doctorAddress) external onlyAdmin {
    DoctorRequest memory request = pendingDoctors[_doctorAddress];
    require(request.isPending, "No pending request for this address");
    removePendingRequest(_doctorAddress);
    emit DoctorApproved(_doctorAddress);
}

    function rejectDoctor(address _doctorAddress) external onlyAdmin {
        require(pendingDoctors[_doctorAddress].isPending, "No pending request for this address");
        removePendingRequest(_doctorAddress);
        emit DoctorRejected(_doctorAddress);
    }

    function removePendingRequest(address _doctorAddress) internal {
        pendingDoctors[_doctorAddress].isPending = false;
        for (uint i = 0; i < pendingDoctorAddresses.length; i++) {
            if (pendingDoctorAddresses[i] == _doctorAddress) {
                pendingDoctorAddresses[i] = pendingDoctorAddresses[pendingDoctorAddresses.length - 1];
                pendingDoctorAddresses.pop();
                break;
            }
        }
    }

    function getPendingDoctors() external view returns (DoctorRequest[] memory) {
        DoctorRequest[] memory requests = new DoctorRequest[](pendingDoctorAddresses.length);
        for (uint i = 0; i < pendingDoctorAddresses.length; i++) {
            requests[i] = pendingDoctors[pendingDoctorAddresses[i]];
        }
        return requests;
    }

    function setAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }
}