let web3;
let userAddress;
let accessControlContract;
let medVaultContract;
let dossierContract;
let accessLogContract;

if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('Please install MetaMask to use this app.');
    throw new Error('MetaMask is not installed.');
}

// Contract ABIs and Addresses
const accessControlABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "checker",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "hasAccess",
				"type": "bool"
			}
		],
		"name": "AccessChecked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "doctor",
				"type": "address"
			}
		],
		"name": "AccessGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "doctor",
				"type": "address"
			}
		],
		"name": "AccessRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_doctorAddress",
				"type": "address"
			}
		],
		"name": "grantAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_doctorAddress",
				"type": "address"
			}
		],
		"name": "logAccessCheck",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_doctorAddress",
				"type": "address"
			}
		],
		"name": "revokeAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "doctorAccess",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_doctorAddress",
				"type": "address"
			}
		],
		"name": "hasAccess",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const accessControlAddress = '0x47f108106113A67815CbeD63E1DF405F7b717eb5'; // Replace with deployed AccessControl address

// MedVault Contract ABI and Address
const medVaultABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "getUserDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "contact",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dob",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "bloodGroup",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "gender",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "licenseNo",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hospitalName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "faculty",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "isUserRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_contact",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_userType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_dob",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_bloodGroup",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_gender",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_licenseNo",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_hospitalName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_faculty",
				"type": "string"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "registeredUsers",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unregisterUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "contact",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dob",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "bloodGroup",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "gender",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "licenseNo",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hospitalName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "faculty",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const medVaultAddress = '0xA4DE4b05d72c563F185471B5EfEC73B1593166a5'; // Use new MedVault address if redeployed

// MeDossier Contract ABI and Address
const dossierContractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "caller",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "callerUserType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isAllowed",
				"type": "bool"
			}
		],
		"name": "AccessCheck",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			}
		],
		"name": "PatientRecordsCleared",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "RecordDeleted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "clearPatientRecords",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "deleteRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_date",
				"type": "string"
			}
		],
		"name": "getRecordsByDate",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "medicalRecords",
		"outputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "doctorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "visitedDate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "prevVisitDate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "prevReason",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_doctorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_reason",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_visitedDate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_prevVisitDate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_prevReason",
				"type": "string"
			}
		],
		"name": "storeRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const dossierContractAddress = '0x7706c08A26957747785369d6eDe3d25630C59E60';

