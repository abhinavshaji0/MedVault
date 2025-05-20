if (typeof Web3 === 'undefined') {
    console.error('Web3 is not loaded. Please include the Web3 library.');
} else {
    console.log('Web3 is loaded:', Web3);
}

let web3;
let userAddress;
let userContract;

if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask to use this app.');
} else {
    web3 = new Web3(window.ethereum);
    console.log('Web3 initialized with provider:', window.ethereum);
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
try {
    userContract = new web3.eth.Contract(userContractABI, userContractAddress);
    console.log('User contract initialized successfully.');
} catch (error) {
    console.error('Error initializing user contract:', error);
    throw new Error('Failed to initialize user contract with address ' + userContractAddress);
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
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
        console.error('Toast elements not found in DOM');
    }
}

// Initial page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded, initializing...');

    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this app.');
        return;
    }

    // Initialize userAddress before restrictAccessIfSignedOut
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

    history.replaceState({ page: 'doctor-dashboard' }, '', window.location.pathname);

    await loadDoctorDashboard();

    // Setup button event listeners
    const signOutButton = document.getElementById('signOutButton');
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const copyAddressButton = document.getElementById('copyAddressButton');
    const emailButton = document.getElementById('emailButton');
    const emailPopup = document.getElementById('emailPopup');
    const emailForm = document.getElementById('emailForm');
    const cancelEmailButton = document.getElementById('cancelEmailButton');

    if (!signOutButton) console.error('Sign Out button not found in DOM');
    if (!deleteAccountButton) console.error('Delete Account button not found in DOM');
    if (!copyAddressButton) console.error('Copy Address button not found in DOM');
    if (!emailButton || !emailPopup || !emailForm || !cancelEmailButton) console.error('Email-related elements not found in DOM');

    if (signOutButton) signOutButton.addEventListener('click', showSignOutPopup);
    if (deleteAccountButton) deleteAccountButton.addEventListener('click', showDeleteAccountPopup);

    if (copyAddressButton) {
        copyAddressButton.addEventListener('click', () => {
            navigator.clipboard.writeText(userAddress)
                .then(() => showToast('Copied to clipboard!'))
                .catch((err) => {
                    console.error('Could not copy text: ', err);
                    alert('Failed to copy address. Please try again.');
                });
        });
    }

    if (emailButton && emailPopup && emailForm && cancelEmailButton) {
        emailButton.addEventListener('click', () => togglePopup(emailPopup, true));

        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const patientEmail = document.getElementById('patientEmail').value;
            const message = document.getElementById('emailMessage').value;
            const subject = encodeURIComponent('Doctor Ethereum Address - MedVault');
            const body = encodeURIComponent(
                `Dear Patient,\n\nHere is my Ethereum address for granting access to your medical records on MedVault:\n\n${userAddress}\n\n${message ? message + '\n\n' : ''}Best regards,\nDr. ${document.querySelector('header h1').textContent.replace('Welcome, Dr. ', '')}`
            );
            const mailtoUrl = `mailto:${patientEmail}?subject=${subject}&body=${body}`;
            window.location.href = mailtoUrl;
            showToast(`Email prepared for ${patientEmail}`);
            togglePopup(emailPopup, false);
            emailForm.reset();
        });

        cancelEmailButton.addEventListener('click', () => {
            togglePopup(emailPopup, false);
            emailForm.reset();
        });
    }

    // Close popups when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup') && e.target.classList.contains('active')) {
            togglePopup(e.target, false);
        }
    });


async function loadDoctorDashboard() {
    const status = document.getElementById('statusMessage');
    const detailsContainer = document.getElementById('detailsContainer');
    if (!status || !detailsContainer) {
        console.error('Required DOM elements not found');
        return;
    }

    status.textContent = 'Loading dashboard...';
    status.classList.remove('hidden');

    try {
        if (!userAddress || !web3.utils.isAddress(userAddress)) {
            throw new Error('Invalid or missing userAddress: ' + userAddress);
        }

        const isRegistered = await userContract.methods.isUserRegistered(userAddress).call({ from: userAddress });
        if (!isRegistered) {
            status.textContent = 'User not registered. Please register first.';
            status.classList.add('error');
            return;
        }

        const userDetails = await userContract.methods.getUserDetails(userAddress).call({ from: userAddress });
        console.log('User Details:', userDetails);

        if (userDetails.userType.toLowerCase() !== 'doctor') {
            status.textContent = 'Access denied. Doctor account required.';
            status.classList.add('error');
            return;
        }

        document.querySelector('header h1').textContent = `Welcome, Dr. ${userDetails.name || 'Doctor'}`;
        detailsContainer.innerHTML = `
            <p><strong>Name:</strong> <span>${userDetails.name || 'N/A'}</span></p>
            <p><strong>Specialty:</strong> <span>${userDetails.faculty || 'N/A'}</span></p>
            <p><strong>Hospital:</strong> <span>${userDetails.hospitalName || 'N/A'}</span></p>
            <p><strong>License Number:</strong> <span>${userDetails.licenseNo || 'N/A'}</span></p>
            <p><strong>Contact:</strong> <span>${userDetails.contact || 'N/A'}</span></p>
        `;

        status.textContent = 'Dashboard loaded successfully.';
        status.classList.add('success');
        setTimeout(() => status.classList.add('hidden'), 2000);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        status.textContent = 'Failed to load dashboard. Please try again.';
        status.classList.add('error');
    }
}

function showSignOutPopup() {
    const popup = document.getElementById('signOutPopup');
    if (!popup) {
        console.error('Sign Out popup not found in DOM');
        alert('Error: Sign Out popup not found.');
        return;
    }
    togglePopup(popup, true);
    document.getElementById('confirmSignOut').onclick = () => {
        console.log('Confirmed sign out for:', userAddress);
        clearMedVaultHistoryAndRedirect();
        togglePopup(popup, false);
    };
    document.getElementById('cancelSignOut').onclick = () => togglePopup(popup, false);
}

async function showDeleteAccountPopup() {
    const popup = document.getElementById('deleteAccountPopup');
    const status = document.getElementById('statusMessage');
    if (!popup) {
        console.error('Delete Account popup not found in DOM');
        alert('Error: Delete Account popup not found.');
        return;
    }
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
            status.textContent = 'Account deleted successfully.';
            status.classList.add('success');
            status.classList.remove('hidden');
            clearMedVaultHistoryAndRedirect();
            togglePopup(popup, false);
        } catch (error) {
            console.error('Error deleting account:', error);
            status.textContent = 'Failed to delete account. Please try again.';
            status.classList.add('error');
            status.classList.remove('hidden');
            togglePopup(popup, false);
        }
    };
    document.getElementById('cancelDeleteAccount').onclick = () => togglePopup(popup, false);
}
});