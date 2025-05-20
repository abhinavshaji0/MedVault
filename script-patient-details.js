let web3;
let userAddress;
let accessControlContract;
let medVaultContract;
let dossierContract;

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
console.log('Initializing contracts with addresses:', {
    accessControl: accessControlAddress,
    medVault: medVaultAddress,
    dossier: dossierContractAddress
});

accessControlContract = new web3.eth.Contract(accessControlABI, accessControlAddress);
medVaultContract = new web3.eth.Contract(medVaultABI, medVaultAddress);
dossierContract = new web3.eth.Contract(dossierContractABI, dossierContractAddress);

// MIME type to file extension mapping
const mimeToExtension = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'text/plain': '.txt',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/octet-stream': '.bin'
};

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
    const status = document.getElementById('statusMessage');
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

        const urlParams = new URLSearchParams(window.location.search);
        const recordId = urlParams.get('recordId');
        if (!recordId) {
            throw new Error('No record ID provided in URL.');
        }

        history.replaceState({ page: 'record_details', recordId: recordId }, '', window.location.pathname + window.location.search);

        await loadRecordDetails(recordId);

        document.getElementById('backButton').addEventListener('click', () => {
            window.location.href = 'access-records.html';
        });
    } catch (error) {
        console.error('Error initializing:', error);
        status.textContent = 'Initialization failed: ' + error.message;
        status.classList.add('error');
        status.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', initialize);

async function loadRecordDetails(recordId) {
    const status = document.getElementById('statusMessage');
    const recordInfo = document.getElementById('recordInfo');
    const documentPreview = document.getElementById('documentPreview');
    const previewContent = document.getElementById('previewContent');
    const relatedRecords = document.getElementById('relatedRecords');
    const downloadButton = document.getElementById('downloadButton');

    status.textContent = 'Loading details...';
    status.classList.remove('hidden');
    recordInfo.innerHTML = '';
    documentPreview.classList.add('hidden');
    relatedRecords.innerHTML = '';

    try {
        let patientAddress = null;
        let recordDetails = null;
        let recordIndex = null;
        const accounts = await web3.eth.getAccounts();
        for (let account of accounts) {
            let index = 0;
            while (true) {
                try {
                    const record = await dossierContract.methods.medicalRecords(account, index).call({ from: userAddress });
                    if (record.ipfsHash === '' && record.doctorName === '' && record.reason === '' && record.visitedDate === '') break;
                    if (record.ipfsHash === recordId) {
                        patientAddress = account;
                        recordDetails = record;
                        recordIndex = index;
                        break;
                    }
                    index++;
                } catch (error) {
                    break;
                }
            }
            if (patientAddress) break;
        }

        if (!patientAddress || !recordDetails) {
            throw new Error('Record not found or access denied.');
        }

        const hasAccess = await accessControlContract.methods.hasAccess(patientAddress, userAddress).call({ from: userAddress });
        if (!hasAccess) {
            throw new Error('You do not have access to this patient’s records.');
        }

        const patientDetails = await medVaultContract.methods.getUserDetails(patientAddress).call();

        recordInfo.innerHTML = `
            <div class="record-info-item">
                <h3>Patient Name</h3>
                <p>${patientDetails.name || 'N/A'}</p>
            </div>
            <div class="record-info-item">
                <h3>IPFS Hash</h3>
                <p><a href="https://ipfs.io/ipfs/${recordDetails.ipfsHash}" target="_blank">${truncateHash(recordDetails.ipfsHash)}</a></p>
            </div>
            <div class="record-info-item">
                <h3>Doctor Name</h3>
                <p>${recordDetails.doctorName || 'N/A'}</p>
            </div>
            <div class="record-info-item">
                <h3>Reason</h3>
                <p>${recordDetails.reason || 'N/A'}</p>
            </div>
            <div class="record-info-item">
                <h3>Visited Date</h3>
                <p>${formatDate(recordDetails.visitedDate) || 'N/A'}</p>
            </div>
        `;

        const ipfsUrl = `https://ipfs.io/ipfs/${recordId}`;
        try {
            const response = await fetch(ipfsUrl);
            if (!response.ok) throw new Error('Failed to fetch from IPFS');
            const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
            console.log(`Content-Type for ${recordId}: ${contentType}`);

            if (contentType.startsWith('image/')) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                previewContent.innerHTML = `<img src="${url}" alt="Medical Report Preview" class="preview-image" onload="URL.revokeObjectURL(this.src)">`;
                documentPreview.classList.remove('hidden');
            } else if (contentType === 'application/pdf') {
                previewContent.innerHTML = `<iframe src="${ipfsUrl}" class="preview-iframe" style="border: none;"></iframe>`;
                documentPreview.classList.remove('hidden');
            } else {
                previewContent.innerHTML = '<p>Preview not available for this file type.</p>';
                documentPreview.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error loading preview:', error);
            previewContent.innerHTML = '<p>Unable to load preview.</p>';
            documentPreview.classList.remove('hidden');
        }

        downloadButton.addEventListener('click', async () => {
            try {
                status.textContent = 'Preparing download...';
                status.classList.remove('hidden');
                const response = await fetch(ipfsUrl);
                if (!response.ok) throw new Error('Failed to fetch from IPFS');
                const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
                const extension = mimeToExtension[contentType] || '.bin';
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `record_${recordId}${extension}`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                a.remove();
                status.classList.add('hidden');
            } catch (error) {
                console.error('Download error:', error);
                status.textContent = 'Failed to download record.';
                status.classList.add('error');
                setTimeout(() => status.classList.add('hidden'), 2000);
            }
        });

        if (recordDetails.prevVisitDate) {
            const relatedReasons = await dossierContract.methods.getRecordsByDate(patientAddress, recordDetails.prevVisitDate).call({ from: userAddress });
            const records = [];
            let index = 0;
            while (true) {
                try {
                    const record = await dossierContract.methods.medicalRecords(patientAddress, index).call({ from: userAddress });
                    if (record.ipfsHash === '' && record.doctorName === '' && record.reason === '' && record.visitedDate === '') break;
                    records.push({ ...record, index });
                    index++;
                } catch (error) {
                    break;
                }
            }
            const relatedRecordsFound = records.filter(r => r.visitedDate === recordDetails.prevVisitDate && relatedReasons.includes(r.reason));
            
            if (relatedRecordsFound.length > 0) {
                relatedRecordsFound.forEach(r => {
                    const relatedItem = document.createElement('div');
                    relatedItem.className = 'related-record';
                    relatedItem.innerHTML = `
                        <div class="related-record-info">
                            <h3>${r.reason || 'N/A'}</h3>
                            <p>${r.doctorName || 'N/A'} • ${formatDate(r.visitedDate)}</p>
                        </div>
                        <div class="related-record-actions">
                            <a href="patient-details.html?recordId=${r.ipfsHash}" title="View Record">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </a>
                        </div>
                    `;
                    relatedRecords.appendChild(relatedItem);
                });
            } else {
                relatedRecords.innerHTML = '<p class="empty-state">No related records found.</p>';
            }
        } else {
            relatedRecords.innerHTML = '<p class="empty-state">No previous visit linked.</p>';
        }

        status.textContent = 'Record loaded successfully.';
        status.classList.add('success');
        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 2000);
    } catch (error) {
        console.error('Error loading record details:', error);
        status.textContent = 'Failed to load details: ' + error.message;
        status.classList.add('error');
        status.classList.remove('hidden');
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