// AccessLog Contract ABI and Address
const accessLogABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "doctor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "recordType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"name": "AccessLogged",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "clearAccessLogs",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_doctorAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_recordType",
				"type": "string"
			}
		],
		"name": "logAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "accessControl",
		"outputs": [
			{
				"internalType": "contract AccessControl",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "accessLogs",
		"outputs": [
			{
				"internalType": "address",
				"name": "doctorAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "doctorName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hospital",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "recordType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_patientAddress",
				"type": "address"
			}
		],
		"name": "getAccessLogs",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "doctorAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "doctorName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "hospital",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "recordType",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					}
				],
				"internalType": "struct AccessLog.LogEntry[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "userRegistry",
		"outputs": [
			{
				"internalType": "contract MedVault",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const accessLogAddress = '0x49A5FC0E2ce94E492499a1D3839e4cdF8462374d'; 

console.log('Initializing contracts with addresses:', {
    accessControl: accessControlAddress,
    medVault: medVaultAddress,
    dossier: dossierContractAddress,
    accessLog: accessLogAddress
});

accessControlContract = new web3.eth.Contract(accessControlABI, accessControlAddress);
medVaultContract = new web3.eth.Contract(medVaultABI, medVaultAddress);
dossierContract = new web3.eth.Contract(dossierContractABI, dossierContractAddress);
accessLogContract = new web3.eth.Contract(accessLogABI, accessLogAddress);

// Function to check if user is logged in via MetaMask
async function isUserLoggedIn() {
    try {
        const accounts = await web3.eth.getAccounts();
        return accounts.length > 0;
    } catch (error) {
        console.error('Error checking MetaMask login:', error);
        return false;
    }
}

// Function to check if user has signed out
function isSignedOut() {
    return sessionStorage.getItem('signedOut') === 'true';
}

// Function to clear history and redirect
function clearMedVaultHistoryAndRedirect() {
    sessionStorage.setItem('signedOut', 'true');
    userAddress = null;
    window.location.replace('homepage.html');
}

// Restrict access if signed out or not logged in
async function restrictAccessIfSignedOut() {
    const isLoggedIn = await isUserLoggedIn();
    if (!isLoggedIn || isSignedOut()) {
        console.log('Access restricted: User is signed out or not logged in.');
        alert('You have been signed out or are not logged in. Please log in again.');
        clearMedVaultHistoryAndRedirect();
        return false;
    }
    const accounts = await web3.eth.getAccounts();
    userAddress = accounts[0].toLowerCase();
    console.log('User address set in restrictAccessIfSignedOut:', userAddress);
    sessionStorage.removeItem('signedOut');
    return true;
}

// Handle navigation (including back/forward)
window.addEventListener('popstate', async (event) => {
    console.log('Popstate event triggered:', event.state);
    const canProceed = await restrictAccessIfSignedOut();
    if (!canProceed) {
        history.pushState(null, null, 'homepage.html');
        window.location.replace('homepage.html'); // Ensure immediate redirect
    }
});

// Detect MetaMask account changes
window.ethereum.on('accountsChanged', async (accounts) => {
    if (!accounts.length) {
        console.log('MetaMask accounts disconnected, signing out...');
        clearMedVaultHistoryAndRedirect();
    } else {
        userAddress = accounts[0].toLowerCase();
        console.log('Account changed to:', userAddress);
        await initialize(); // Reinitialize with new account
    }
});

async function initialize() {
    const status = document.getElementById('status');
    try {
        const canProceed = await restrictAccessIfSignedOut();
        if (!canProceed) return;

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0].toLowerCase();
        console.log('Connected doctor address:', userAddress);

        const isRegistered = await medVaultContract.methods.isUserRegistered(userAddress).call();
        if (!isRegistered) {
            throw new Error('Doctor not registered in MedVault. Please register first.');
        }

        const doctorDetails = await medVaultContract.methods.getUserDetails(userAddress).call();
        console.log('Doctor Details:', doctorDetails);
        if (doctorDetails.userType.toLowerCase().trim() !== 'doctor') {
            throw new Error('Only doctors can access patient records. Your user type is: ' + doctorDetails.userType);
        }

        history.replaceState({ page: 'access_records' }, '', window.location.pathname);

        document.getElementById('searchButton')?.addEventListener('click', searchPatient);
        if (!document.getElementById('searchButton')) {
            console.warn('Search button not found in the DOM.');
        }
    } catch (error) {
        console.error('Error initializing:', error);
        status.textContent = 'Initialization failed: ' + error.message;
        status.classList.add('error');
        status.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', initialize);

async function searchPatient() {
    const status = document.getElementById('status');
    const patientOverview = document.getElementById('patientOverview');
    const patientAddressInput = document.getElementById('patientAddress');

    status.innerHTML = '<span class="loading"></span> Searching for patient...';
    status.classList.remove('hidden', 'success', 'error');
    status.style.display = 'block';
    patientOverview.innerHTML = '';

    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
        const patientAddress = patientAddressInput.value.trim().toLowerCase();
        if (!web3.utils.isAddress(patientAddress)) {
            throw new Error('Invalid patient Ethereum address');
        }

        const isPatientRegistered = await medVaultContract.methods.isUserRegistered(patientAddress).call();
        if (!isPatientRegistered) {
            throw new Error('Patient not registered in MedVault.');
        }

        try {
            console.log('Logging access attempt for patient:', patientAddress, 'by doctor:', userAddress);
            await accessLogContract.methods.logAccess(patientAddress, userAddress, "Medical Record Access").send({ from: userAddress });
            console.log('Access logged successfully');
        } catch (logError) {
            console.error('Failed to log access:', logError);
        }

        const hasAccess = await accessControlContract.methods.hasAccess(patientAddress, userAddress).call({ from: userAddress });
        if (!hasAccess) {
            throw new Error('You do not have access to this patient’s records. Ask the patient to grant access.');
        }

        const patientDetails = await medVaultContract.methods.getUserDetails(patientAddress).call();

        const records = [];
        let recordIndex = 0;
        while (true) {
            try {
                const record = await dossierContract.methods.medicalRecords(patientAddress, recordIndex).call();
                if (record.ipfsHash === '' && record.doctorName === '' && record.reason === '' && record.visitedDate === '') {
                    break;
                }
                records.push(record);
                recordIndex++;
            } catch (err) {
                break;
            }
        }

        patientOverview.innerHTML = `
            <div class="patient-overview">
                <h3>Patient Information</h3>
                <div class="patient-info">
                    <div class="info-item">
                        <h4>Name</h4>
                        <p>${patientDetails.name || 'N/A'}</p>
                    </div>
                    <div class="info-item">
                        <h4>Date of Birth</h4>
                        <p>${formatDate(patientDetails.dob) || 'N/A'}</p>
                    </div>
                    <div class="info-item">
                        <h4>Gender</h4>
                        <p>${patientDetails.gender || 'N/A'}</p>
                    </div>
                    <div class="info-item">
                        <h4>Blood Group</h4>
                        <p>${patientDetails.bloodGroup || 'N/A'}</p>
                    </div>
                    <div class="info-item">
                        <h4>Contact</h4>
                        <p>${patientDetails.contact || 'N/A'}</p>
                    </div>
                    <div class="info-item">
                        <h4>Ethereum Address</h4>
                        <p>${patientAddress}</p>
                    </div>
                </div>
                <h3>Medical Records</h3>
                <div class="records-table-container">
                    ${
                        records.length > 0
                        ? `<table class="records-table">
                            <thead>
                                <tr>
                                    <th>IPFS Hash</th>
                                    <th>Doctor</th>
                                    <th>Reason</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${records.map(record => `
                                    <tr>
                                        <td title="${record.ipfsHash}">${truncateHash(record.ipfsHash)}</td>
                                        <td>${record.doctorName || 'N/A'}</td>
                                        <td>${record.reason || 'N/A'}</td>
                                        <td>${formatDate(record.visitedDate) || 'N/A'}</td>
                                        <td>
                                            <button class="action-button view-record" title="View Record" data-id="${record.ipfsHash}">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button class="action-button download-record" title="Download Record" data-id="${record.ipfsHash}">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>`
                        : `<div class="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3>No Records Found</h3>
                            <p>No medical records available for this patient.</p>
                        </div>`
                    }
                </div>
            </div>
        `;

        document.querySelectorAll('.view-record').forEach(button => {
            button.addEventListener('click', function() {
                const recordId = this.getAttribute('data-id');
                window.location.href = `patient-details.html?recordId=${encodeURIComponent(recordId)}`;
            });
        });

        document.querySelectorAll('.download-record').forEach(button => {
            button.addEventListener('click', async function() {
                const recordId = this.getAttribute('data-id');
                const ipfsUrl = `https://ipfs.io/ipfs/${recordId}`;

                try {
                    const response = await fetch(ipfsUrl, { method: 'HEAD' });
                    const contentType = response.headers.get('Content-Type');
                    const extension = getFileExtension(contentType) || '.bin';

                    const link = document.createElement('a');
                    link.href = ipfsUrl;
                    link.download = `${recordId}${extension}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (error) {
                    console.error('Error determining file type:', error);
                    const link = document.createElement('a');
                    link.href = ipfsUrl;
                    link.download = `${recordId}.bin`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        });

        status.textContent = 'Patient records loaded successfully.';
        status.classList.add('success');
        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 3000);
    } catch (error) {
        console.error('Error searching patient:', error);
        status.textContent = 'Failed to load patient records: ' + error.message;
        status.classList.add('error');
        status.classList.remove('hidden');
        patientOverview.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3>No Records Found</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Helper functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function truncateHash(hash) {
    if (hash.length > 16) {
        return hash.substring(0, 8) + '...' + hash.substring(hash.length - 8);
    }
    return hash;
}

function getFileExtension(contentType) {
    const mimeToExt = {
        'application/pdf': '.pdf',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'text/plain': '.txt',
        'application/json': '.json',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
    };
    return mimeToExt[contentType] || null;
}