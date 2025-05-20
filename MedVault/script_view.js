let web3;
let userAddress;
let userContract;
let dossierContract;

if (typeof window.ethereum !== 'undefined' && typeof Web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
    console.log('Web3 loaded successfully:', web3);
} else {
    console.error('Web3 or MetaMask not available');
    alert('Please ensure MetaMask is installed and the Web3 library is loaded. Check the console for details.');
    throw new Error('Web3 initialization failed');
}

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
const userContractAddress = '0xA4DE4b05d72c563F185471B5EfEC73B1593166a5';
userContract = new web3.eth.Contract(userContractABI, userContractAddress);

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
dossierContract = new web3.eth.Contract(dossierContractABI, dossierContractAddress);

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

async function isUserLoggedIn() {
    try {
        const accounts = await web3.eth.getAccounts();
        return accounts.length > 0;
    } catch (error) {
        console.error('Error checking MetaMask login:', error);
        return false;
    }
}

function isSignedOut() {
    return sessionStorage.getItem('signedOut') === 'true';
}

function clearMedVaultHistoryAndRedirect() {
    sessionStorage.setItem('signedOut', 'true');
    userAddress = null;
    window.location.replace('homepage.html');
}

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
    viewMedicalRecords();
});

async function viewMedicalRecords() {
    const status = document.getElementById('statusMessage');
    const tableBody = document.getElementById('recordsTableBody');
    const tableContainer = document.getElementById('tableContainer');
    
    status.style.display = 'block';
    status.textContent = 'Loading records...';
    tableBody.innerHTML = '';

    try {
        console.log('Step 1: Requesting accounts...');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        console.log('Connected patient address:', userAddress);

        console.log('Step 2: Fetching records from dossier contract...');
        const records = [];
        let index = 0;
        while (true) {
            try {
                const record = await dossierContract.methods.medicalRecords(userAddress, index).call({ from: userAddress });
                console.log(`Record at index ${index}:`, record);
                if (!record.ipfsHash && !record.doctorName && !record.reason && !record.visitedDate) {
                    console.log('Reached end of records (empty record)');
                    break;
                }
                records.push({ ...record, blockchainIndex: index });
                index++;
            } catch (e) {
                console.log('Reached end of records due to error at index:', index, e);
                break;
            }
        }
        console.log('All records fetched:', JSON.stringify(records, null, 2));

        if (records.length === 0) {
            tableContainer.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3>No Records Found</h3>
                    <p>You don't have any medical records yet. Visit a doctor or upload your existing records to get started.</p>
                </div>
            `;
            status.style.display = 'none';
            console.log('No records available for this address.');
            return;
        }

        console.log('Step 3: Populating table...');
        records.forEach((record) => {
            if (!record.ipfsHash || typeof record.blockchainIndex !== 'number') {
                console.warn('Invalid record skipped:', record);
                return; // Skip invalid records
            }
            const detailsUrl = `record-details.html?index=${record.blockchainIndex}&hash=${encodeURIComponent(record.ipfsHash)}`;
            console.log('Generated URL for record:', detailsUrl);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="${detailsUrl}" title="${record.ipfsHash}" class="record-link">${record.ipfsHash}</a></td>
                <td>${record.doctorName || 'N/A'}</td>
                <td>${record.reason || 'N/A'}</td>
                <td>${formatDate(record.visitedDate)}</td>
                <td>
                    <a href="${detailsUrl}" class="action-button view-record" title="View Record">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </a>
                    <button class="action-button download-record" data-hash="${record.ipfsHash}" title="Download Record">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add click event listeners to ensure navigation
        document.querySelectorAll('.view-record').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default if needed for debugging
                const href = link.getAttribute('href');
                console.log('View record clicked, navigating to:', href);
                window.location.href = href; // Force navigation
            });
        });

        document.querySelectorAll('.download-record').forEach(button => {
            button.addEventListener('click', async (e) => {
                const ipfsHash = e.currentTarget.getAttribute('data-hash');
                try {
                    status.style.display = 'block';
                    status.textContent = 'Preparing download...';

                    const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
                    if (!response.ok) throw new Error('Failed to fetch from IPFS');

                    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
                    console.log(`Detected MIME type for ${ipfsHash}: ${contentType}`);

                    const extension = mimeToExtension[contentType] || '.bin';
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `record_${ipfsHash}${extension}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();

                    status.style.display = 'none';
                } catch (error) {
                    console.error('Download error:', error);
                    status.textContent = 'Failed to download record.';
                    setTimeout(() => { status.style.display = 'none'; }, 2000);
                }
            });
        });

        status.style.display = 'none';
        console.log('Table populated successfully.');
    } catch (error) {
        console.error('Error viewing records:', error);
        status.textContent = 'Failed to load records.';
        setTimeout(() => { status.style.display = 'none'; }, 2000);
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}