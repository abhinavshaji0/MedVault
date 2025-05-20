// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MedVault.sol"; // Import the MedVault contract from the same directory (optional, kept for deleteRecord)

contract MeDossier {
    struct Record {
        string ipfsHash;
        string doctorName;
        string reason;
        string visitedDate;
        string prevVisitDate;
        string prevReason;
    }

    mapping(address => Record[]) public medicalRecords;

    // Events for debugging and tracking
    event AccessCheck(address indexed caller, address indexed patient, string callerUserType, bool isAllowed);
    event RecordDeleted(address indexed patient, uint256 indexed index);
    event PatientRecordsCleared(address indexed patient);

    // Store a record for a specific patient (no access control)
    function storeRecord(
        address _patientAddress,
        string memory _ipfsHash,
        string memory _doctorName,
        string memory _reason,
        string memory _visitedDate,
        string memory _prevVisitDate,
        string memory _prevReason
    ) public {
        medicalRecords[_patientAddress].push(Record({
            ipfsHash: _ipfsHash,
            doctorName: _doctorName,
            reason: _reason,
            visitedDate: _visitedDate,
            prevVisitDate: _prevVisitDate,
            prevReason: _prevReason
        }));
    }

    function deleteRecord(address _patientAddress, uint256 index) public {
        // Keep access control for deleteRecord to prevent unauthorized deletions
        require(index < medicalRecords[_patientAddress].length, "Index out of bounds");
        require(msg.sender == _patientAddress || isDoctor(msg.sender), "Unauthorized");
        Record[] storage records = medicalRecords[_patientAddress];
        records[index] = records[records.length - 1]; // Move last record to deleted position
        records.pop(); // Remove last element
        emit RecordDeleted(_patientAddress, index);
    }

    // Clear all records for a patient (only the patient can clear their own records)
    function clearPatientRecords() public {
        require(registeredUsers(msg.sender), "User not registered"); // Call the function with parentheses
        delete medicalRecords[msg.sender]; // Clear all records for the caller
        emit PatientRecordsCleared(msg.sender);
    }

    // Helper function to check if the caller is a doctor (kept for deleteRecord)
    function isDoctor(address _user) private view returns (bool) {
        MedVault userRegistry = MedVault(0xA4DE4b05d72c563F185471B5EfEC73B1593166a5);
        if (!userRegistry.isUserRegistered(_user)) return false;
        string memory userType;
        (, , userType, , , , , , ) = userRegistry.getUserDetails(_user); // Unpack userType only
        bytes memory userTypeBytes = bytes(userType);
        string memory normalizedUserType = string(userTypeBytes);
        if (userTypeBytes.length > 0) {
            while (userTypeBytes[userTypeBytes.length - 1] == 0x20 || userTypeBytes[userTypeBytes.length - 1] == 0x00) { // 0x20 is space, 0x00 is null
                assembly {
                    mstore(userTypeBytes, sub(mload(userTypeBytes), 1))
                }
            }
            uint start = 0;
            while (start < userTypeBytes.length && (userTypeBytes[start] == 0x20 || userTypeBytes[start] == 0x00)) {
                start++;
            }
            if (start > 0) {
                bytes memory trimmedBytes = new bytes(userTypeBytes.length - start);
                for (uint i = 0; i < trimmedBytes.length; i++) {
                    trimmedBytes[i] = userTypeBytes[start + i];
                }
                normalizedUserType = string(trimmedBytes);
            }
        }
        return keccak256(bytes(normalizedUserType)) == keccak256(bytes("doctor"));
    }

    // Helper function to check if a user is registered in MedVault
    function registeredUsers(address _user) private view returns (bool) {
        MedVault userRegistry = MedVault(0xA4DE4b05d72c563F185471B5EfEC73B1593166a5);
        return userRegistry.isUserRegistered(_user);
    }

    function getRecordsByDate(address _user, string memory _date) public view returns (string[] memory) {
        Record[] storage records = medicalRecords[_user];
        uint count = 0;
        for (uint i = 0; i < records.length; i++) {
            if (keccak256(bytes(records[i].visitedDate)) == keccak256(bytes(_date))) {
                count++;
            }
        }
        string[] memory reasons = new string[](count);
        uint index = 0;
        for (uint i = 0; i < records.length; i++) {
            if (keccak256(bytes(records[i].visitedDate)) == keccak256(bytes(_date))) {
                reasons[index] = records[i].reason;
                index++;
            }
        }
        return reasons;
    }
}