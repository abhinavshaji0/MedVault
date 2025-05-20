let web3;
let userAddress;
let contract;

if (typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
  console.log('Web3 initialized with provider:', window.ethereum);
} else {
  alert('Please install MetaMask to use this app.');
  throw new Error('MetaMask not installed');
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
console.log('Initializing contract with address:', contractAddress);
try {
  contract = new web3.eth.Contract(contractABI, contractAddress);
  console.log('Contract initialized successfully.');
} catch (error) {
  console.error('Error initializing contract:', error);
  throw new Error('Failed to initialize contract with address ' + contractAddress);
}
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
  // Set userAddress here to ensure it's available
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

// Detect MetaMask account changes (e.g., signout)
window.ethereum.on('accountsChanged', async (accounts) => {
  if (!accounts.length) {
      console.log('MetaMask accounts disconnected, signing out...');
      clearMedVaultHistoryAndRedirect();
  } else {
      userAddress = accounts[0].toLowerCase();
      console.log('Account changed to:', userAddress);
      await fetchAccessLogs();
  }
});
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM content loaded, checking access...');
  const canProceed = await restrictAccessIfSignedOut();
    if (!canProceed) return;
// MIME type to file extension mapping (from script_view.js)
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

async function loadRecordDetails() {
  const status = document.getElementById('statusMessage');
  const recordInfo = document.getElementById('recordInfo');
  const relatedRecords = document.getElementById('relatedRecords');
  const documentPreview = document.getElementById('documentPreview');
  const previewContent = document.getElementById('previewContent');
  const deleteButton = document.getElementById('deleteButton');
  const downloadButton = document.getElementById('downloadButton');
  const printButton = document.getElementById('printButton');

  status.style.display = 'block';
  status.textContent = 'Loading details...';

  try {
    console.log('Step 1: Requesting accounts...');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0].toLowerCase();
    console.log('Connected address:', userAddress);

    if (!web3.utils.isAddress(userAddress)) {
      throw new Error('Invalid Ethereum address: ' + userAddress);
    }

    console.log('Step 2: Fetching all records...');
    const records = [];
    let index = 0;
    while (true) {
      try {
        const record = await contract.methods.medicalRecords(userAddress, index).call({ from: userAddress });
        console.log(`Record at index ${index}:`, record);
        if (!record.ipfsHash && !record.doctorName && !record.reason && !record.visitedDate) {
          console.log('Reached end of records (empty record)');
          break;
        }
        records.push({ ...record, index });
        index++;
      } catch (e) {
        console.log('Reached end of records due to error at index:', index, e);
        break;
      }
    }
    console.log('All records fetched:', JSON.stringify(records, null, 2));

    const urlParams = new URLSearchParams(window.location.search);
    const selectedIndex = parseInt(urlParams.get('index'), 10);
    const selectedHash = urlParams.get('hash');
    console.log('Selected index and hash from URL:', { selectedIndex, selectedHash });

    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= records.length) {
      status.textContent = 'Invalid record selected.';
      recordInfo.innerHTML = '<p>No record found for the selected index.</p>';
      relatedRecords.innerHTML = '';
      documentPreview.classList.add('hidden');
      return;
    }

    const record = records[selectedIndex];
    console.log('Selected record:', record);

    // Populate record info
    recordInfo.innerHTML = `
      <div class="record-info-item">
        <h3>IPFS Hash</h3>
        <p><a href="https://ipfs.io/ipfs/${record.ipfsHash}" target="_blank">${record.ipfsHash}</a></p>
      </div>
      <div class="record-info-item">
        <h3>Doctor Name</h3>
        <p>${record.doctorName || 'N/A'}</p>
      </div>
      <div class="record-info-item">
        <h3>Reason</h3>
        <p>${record.reason || 'N/A'}</p>
      </div>
      <div class="record-info-item">
        <h3>Visited Date</h3>
        <p>${formatDate(record.visitedDate) || 'N/A'}</p>
      </div>
    `;

    // Document Preview
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${record.ipfsHash}`);
      if (!response.ok) throw new Error('Failed to fetch from IPFS');
      const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
      console.log(`Content-Type for ${record.ipfsHash}: ${contentType}`);

      if (contentType.startsWith('image/')) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        previewContent.innerHTML = `<img src="${url}" alt="Medical Report Preview" onload="URL.revokeObjectURL(this.src)">`;
        documentPreview.classList.remove('hidden');
      } else if (contentType === 'application/pdf') {
        previewContent.innerHTML = `<iframe src="https://ipfs.io/ipfs/${record.ipfsHash}" width="100%" height="400px" style="border: none;"></iframe>`;
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

    // Download Button
    downloadButton.addEventListener('click', async () => {
      try {
        status.style.display = 'block';
        status.textContent = 'Preparing download...';
        const response = await fetch(`https://ipfs.io/ipfs/${record.ipfsHash}`);
        if (!response.ok) throw new Error('Failed to fetch from IPFS');
        const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
        const extension = mimeToExtension[contentType] || '.bin';
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `record_${record.ipfsHash}${extension}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
        status.style.display = 'none';
      } catch (error) {
        console.error('Download error:', error);
        status.textContent = 'Failed to download record.';
        setTimeout(() => { status.style.display = 'none'; }, 2000);
      }
    });

    // Print Button
    printButton.addEventListener('click', () => {
      const iframe = previewContent.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow.print();
      } else {
        const img = previewContent.querySelector('img');
        if (img) {
          const win = window.open('');
          win.document.write(`<img src="${img.src}" onload="window.print();window.close()">`);
        } else {
          status.style.display = 'block';
          status.textContent = 'Print not supported for this file type.';
          setTimeout(() => { status.style.display = 'none'; }, 2000);
        }
      }
    });

    // Related Records
    if (record.prevVisitDate) {
      console.log('Fetching related records for date:', record.prevVisitDate);
      const relatedReasons = await contract.methods.getRecordsByDate(userAddress, record.prevVisitDate).call({ from: userAddress });
      console.log('Related reasons:', relatedReasons);

      relatedRecords.innerHTML = '';
      const relatedRecordsFound = records.filter(r => r.visitedDate === record.prevVisitDate && relatedReasons.includes(r.reason));
      
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
              <a href="record-details.html?index=${r.index}&hash=${r.ipfsHash}" title="View Record">
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

    // Delete Functionality
    deleteButton.addEventListener('click', () => showConfirmationPopup(selectedIndex));

    status.style.display = 'none';
    console.log('Record details loaded successfully.');
  } catch (error) {
    console.error('Error loading record details:', error);
    status.textContent = 'Failed to load details.';
    recordInfo.innerHTML = '<p>Failed to load record details. Check console for errors.</p>';
    relatedRecords.innerHTML = '';
    documentPreview.classList.add('hidden');
    setTimeout(() => { status.style.display = 'none'; }, 2000);
  }
}

function showConfirmationPopup(index) {
  const popup = document.getElementById('confirmationPopup');
  const status = document.getElementById('statusMessage');
  if (!popup) {
    console.error('Confirmation popup not found in DOM');
    status.style.display = 'block';
    status.textContent = 'Error: Confirmation popup not found.';
    return;
  }

  console.log('Showing confirmation popup for index:', index);
  popup.classList.remove('hidden');
  popup.classList.add('active');

  document.getElementById('confirmDelete').onclick = () => deleteRecord(userAddress, index);
  document.getElementById('cancelDelete').onclick = () => {
    console.log('Canceling deletion...');
    popup.classList.remove('active');
    setTimeout(() => popup.classList.add('hidden'), 300);
  };
}

async function deleteRecord(patientAddress, index) {
  const status = document.getElementById('statusMessage');
  const popup = document.getElementById('confirmationPopup');
  status.style.display = 'block';
  status.textContent = 'Deleting record...';

  try {
    console.log('Attempting to delete record for patient:', patientAddress, 'at index:', index);
    const tx = await contract.methods.deleteRecord(patientAddress, index).send({
      from: userAddress,
      gas: 200000,
      gasPrice: web3.utils.toWei('10', 'gwei')
    }).on('transactionHash', (hash) => {
      console.log('Delete transaction submitted, hash:', hash);
    }).on('error', (error, receipt) => {
      console.error('Transaction error details:', error, receipt);
      throw new Error(`Transaction failed: ${error.message || 'Unknown error'}`);
    });
    console.log('Delete transaction hash:', tx.transactionHash);

    status.textContent = 'Record deleted successfully.';
    status.className = 'status-message success';
    popup.classList.remove('active');
    setTimeout(() => popup.classList.add('hidden'), 300);
    setTimeout(() => window.location.href = 'view-records.html', 1000);
  } catch (error) {
    console.error('Error deleting record:', error);
    status.textContent = 'Failed to delete record. ' + (error.message || 'Unknown error');
    popup.classList.remove('active');
    setTimeout(() => {
      popup.classList.add('hidden');
      status.style.display = 'none';
    }, 2000);
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : 'N/A';
}

loadRecordDetails();
});