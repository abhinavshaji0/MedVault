// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MedVault.sol"; // For user registration verification
import "./MedVault1.sol"; // For access permission checks

contract AccessLog {
    // Structure to store access log details
    struct LogEntry {
        address doctorAddress;      // Doctor attempting access
        string doctorName;          // Doctor's name from MedVault
        string hospital;            // Doctor's hospital from MedVault
        string recordType;          // Type of record accessed (e.g., IPFS hash or description)
        uint256 timestamp;          // Time of access attempt
        string status;              // "authorized", "unauthorized", "pending"
    }

    // Mapping to store access logs per patient
    mapping(address => LogEntry[]) public accessLogs;

    // Events for tracking access attempts
    event AccessLogged(
        address indexed patient,
        address indexed doctor,
        string recordType,
        uint256 timestamp,
        string status
    );

    // Reference to MedVault and AccessControl contracts (replace with actual deployed addresses)
    MedVault public userRegistry = MedVault(0xA4DE4b05d72c563F185471B5EfEC73B1593166a5);
    AccessControl public accessControl = AccessControl(0x47f108106113A67815CbeD63E1DF405F7b717eb5); // Replace with actual address

    // Log an access attempt
    function logAccess(
        address _patientAddress,
        address _doctorAddress,
        string memory _recordType
    ) public {
        require(userRegistry.isUserRegistered(_patientAddress), "Patient not registered");
        require(userRegistry.isUserRegistered(_doctorAddress), "Doctor not registered");

        // Verify the caller is a doctor
        (, , string memory doctorUserType, , , , , , ) = userRegistry.getUserDetails(_doctorAddress);
        require(
            keccak256(bytes(doctorUserType)) == keccak256(bytes("doctor")),
            "Caller must be a doctor"
        );

        // Get doctor details
        (string memory doctorName, , , , , , , string memory hospitalName, ) = userRegistry.getUserDetails(_doctorAddress);

        // Check access permission
        bool hasPermission = accessControl.hasAccess(_patientAddress, _doctorAddress);
        string memory status = hasPermission ? "authorized" : "unauthorized";

        // Create log entry
        LogEntry memory newLog = LogEntry({
            doctorAddress: _doctorAddress,
            doctorName: doctorName,
            hospital: hospitalName,
            recordType: _recordType,
            timestamp: block.timestamp,
            status: status
        });

        // Store the log
        accessLogs[_patientAddress].push(newLog);

        // Emit event
        emit AccessLogged(_patientAddress, _doctorAddress, _recordType, block.timestamp, status);
    }

    // Get all access logs for a patient (only the patient can view their logs)
    function getAccessLogs(address _patientAddress) public view returns (LogEntry[] memory) {
        require(msg.sender == _patientAddress, "Only the patient can view their access logs");
        require(userRegistry.isUserRegistered(_patientAddress), "Patient not registered");
        return accessLogs[_patientAddress];
    }

    // Clear all access logs for a patient (only the patient can clear their logs)
    function clearAccessLogs() public {
        require(userRegistry.isUserRegistered(msg.sender), "Patient not registered");
        delete accessLogs[msg.sender];
    }
}