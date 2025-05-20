let web3;
let userAddress;
let accessControlContract;

if (typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
} else {
  alert('Please install MetaMask to use this app.');
  throw new Error('MetaMask is not installed.');
}

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
const accessControlAddress = '0x47f108106113A67815CbeD63E1DF405F7b717eb5';
console.log('Initializing AccessControl contract with address:', accessControlAddress);
accessControlContract = new web3.eth.Contract(accessControlABI, accessControlAddress);

// MedVault Contract ABI and Address (for verification, optional)
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
const medVaultAddress = '0xA4DE4b05d72c563F185471B5EfEC73B1593166a5';
const medVaultContract = new web3.eth.Contract(medVaultABI, medVaultAddress);

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

// Initial page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM content loaded, checking access...');
  const canProceed = await restrictAccessIfSignedOut();
  if (!canProceed) return;

  history.pushState(null, null, window.location.pathname); // Set initial state
  initialize();
});

async function initialize() {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0].toLowerCase();
    console.log('Connected patient address:', userAddress);

    const isRegistered = await medVaultContract.methods.isUserRegistered(userAddress).call();
    if (!isRegistered) {
      throw new Error('User not registered in MedVault. Please register first.');
    }

    try {
      const userDetails = await medVaultContract.methods.getUserDetails(userAddress).call();
      console.log('User Details:', userDetails);
      const userType = userDetails.userType.toLowerCase().trim();
      if (userType !== 'patient') {
        throw new Error('Only patients can grant access. Your user type is: ' + userType);
      }
    } catch (detailsError) {
      if (detailsError.message.includes('execution reverted: Unauthorized access')) {
        console.warn('Direct access to getUserDetails failed due to Unauthorized access.');
      } else {
        throw detailsError;
      }
    }

    document.getElementById('grantButton')?.addEventListener('click', grantAccess);
    document.getElementById('revokeButton')?.addEventListener('click', revokeAccess);

    if (!document.getElementById('grantButton') || !document.getElementById('revokeButton')) {
      console.warn('One or both buttons (grantButton, revokeButton) not found in the DOM.');
    }
  } catch (error) {
    console.error('Error initializing:', error);
    alert('Initialization failed. ' + error.message);
  }
}

async function grantAccess() {
  const status = document.getElementById('status');
  status.style.display = 'block';
  status.textContent = 'Granting access...';

  try {
    const doctorAddress = document.getElementById('doctorAddress').value.trim().toLowerCase();
    if (!web3.utils.isAddress(doctorAddress)) {
      throw new Error('Invalid doctor Ethereum address');
    }

    if (doctorAddress === userAddress) {
      throw new Error('Cannot grant access to yourself');
    }

    const isDoctorRegistered = await medVaultContract.methods.isUserRegistered(doctorAddress).call();
    if (!isDoctorRegistered) {
      throw new Error('Doctor not registered in MedVault.');
    }

    try {
      const doctorDetails = await medVaultContract.methods.getUserDetails(doctorAddress).call();
      console.log('Doctor Details:', doctorDetails);
      const doctorUserType = doctorDetails.userType.toLowerCase().trim();
      if (doctorUserType !== 'doctor') {
        throw new Error('Target must be a doctor. User type is: ' + doctorUserType);
      }
    } catch (detailsError) {
      if (detailsError.message.includes('execution reverted: Unauthorized access')) {
        console.warn('Direct access to getUserDetails for doctor failed due to Unauthorized access.');
      } else {
        throw detailsError;
      }
    }

    console.log('Granting access for doctor:', doctorAddress, 'by patient:', userAddress);

    const gasEstimate = await accessControlContract.methods.grantAccess(doctorAddress).estimateGas({ from: userAddress });
    const gas = Math.min(Math.ceil(Number(gasEstimate)), 3000000);
    const gasPrice = web3.utils.toWei('100', 'gwei');

    await accessControlContract.methods.grantAccess(doctorAddress).send({
      from: userAddress,
      gas: gas,
      gasPrice: gasPrice
    }).on('transactionHash', (hash) => {
      console.log('Grant access transaction submitted, hash:', hash);
    }).on('confirmation', (confirmationNumber, receipt) => {
      console.log('Grant access confirmed, confirmation:', confirmationNumber, 'Receipt:', receipt);
      status.textContent = 'Access granted successfully!';
    }).on('error', (error, receipt) => {
      console.error('Error granting access:', error, receipt);
      throw error;
    });
  } catch (error) {
    console.error('Error in grantAccess:', error);
    status.textContent = 'Failed to grant access. Please try again.';
    if (error.message.includes('Patient not registered') || error.message.includes('Doctor not registered') || error.message.includes('Only patients can grant access') || error.message.includes('Target must be a doctor') || error.message.includes('Cannot grant access to yourself')) {
      status.textContent += ` Error: ${error.message}`;
    }
  }
  setTimeout(() => { status.style.display = 'none'; }, 2000);
}

async function revokeAccess() {
  const status = document.getElementById('status');
  status.style.display = 'block';
  status.textContent = 'Revoking access...';

  try {
    const doctorAddress = document.getElementById('doctorAddress').value.trim().toLowerCase();
    if (!web3.utils.isAddress(doctorAddress)) {
      throw new Error('Invalid doctor Ethereum address');
    }

    if (doctorAddress === userAddress) {
      throw new Error('Cannot revoke access from yourself');
    }

    const isDoctorRegistered = await medVaultContract.methods.isUserRegistered(doctorAddress).call();
    if (!isDoctorRegistered) {
      throw new Error('Doctor not registered in MedVault.');
    }

    try {
      const doctorDetails = await medVaultContract.methods.getUserDetails(doctorAddress).call();
      console.log('Doctor Details:', doctorDetails);
      const doctorUserType = doctorDetails.userType.toLowerCase().trim();
      if (doctorUserType !== 'doctor') {
        throw new Error('Target must be a doctor. User type is: ' + doctorUserType);
      }
    } catch (detailsError) {
      if (detailsError.message.includes('execution reverted: Unauthorized access')) {
        console.warn('Direct access to getUserDetails for doctor failed due to Unauthorized access.');
      } else {
        throw detailsError;
      }
    }

    console.log('Revoking access for doctor:', doctorAddress, 'by patient:', userAddress);

    const gasEstimate = await accessControlContract.methods.revokeAccess(doctorAddress).estimateGas({ from: userAddress });
    const gas = Math.min(Math.ceil(Number(gasEstimate)), 3000000);
    const gasPrice = web3.utils.toWei('100', 'gwei');

    await accessControlContract.methods.revokeAccess(doctorAddress).send({
      from: userAddress,
      gas: gas,
      gasPrice: gasPrice
    }).on('transactionHash', (hash) => {
      console.log('Revoke access transaction submitted, hash:', hash);
    }).on('confirmation', (confirmationNumber, receipt) => {
      console.log('Revoke access confirmed, confirmation:', confirmationNumber, 'Receipt:', receipt);
      status.textContent = 'Access revoked successfully!';
    }).on('error', (error, receipt) => {
      console.error('Error revoking access:', error, receipt);
      throw error;
    });
  } catch (error) {
    console.error('Error in revokeAccess:', error);
    status.textContent = 'Failed to revoke access. Please try again.';
    if (error.message.includes('Patient not registered') || error.message.includes('Doctor not registered') || error.message.includes('Only patients can revoke access') || error.message.includes('No access to revoke') || error.message.includes('Cannot revoke access from yourself')) {
      status.textContent += ` Error: ${error.message}`;
    }
  }
  setTimeout(() => { status.style.display = 'none'; }, 2000);
}