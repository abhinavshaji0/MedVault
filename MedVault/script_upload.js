let web3;
let userAddress;
let contract;

const PINATA_API_KEY = '0f1f61e7c8de5e7372cf';
const PINATA_API_SECRET = 'a43ab58ad3790206bac8fe43886116aa4e0c275da61e59d58ad5164712db5067';

if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('Please install MetaMask to use this app.');
}

const contractABI = [
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
const contractAddress = '0x7706c08A26957747785369d6eDe3d25630C59E60';
contract = new web3.eth.Contract(contractABI, contractAddress);

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
    sessionStorage.removeItem('signedOut');
    return true;
}

// Date Validation Functions
function validateVisitedDate(visitedDate) {
    const alert = document.getElementById('visitedDateAlert');
    if (!visitedDate) {
        alert.classList.add('hidden');
        alert.classList.remove('visible');
        return false;
    }
    const currentDate = new Date();
    const inputDate = new Date(visitedDate);
    currentDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    if (inputDate > currentDate) {
        alert.classList.remove('hidden');
        alert.classList.add('visible');
        return false;
    } else {
        alert.classList.add('hidden');
        alert.classList.remove('visible');
        return true;
    }
}

function validatePrevVisitDate(prevVisitDate, visitedDate) {
    const alert = document.getElementById('prevVisitDateAlert');
    if (!prevVisitDate || !visitedDate) {
        alert.classList.add('hidden');
        alert.classList.remove('visible');
        return true;
    }
    const prevDate = new Date(prevVisitDate);
    const visitDate = new Date(visitedDate);
    prevDate.setHours(0, 0, 0, 0);
    visitDate.setHours(0, 0, 0, 0);
    if (prevDate > visitDate) {
        alert.classList.remove('hidden');
        alert.classList.add('visible');
        return false;
    } else {
        alert.classList.add('hidden');
        alert.classList.remove('visible');
        return true;
    }
}

// Handle navigation (including back/forward)
window.addEventListener('popstate', async (event) => {
    console.log('Popstate event triggered:', event.state);
    const canProceed = await restrictAccessIfSignedOut();
    if (!canProceed) {
        history.pushState(null, null, window.location.pathname);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded, checking access...');
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
    const relatedVisitCheckbox = document.getElementById('relatedVisit');
    const relatedVisitFields = document.getElementById('relatedVisitFields');

    // Forcefully ensure related visit fields are hidden by default
    console.log('Initial checkbox state:', relatedVisitCheckbox.checked);
    if (!relatedVisitCheckbox.checked) {
        relatedVisitFields.classList.add('hidden');
        document.getElementById('prevVisitDate').required = false;
        document.getElementById('prevReason').required = false;
        document.getElementById('prevReason').disabled = true;
        console.log('Related visit fields hidden on initialization');
    } else {
        console.log('Checkbox checked on load, showing related visit fields');
    }

    // Double-check visibility after a slight delay (fallback for DOM issues)
    setTimeout(() => {
        if (!relatedVisitCheckbox.checked && !relatedVisitFields.classList.contains('hidden')) {
            relatedVisitFields.classList.add('hidden');
            console.log('Fallback: Forced hiding of related visit fields');
        }
    }, 100);

    // File upload preview for browsing
    recordFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('File selected via browsing:', file.name);
            showFilePreview(file);
        } else {
            console.log('No file selected via browsing');
            filePreview.classList.remove('active');
        }
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
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('highlight');
            console.log(`${eventName} triggered`);
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('highlight');
            console.log(`${eventName} triggered`);
        }, false);
    });

    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) {
            console.log('File dropped:', file.name);
            recordFileInput.files = dt.files; // Sync with input
            showFilePreview(file);
        } else {
            console.log('No file dropped');
            filePreview.classList.remove('active');
        }
    });

    // Remove file
    removeFile.addEventListener('click', () => {
        console.log('Removing file preview');
        recordFileInput.value = '';
        filePreview.classList.remove('active');
    });

    function showFilePreview(file) {
        console.log('Showing file preview for:', file.name);
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        filePreview.classList.add('active');

        const fileIcon = filePreview.querySelector('.file-preview-icon svg');
        if (!fileIcon) {
            console.error('File preview icon SVG not found');
            return;
        }

        if (file.type.includes('pdf')) {
            fileIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />';
        } else if (file.type.includes('image')) {
            fileIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />';
        } else if (file.type.includes('text')) {
            fileIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />';
        } else {
            fileIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />'; // Default to document icon
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Toggle related visit fields
    relatedVisitCheckbox.addEventListener('change', function () {
        console.log('Related visit checkbox changed to:', this.checked);
        relatedVisitFields.classList.toggle('hidden', !this.checked);
        document.getElementById('prevVisitDate').required = this.checked;
        document.getElementById('prevReason').required = this.checked;
        document.getElementById('prevReason').disabled = !this.checked;
        document.getElementById('prevVisitDateAlert').classList.add('hidden');
        document.getElementById('prevVisitDateAlert').classList.remove('visible');
    });

    // Real-time date validation
    document.getElementById('visitedDate').addEventListener('change', function () {
        validateVisitedDate(this.value);
        const prevVisitDate = document.getElementById('prevVisitDate').value;
        if (prevVisitDate) validatePrevVisitDate(prevVisitDate, this.value);
    });

    document.getElementById('prevVisitDate').addEventListener('change', function () {
        const visitedDate = document.getElementById('visitedDate').value;
        validatePrevVisitDate(this.value, visitedDate);
        if (this.value) fetchPreviousReasons(this.value);
    });

    async function fetchPreviousReasons(date) {
        const select = document.getElementById('prevReason');
        select.innerHTML = '<option value="">Select a previous reason</option>';
        select.disabled = true;

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            const reasons = await contract.methods.getRecordsByDate(userAddress, date).call();
            if (reasons.length > 0) {
                reasons.forEach(reason => {
                    const option = document.createElement('option');
                    option.value = reason;
                    option.textContent = reason;
                    select.appendChild(option);
                });
                select.disabled = false;
            } else {
                select.innerHTML = '<option value="">No records found for this date</option>';
            }
        } catch (error) {
            console.error('Error fetching reasons:', error);
            select.innerHTML = '<option value="">Error loading reasons</option>';
        }
    }

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = recordFileInput.files[0];
        const visitedDate = document.getElementById('visitedDate').value;
        const relatedVisit = relatedVisitCheckbox.checked;
        const prevVisitDate = relatedVisit ? document.getElementById('prevVisitDate').value : '';

        if (!file || !uploadForm.checkValidity()) {
            uploadStatus.textContent = 'Please fill all required fields.';
            uploadStatus.classList.add('active', 'error');
            console.log('Form validation failed: Missing file or required fields');
            return;
        }

        if (!validateVisitedDate(visitedDate)) {
            uploadStatus.textContent = 'Invalid Visited Date.';
            uploadStatus.classList.add('active', 'error');
            console.log('Invalid visited date:', visitedDate);
            return;
        }

        if (relatedVisit && prevVisitDate && !validatePrevVisitDate(prevVisitDate, visitedDate)) {
            uploadStatus.textContent = 'Invalid Previous Visit Date.';
            uploadStatus.classList.add('active', 'error');
            console.log('Invalid previous visit date:', prevVisitDate);
            return;
        }

        console.log('Form is valid, starting upload...');
        await uploadMedicalRecord(file);
    });
});

