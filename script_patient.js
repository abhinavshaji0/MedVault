if (typeof Web3 === 'undefined') {
    console.error('Web3 is not loaded. Please include the Web3 library.');
} else {
    console.log('Web3 is loaded:', Web3);
}

let web3;
let userAddress;
let userContract;

if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('Please install MetaMask to use this app.');
    throw new Error('MetaMask is not installed.');
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

console.log('Initializing user contract with address:', userContractAddress);
userContract = new web3.eth.Contract(userContractABI, userContractAddress);

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

// Handle navigation (including back/forward)
window.addEventListener('popstate', async (event) => {
    console.log('Popstate event triggered:', event.state);
    const canProceed = await restrictAccessIfSignedOut();
    if (!canProceed) {
        history.pushState(null, null, window.location.pathname);
    }
});

// Toggle popup function
function togglePopup(popup, show) {
    if (show) {
        popup.classList.remove('hidden');
        setTimeout(() => popup.classList.add('active'), 10);
    } else {
        popup.classList.remove('active');
        setTimeout(() => popup.classList.add('hidden'), 300);
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initial page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded, checking access...');
    const canProceed = await restrictAccessIfSignedOut();
    if (!canProceed) return;

    history.pushState(null, null, window.location.pathname);
    fetchPatientDetails();

    // Setup button event listeners
    const signOutButton = document.getElementById('signOutButton');
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const copyAddressButton = document.getElementById('copyAddressButton');
    const emailButton = document.getElementById('emailButton');
    const signOutPopup = document.getElementById('signOutPopup');
    const deleteAccountPopup = document.getElementById('deleteAccountPopup');
    const emailPopup = document.getElementById('emailPopup');
    const emailForm = document.getElementById('emailForm');
    const cancelEmailButton = document.getElementById('cancelEmailButton');

    if (!signOutButton || !deleteAccountButton || !copyAddressButton || !emailButton || !signOutPopup || !deleteAccountPopup || !emailPopup || !emailForm || !cancelEmailButton) {
        console.error('One or more DOM elements not found');
        return;
    }

    signOutButton.addEventListener('click', showSignOutPopup);
    deleteAccountButton.addEventListener('click', showDeleteAccountPopup);

    // Copy address to clipboard
    copyAddressButton.addEventListener('click', () => {
        navigator.clipboard.writeText(userAddress)
            .then(() => {
                showToast('Copied to clipboard!');
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
                alert('Failed to copy address. Please try again.');
            });
    });

    // Email functionality
    emailButton.addEventListener('click', () => togglePopup(emailPopup, true));

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const doctorEmail = document.getElementById('doctorEmail').value;
        const message = document.getElementById('emailMessage').value;
        const subject = encodeURIComponent('Patient Ethereum Address - MedVault');
        const body = encodeURIComponent(`Dear Doctor,\n\nHere is my Ethereum address for accessing my medical records on MedVault:\n\n${userAddress}\n\n${message ? message + '\n\n' : ''}Best regards,\n${document.getElementById('name').textContent}`);
        const mailtoUrl = `mailto:${doctorEmail}?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
        showToast(`Email prepared for ${doctorEmail}`);
        togglePopup(emailPopup, false);
        emailForm.reset();
    });

    cancelEmailButton.addEventListener('click', () => {
        togglePopup(emailPopup, false);
        emailForm.reset();
    });

    // Close popups when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup') && e.target.classList.contains('active')) {
            togglePopup(e.target, false);
        }
    });
});

async function fetchPatientDetails() {
    try {
        console.log('Step 1: Requesting accounts...');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0].toLowerCase();
        console.log('Connected patient address:', userAddress);

        if (!web3.utils.isAddress(userAddress)) {
            throw new Error('Invalid Ethereum address: ' + userAddress);
        }

        console.log('Step 2: Checking registration...');
        const isRegistered = await userContract.methods.isUserRegistered(userAddress).call({ from: userAddress });
        if (!isRegistered) {
            console.error('User not registered at:', userContractAddress);
            alert('User not registered. Please register first.');
            clearMedVaultHistoryAndRedirect();
            return;
        }

        console.log('Step 3: Fetching patient details...');
        const userDetails = await userContract.methods.getUserDetails(userAddress).call({ from: userAddress });
        console.log('User Details:', userDetails);

        document.getElementById('name').textContent = userDetails.name || 'N/A';
        document.getElementById('phone').textContent = userDetails.contact || 'N/A';
        document.getElementById('gender').textContent = userDetails.gender || 'N/A';
        document.getElementById('dob').textContent = userDetails.dob || 'N/A';
        document.getElementById('bloodGroup').textContent = userDetails.bloodGroup || 'N/A';
    } catch (error) {
        console.error('Error fetching patient details:', error);
        alert('Failed to fetch patient details: ' + (error.message || error));
    }
}

// Sign Out Popup
function showSignOutPopup() {
    const popup = document.getElementById('signOutPopup');
    if (!popup) return console.error('Sign Out popup not found');
    togglePopup(popup, true);
    document.getElementById('confirmSignOut').onclick = () => {
        console.log('Confirmed sign out for:', userAddress);
        clearMedVaultHistoryAndRedirect();
        togglePopup(popup, false);
    };
    document.getElementById('cancelSignOut').onclick = () => togglePopup(popup, false);
}

// Delete Account Popup
async function showDeleteAccountPopup() {
    const popup = document.getElementById('deleteAccountPopup');
    if (!popup) return console.error('Delete Account popup not found');
    togglePopup(popup, true);
    document.getElementById('confirmDeleteAccount').onclick = async () => {
        try {
            console.log('Attempting to delete account for:', userAddress);
            await userContract.methods.unregisterUser().send({
                from: userAddress,
                gas: 200000,
                gasPrice: web3.utils.toWei('10', 'gwei')
            });
            console.log('Account deleted successfully');
            clearMedVaultHistoryAndRedirect();
            togglePopup(popup, false);
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account: ' + (error.message || 'Unknown error'));
            togglePopup(popup, false);
        }
    };
    document.getElementById('cancelDeleteAccount').onclick = () => togglePopup(popup, false);
}