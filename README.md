MedVault
 
MedVault is a decentralized healthcare platform built on the Ethereum blockchain, designed to securely manage patient and doctor registrations with a focus on transparency, security, and efficiency. By leveraging smart contracts, MedVault ensures immutable storage of medical data and a streamlined doctor approval process, all integrated with MetaMask for user authentication.

Features
MedVault offers a robust set of features to enhance healthcare data management:

Patient Registration: Patients can register with personal details (name, contact, DOB, blood group, gender) stored securely on the Ethereum blockchain.
Doctor Approval Workflow: Doctors submit registration requests with professional details (license number, hospital, faculty), which are reviewed and approved/rejected by an admin through a dedicated smart contract.
MetaMask Integration: Seamless wallet connectivity for user authentication and transaction signing, ensuring secure interactions with the blockchain.
Admin Dashboard: A user-friendly interface for admins to view, approve, or reject pending doctor registrations in real-time.
Responsive UI: Dynamic form fields that toggle based on user type (patient or doctor), improving the user experience.
Smart Contract Security: Two Solidity contracts (MedVault and DoctorApproval) with validation checks to prevent unauthorized actions and ensure data integrity.
DOB Validation: Client-side validation to ensure the date of birth is not in the future, enhancing data accuracy.
Session Management: Handles MetaMask account changes and signouts, redirecting users appropriately.

Prerequisites
To run MedVault locally or deploy it, ensure you have the following:

MetaMask: Browser extension installed and configured with an Ethereum account (testnet recommended, e.g., Sepolia).
Web3.js: Included via CDN (https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js) or install locally (npm install web3).
Ethereum Testnet: Access to a testnet (e.g., Sepolia) with test ETH for deploying contracts and testing transactions.
Solidity Compiler: Version 0.8.x for compiling smart contracts (use Remix or Truffle).
Truffle/Remix: For deploying smart contracts to the Ethereum network.
Browser: Modern browser (Chrome, Firefox) with MetaMask support.
Git: For cloning the repository.
Live Server: VS Code extension or any local server (http-server) to serve the frontend.


Deploy Smart Contracts:

MedVault Contract:
Deploy MedVault.sol to your Ethereum testnet (e.g., Sepolia) using Remix or Truffle.
Note the deployed address (e.g., 0xA4DE4b05d72c563F185471B5EfEC73B1593166a5).


DoctorApproval Contract:
Deploy DoctorApproval.sol with the MedVault address as the constructor argument.
Note the deployed address (e.g., 0x1a73aA1521FfC075E06CFC39d25E2dFb4749d68D).


Update script.js and script_admin.js with the correct contract addresses:const medVaultAddress = 'YOUR_MEDVAULT_ADDRESS';
const doctorApprovalAddress = 'YOUR_DOCTORAPPROVAL_ADDRESS';

Usage

Connect MetaMask:

Ensure MetaMask is installed and connected to a testnet (e.g., Sepolia).
Switch to the admin account (0xCe5Ab2d31301232E95dAC52d3153428c5aDD49Dc) for admin tasks.


Patient Registration:

Navigate to the registration page (index.html).
Select "Patient" from the user type dropdown.
Fill in details (name, contact, DOB, blood group, gender).
Submit to register via the MedVault contract.
Redirects to patient-dashboard.html upon success.


Doctor Registration:

Select "Doctor" from the user type dropdown.
Enter professional details (name, contact, license number, hospital, faculty).
Submit to request registration via the DoctorApproval contract.
Await admin approval, then register in MedVault after approval.


Admin Dashboard:

Access admin.html with the admin account.
View pending doctor registrations.
Approve or reject requests, which updates the DoctorApproval contract.
Approved doctors can then register in MedVault.


Login:

Click the login button to authenticate via MetaMask signature.
Redirects to patient-dashboard.html or doctor-dashboard.html based on user type.



Smart Contracts

MedVault.sol:

Manages user registrations (patients and doctors).
Stores details like name, contact, user type, DOB, blood group, gender, license number, hospital, and faculty.
Functions: registerUser, isUserRegistered, getUserDetails, unregisterUser.


DoctorApproval.sol:

Handles doctor registration requests and admin approvals.
Stores pending requests and allows admins to approve/reject.
Functions: requestDoctorRegistration, approveDoctor, rejectDoctor, getPendingDoctors.



MedVault is a step toward decentralized healthcare. Join us in building a secure, transparent future for medical data management! 🌐