async function uploadMedicalRecord(file) {
    const status = document.getElementById('uploadStatus');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('uploadProgress');
    const filePreview = document.getElementById('filePreview');

    status.classList.add('active');
    status.textContent = 'Uploading...';
    progressContainer.classList.add('active');
    progressBar.style.width = '0%';

    try {
        console.log('Step 1: Requesting accounts...');
        status.textContent = 'Connecting to MetaMask...';
        progressBar.style.width = '25%';
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        console.log('Connected address:', userAddress);

        console.log('Step 2: Validating dates...');
        const visitedDate = document.getElementById('visitedDate').value;
        const relatedVisit = document.getElementById('relatedVisit').checked;
        const prevVisitDate = relatedVisit ? document.getElementById('prevVisitDate').value : '';

        if (!validateVisitedDate(visitedDate)) {
            throw new Error('Visited Date cannot be in the future.');
        }
        if (relatedVisit && prevVisitDate && !validatePrevVisitDate(prevVisitDate, visitedDate)) {
            throw new Error('Previous Visit Date cannot be after the Visited Date.');
        }

        console.log('Step 3: Uploading to Pinata...');
        status.textContent = 'Uploading to Pinata...';
        progressBar.style.width = '50%';
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

        if (!pinataResponse.ok) {
            const errorText = await pinataResponse.text();
            throw new Error(`Pinata upload failed: ${errorText}`);
        }

        const pinataResult = await pinataResponse.json();
        const ipfsHash = pinataResult.IpfsHash;
        console.log('IPFS Hash:', ipfsHash);

        console.log('Step 4: Collecting form data...');
        status.textContent = 'Preparing data...';
        progressBar.style.width = '75%';
        const doctorName = document.getElementById('doctorName').value;
        const reason = document.getElementById('reason').value;
        const prevReason = relatedVisit ? document.getElementById('prevReason').value : '';
        console.log('Form Data:', { doctorName, reason, visitedDate, prevVisitDate, prevReason });

        console.log('Step 5: Storing on blockchain...');
        status.textContent = 'Storing on blockchain...';
        progressBar.style.width = '90%';
        const tx = await contract.methods.storeRecord(
            userAddress,
            ipfsHash,
            doctorName,
            reason,
            visitedDate,
            prevVisitDate,
            prevReason
        ).send({
            from: userAddress,
            gas: 1500000,
            gasPrice: web3.utils.toWei('20', 'gwei')
        }).on('transactionHash', (hash) => {
            console.log('Transaction submitted, hash:', hash);
        }).on('error', (error, receipt) => {
            console.error('Transaction error:', error, receipt);
            throw new Error(`Transaction failed: ${error.message}`);
        });
        console.log('Transaction Hash:', tx.transactionHash);

        progressBar.style.width = '100%';
        status.textContent = `Record uploaded successfully! IPFS Hash: ${ipfsHash}`;
        status.classList.add('success');
        addRecentUpload(reason, doctorName, ipfsHash);

        setTimeout(() => {
            document.getElementById('uploadForm').reset();
            filePreview.classList.remove('active');
            progressContainer.classList.remove('active');
            status.classList.remove('active', 'success');
            progressBar.style.width = '0%';
            document.getElementById('relatedVisitFields').classList.add('hidden');
            document.getElementById('prevReason').disabled = true;
            document.getElementById('relatedVisit').checked = false; // Reset checkbox
            console.log('Form reset, related visit fields hidden');
        }, 3000);
    } catch (error) {
        console.error('Error uploading record:', error);
        status.textContent = `Failed to upload record: ${error.message}`;
        status.classList.add('error');
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressContainer.classList.remove('active');
            status.classList.remove('active', 'error');
        }, 3000);
    }
}

function addRecentUpload(reason, doctorName, ipfsHash) {
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
            <h3>${reason} - ${doctorName}</h3>
            <p>IPFS Hash: ${ipfsHash}</p>
            <div class="upload-time">Today, ${timeString}</div>
        </div>
    `;
    uploadsList.insertBefore(newUpload, uploadsList.firstChild);
}