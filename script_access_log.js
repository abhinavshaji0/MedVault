if (typeof Web3 === 'undefined') {
    console.error('Web3 is not loaded. Please include the Web3 library.');
} else {
    console.log('Web3 is loaded:', Web3);
}

let web3;
let userAddress;
let contract;

const contractABI = [
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
const contractAddress = '0x49A5FC0E2ce94E492499a1D3839e4cdF8462374d';

// Initialize Web3
if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask to use this app.');
} else {
    web3 = new Web3(window.ethereum);
}

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

    // Ensure MetaMask is installed and connected
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this app.');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0].toLowerCase();
        console.log('MetaMask connected successfully, userAddress:', userAddress);
    } catch (error) {
        console.error('MetaMask connection failed:', error);
        alert('Please connect MetaMask to proceed.');
        return;
    }

    const canProceed = await restrictAccessIfSignedOut();
    if (!canProceed) return;

    // Network validation
    let networkId;
    try {
        networkId = Number(await web3.eth.net.getId());
        console.log('Current network ID:', networkId);
        const expectedNetworkId = 11155111; // Sepolia
        if (networkId !== expectedNetworkId) {
            const networkNames = {
                1: 'Ethereum Mainnet',
                5: 'Goerli',
                11155111: 'Sepolia',
                1337: 'Localhost (Ganache)'
            };
            const currentNetwork = networkNames[networkId] || 'Unknown Network';
            alert(`Please switch MetaMask to Sepolia (ID: ${expectedNetworkId}). Current network: ${currentNetwork} (ID: ${networkId})`);
            return;
        }
    } catch (error) {
        console.error('Error fetching network ID:', error);
        alert('Unable to determine network. Please ensure MetaMask is connected.');
        return;
    }

    // Replace initial history state to prevent back navigation
    history.replaceState({ page: 'access_log' }, '', window.location.pathname);

    const timeFilter = document.getElementById('timeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.querySelector('.search-box input');
    const logTableBody = document.querySelector('.log-table tbody');
    const paginationInfo = document.querySelector('.pagination-info');
    const paginationControls = document.querySelector('.pagination-controls');

    let accessLogs = [];
    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;

    async function fetchAccessLogs() {
        try {
            if (!userAddress || !web3.utils.isAddress(userAddress)) {
                throw new Error('Invalid or missing userAddress: ' + userAddress);
            }
            console.log('Fetching access logs for address:', userAddress);
            const logs = await contract.methods.getAccessLogs(userAddress).call({ from: userAddress });
            console.log('Raw logs from contract:', logs);
            if (logs.length === 0) {
                console.log('No logs found for this patient.');
            }
            accessLogs = logs.map(log => ({
                doctor: log.doctorName || 'Unknown Doctor',
                hospital: log.hospital || 'Unknown Hospital',
                recordType: log.recordType || 'Medical Record',
                accessTime: new Date(parseInt(log.timestamp) * 1000).toLocaleString(),
                status: log.status.toLowerCase() || 'unknown'
            }));
            console.log('Mapped access logs:', accessLogs);
            applyFiltersAndPagination();
        } catch (error) {
            console.error('Error fetching access logs:', error);
            let errorMessage = error.message;
            if (error.message.includes('revert')) {
                errorMessage = 'Failed to fetch logs: ' + (error.data?.message || 'Patient may not be registered or network issue');
            }
            logTableBody.innerHTML = `
                <tr><td colspan="6" class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3>Unable to Load Logs</h3>
                    <p>${errorMessage}</p>
                </td></tr>
            `;
        }
    }

    function applyFiltersAndPagination() {
        const timeValue = timeFilter.value;
        const statusValue = statusFilter.value;
        const searchValue = searchInput.value.toLowerCase();

        let filteredLogs = accessLogs.filter(log => {
            let showLog = true;
            const now = new Date();
            const logDate = new Date(log.accessTime);
            if (timeValue === 'today' && !isSameDay(logDate, now)) showLog = false;
            else if (timeValue === 'week' && logDate < new Date(now - 7 * 24 * 60 * 60 * 1000)) showLog = false;
            else if (timeValue === 'month' && logDate < new Date(now - 30 * 24 * 60 * 60 * 1000)) showLog = false;
            else if (timeValue === 'year' && logDate < new Date(now - 365 * 24 * 60 * 60 * 1000)) showLog = false;
            if (statusValue !== 'all' && log.status !== statusValue) showLog = false;
            if (searchValue && !log.doctor.toLowerCase().includes(searchValue) && !log.hospital.toLowerCase().includes(searchValue)) {
                showLog = false;
            }
            return showLog;
        });

        const totalItems = filteredLogs.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        logTableBody.innerHTML = '';
        if (paginatedLogs.length === 0) {
            logTableBody.innerHTML = `
                <tr><td colspan="6" class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3>No Access Logs Found</h3>
                    <p>No records match your current filters.</p>
                </td></tr>
            `;
        } else {
            paginatedLogs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${log.doctor}</td>
                    <td>${log.hospital}</td>
                    <td>${log.recordType}</td>
                    <td>${log.accessTime}</td>
                    <td><span class="status-badge ${log.status}">${capitalize(log.status)}</span></td>                   
                `;
                logTableBody.appendChild(row);
            });
        }

        paginationInfo.textContent = `Showing ${startIndex + 1}-${Math.min(startIndex + paginatedLogs.length, totalItems)} of ${totalItems} entries`;
        updatePaginationControls(totalPages);
    }

    function isSameDay(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function updatePaginationControls(totalPages) {
        paginationControls.innerHTML = `
            <button class="pagination-button" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        `;
        for (let i = 1; i <= totalPages; i++) {
            paginationControls.innerHTML += `
                <button class="pagination-button ${i === currentPage ? 'active' : ''}">${i}</button>
            `;
        }
        paginationControls.innerHTML += `
            <button class="pagination-button" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;

        const buttons = paginationControls.querySelectorAll('.pagination-button');
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                if (this.textContent === 'Previous' && currentPage > 1) {
                    currentPage--;
                } else if (this.textContent === 'Next' && currentPage < totalPages) {
                    currentPage++;
                } else if (!isNaN(this.textContent)) {
                    currentPage = parseInt(this.textContent);
                }
                applyFiltersAndPagination();
            });
        });
    }

    timeFilter.addEventListener('change', applyFiltersAndPagination);
    statusFilter.addEventListener('change', applyFiltersAndPagination);
    searchInput.addEventListener('input', applyFiltersAndPagination);

    logTableBody.addEventListener('click', (e) => {
        const button = e.target.closest('.action-button');
        if (button) {
            const row = button.closest('tr');
            const doctor = row.cells[0].textContent;
            const recordType = row.cells[2].textContent;
            alert(`Viewing access details for ${doctor} - ${recordType}`);
        }
    });

    await fetchAccessLogs();
});