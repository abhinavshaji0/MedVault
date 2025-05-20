let web3;
let userAddress;
let userContract;
let dossierContract;

if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('Please install MetaMask to use this app.');
    throw new Error('MetaMask is not installed.');
}

console.log('Web3.js Version:', web3.version);

const PINATA_API_KEY = '0f1f61e7c8de5e7372cf';
const PINATA_API_SECRET = 'a43ab58ad3790206bac8fe43886116aa4e0c275da61e59d58ad5164712db5067';

const userContractABI = [
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
const userContractAddress = '0xA4DE4b05d72c563F185471B5EfEC73B1593166a5'; // User registration contract address

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

userContract = new web3.eth.Contract(userContractABI, userContractAddress);
dossierContract = new web3.eth.Contract(dossierContractABI, dossierContractAddress);

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
    // Ensure userAddress is set or refreshed
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
        await loadDoctorDashboard();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded, initializing...');
    const canProceed = await restrictAccessIfSignedOut();
    if (!canProceed) return;
    history.pushState(null, null, window.location.pathname);

    const uploadForm = document.getElementById('uploadForm');
    const recordFileInput = document.getElementById('recordFile');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    const dropArea = document.getElementById('dropArea');
    const progressContainer = document.getElementById('progressContainer');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadStatus = document.getElementById('uploadStatus');

    // Set default date to today and restrict future dates in UI
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visitedDate').value = today;
    document.getElementById('visitedDate').setAttribute('max', today);

    // File upload preview
    recordFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) showFilePreview(file);
    });

    // Remove file
    removeFile.addEventListener('click', () => {
        recordFileInput.value = '';
        filePreview.classList.remove('active');
    });

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
    });

    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) {
            recordFileInput.files = dt.files;
            showFilePreview(file);
        }
    });

    function showFilePreview(file) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        filePreview.classList.add('active');

        const fileIcon = filePreview.querySelector('.file-preview-icon svg');
        if (file.type.includes('pdf')) {
            fileIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />';
        } else if (file.type.includes('image')) {
            fileIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />';
        } else if (file.type.includes('text')) {
            fileIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await addPatientRecord();
    });

    async function addPatientRecord() {
        const status = uploadStatus;
        const progressBar = uploadProgress;
        progressContainer.classList.add('active');
        status.classList.add('active');

        try {
            status.textContent = 'Connecting to MetaMask...';
            progressBar.style.width = '10%';
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            console.log('Connected doctor address:', userAddress);

            status.textContent = 'Verifying doctor details...';
            progressBar.style.width = '20%';
            const userDetails = await userContract.methods.getUserDetails(userAddress).call();
            if (userDetails.userType.toLowerCase() !== 'doctor') {
                throw new Error('Only doctors can add records.');
            }

            const patientAddress = document.getElementById('patientAddress').value.trim();
            const reason = document.getElementById('reason').value;
            const visitedDate = document.getElementById('visitedDate').value;
            const file = recordFileInput.files[0];

            if (!web3.utils.isAddress(patientAddress)) throw new Error('Invalid patient address');
            if (!reason || !visitedDate || !file) throw new Error('All fields are required');

            // Validate visit date is on or before current date
            const currentDate = new Date();
            const inputDate = new Date(visitedDate);
            if (inputDate > currentDate) {
                throw new Error('Visit date cannot be in the future.');
            }

            status.textContent = 'Uploading to Pinata...';
            progressBar.style.width = '40%';
            const formData = new FormData();
            formData.append('file', file);

            const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: 'POST',
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_API_SECRET
                },
                body: formData
            });

            if (!pinataResponse.ok) throw new Error('Pinata upload failed');
            const pinataResult = await pinataResponse.json();
            const ipfsHash = pinataResult.IpfsHash;

            status.textContent = 'Storing on blockchain...';
            progressBar.style.width = '70%';
            const doctorName = userDetails.name || 'Unknown Doctor';
            await dossierContract.methods.storeRecord(
                patientAddress,
                ipfsHash,
                doctorName,
                reason,
				visitedDate,
                '', // prevVisitDate
                ''  // prevReason
            ).send({ from: userAddress });

            progressBar.style.width = '100%';
            status.textContent = `Record uploaded successfully! IPFS Hash: ${ipfsHash}`;
            status.classList.add('success');

            addRecentUpload(reason, patientAddress, ipfsHash);
            setTimeout(() => {
                uploadForm.reset();
                filePreview.classList.remove('active');
                progressContainer.classList.remove('active');
                status.classList.remove('active', 'success');
                progressBar.style.width = '0%';
                document.getElementById('visitedDate').value = today;
            }, 3000);
        } catch (error) {
            console.error('Error adding patient record:', error);
            status.textContent = `Failed to upload record: ${error.message}`;
            status.classList.add('error');
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressContainer.classList.remove('active');
                status.classList.remove('active', 'error');
            }, 3000);
        }
    }

    function addRecentUpload(reason, patientAddress, ipfsHash) {
        const uploadsList = document.getElementById('uploadsList');
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newUpload = document.createElement('li');
        newUpload.className = 'upload-item';
        newUpload.innerHTML = `
            <div class="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <div class="upload-content">
                <h3>${reason} - Patient (${patientAddress.slice(0, 6)}...${patientAddress.slice(-4)})</h3>
                <p>IPFS Hash: ${ipfsHash}</p>
                <div class="upload-time">Today, ${timeString}</div>
            </div>
        `;
        uploadsList.insertBefore(newUpload, uploadsList.firstChild);
    }

    // Dummy loadDoctorDashboard to satisfy accountsChanged listener
    async function loadDoctorDashboard() {
        console.log('loadDoctorDashboard placeholder called');
    }
});