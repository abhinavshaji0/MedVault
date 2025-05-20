// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MedVault.sol"; // Import the MedVault contract for user verification

contract AccessControl {
    mapping(address => mapping(address => bool)) public doctorAccess; // patient => doctor => hasAccess

    // Events for tracking access changes and record access attempts
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    event AccessChecked(address indexed checker, address indexed patient, bool hasAccess);

    // Grant access to a doctor (only the patient can grant access)
    function grantAccess(address _doctorAddress) public {
        MedVault userRegistry = MedVault(0xA4DE4b05d72c563F185471B5EfEC73B1593166a5);
        require(userRegistry.isUserRegistered(msg.sender), "Patient not registered");
        require(userRegistry.isUserRegistered(_doctorAddress), "Doctor not registered");

        // Unpack the tuple to access userType (index 2)
        (, , string memory patientUserType, , , , , , ) = userRegistry.getUserDetails(msg.sender);
        (, , string memory doctorUserType, , , , , , ) = userRegistry.getUserDetails(_doctorAddress);

        require(
            keccak256(bytes(patientUserType)) == keccak256(bytes("patient")),
            "Only patients can grant access"
        );
        require(
            keccak256(bytes(doctorUserType)) == keccak256(bytes("doctor")),
            "Target must be a doctor"
        );

        doctorAccess[msg.sender][_doctorAddress] = true;
        emit AccessGranted(msg.sender, _doctorAddress);
    }

    // Revoke access from a doctor (only the patient can revoke access)
    function revokeAccess(address _doctorAddress) public {
        MedVault userRegistry = MedVault(0xA4DE4b05d72c563F185471B5EfEC73B1593166a5);
        require(userRegistry.isUserRegistered(msg.sender), "Patient not registered");
        require(userRegistry.isUserRegistered(_doctorAddress), "Doctor not registered");

        // Unpack the tuple to access userType (index 2)
        (, , string memory patientUserType, , , , , , ) = userRegistry.getUserDetails(msg.sender);

        require(
            keccak256(bytes(patientUserType)) == keccak256(bytes("patient")),
            "Only patients can revoke access"
        );
        require(doctorAccess[msg.sender][_doctorAddress], "No access to revoke");

        doctorAccess[msg.sender][_doctorAddress] = false;
        emit AccessRevoked(msg.sender, _doctorAddress);
    }

    // Check if a doctor has access to a patient's records (read-only, no state modification)
    function hasAccess(address _patientAddress, address _doctorAddress) public view returns (bool) {
        MedVault userRegistry = MedVault(0xA4DE4b05d72c563F185471B5EfEC73B1593166a5);
        require(userRegistry.isUserRegistered(_patientAddress), "Patient not registered");
        require(userRegistry.isUserRegistered(_doctorAddress), "Doctor not registered");

        // Unpack the tuple to access userType (index 2)
        (, , string memory doctorUserType, , , , , , ) = userRegistry.getUserDetails(_doctorAddress);

        require(
            keccak256(bytes(doctorUserType)) == keccak256(bytes("doctor")),
            "Caller must be a doctor"
        );

        bool access = doctorAccess[_patientAddress][_doctorAddress];
        return access;
    }

    // Non-view function to log access check (requires a transaction)
    function logAccessCheck(address _patientAddress, address _doctorAddress) public {
        MedVault userRegistry = MedVault(0xA4DE4b05d72c563F185471B5EfEC73B1593166a5);
        require(userRegistry.isUserRegistered(_patientAddress), "Patient not registered");
        require(userRegistry.isUserRegistered(_doctorAddress), "Doctor not registered");

        // Unpack the tuple to access userType (index 2)
        (, , string memory doctorUserType, , , , , , ) = userRegistry.getUserDetails(_doctorAddress);

        require(
            keccak256(bytes(doctorUserType)) == keccak256(bytes("doctor")),
            "Caller must be a doctor"
        );

        bool access = doctorAccess[_patientAddress][_doctorAddress];
        emit AccessChecked(msg.sender, _patientAddress, access);
    }
}