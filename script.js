let web3;
let userAddress;
let medVaultContract;
let doctorApprovalContract;

if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('Please install MetaMask to use this app.');
    throw new Error('MetaMask is not installed.');
}

const adminAddress = '0xCe5Ab2d31301232E95dAC52d3153428c5aDD49Dc'.toLowerCase();

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
const medVaultAddress = '0xA4DE4b05d72c563F185471B5EfEC73B1593166a5';
medVaultContract = new web3.eth.Contract(medVaultABI, medVaultAddress);

const doctorApprovalABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_doctorAddress",
				"type": "address"
			}
		],
		"name": "approveDoctor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_medVaultAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "doctorAddress",
				"type": "address"
			}
		],
		"name": "DoctorApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "doctorAddress",
				"type": "address"
			}
		],
		"name": "DoctorRejected",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "doctorAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "DoctorRequested",
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
		"name": "rejectDoctor",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "requestDoctorRegistration",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newAdmin",
				"type": "address"
			}
		],
		"name": "setAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPendingDoctors",
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
					},
					{
						"internalType": "bool",
						"name": "isPending",
						"type": "bool"
					}
				],
				"internalType": "struct DoctorApproval.DoctorRequest[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "medVault",
		"outputs": [
			{
				"internalType": "contract IMedVault",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "pendingDoctorAddresses",
		"outputs": [
			{
				"internalType": "address",
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
			}
		],
		"name": "pendingDoctors",
		"outputs": [
			{
				"internalType": "address",
				"name": "doctorAddress",
				"type": "address"
			},
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
			},
			{
				"internalType": "bool",
				"name": "isPending",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const doctorApprovalAddress = '0x44473B41A9E151D56FA8FBE7e0feE4216A4b29CF'; // Replace with deployed DoctorApproval address
console.log('Initializing DoctorApproval contract with address:', doctorApprovalAddress);
doctorApprovalContract = new web3.eth.Contract(doctorApprovalABI, doctorApprovalAddress);

// Function to validate date of birth and update alert
function validateDOB(dob) {
    const dobAlert = document.getElementById('dobAlert');
    if (!dob) {
        dobAlert.classList.add('hidden');
        dobAlert.classList.remove('visible');
        return true;
    }

    const currentDate = new Date();
    const inputDate = new Date(dob);
    currentDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > currentDate) {
        dobAlert.classList.remove('hidden');
        dobAlert.classList.add('visible');
        return false;
    } else {
        dobAlert.classList.add('hidden');
        dobAlert.classList.remove('visible');
        return true;
    }
}

// Function to toggle fields based on user type
function toggleFields(userType) {
    const patientFields = document.getElementById('patientFields');
    const doctorFields = document.getElementById('doctorFields');

    if (userType === 'patient') {
        patientFields.classList.remove('hidden');
        doctorFields.classList.add('hidden');
    } else if (userType === 'doctor') {
        doctorFields.classList.remove('hidden');
        patientFields.classList.add('hidden');
    }
}

// Handle MetaMask account changes and admin redirect
window.ethereum.on('accountsChanged', async (accounts) => {
    if (!accounts.length) {
        console.log('MetaMask disconnected.');
        sessionStorage.setItem('signedOut', 'true');
        window.location.replace('/homepage.html');
    } else {
        userAddress = accounts[0].toLowerCase();
        console.log('Account changed to:', userAddress);
        if (userAddress === adminAddress) {
            console.log('Admin detected, redirecting to admin.html');
            window.location.replace('/admin.html');
        }
    }
});

// Set default fields and initialize on page load
document.addEventListener('DOMContentLoaded', async function () {
    const userType = document.getElementById('userType').value || 'patient';
    toggleFields(userType);

    const dobInput = document.getElementById('dob');
    dobInput.addEventListener('change', function () {
        validateDOB(this.value);
    });

    // Check initial MetaMask connection for admin redirect
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            userAddress = accounts[0].toLowerCase();
            console.log('Initial connected address:', userAddress);
            if (userAddress === adminAddress) {
                console.log('Admin detected on load, redirecting to admin.html');
                window.location.replace('/admin.html');
            }
        }
    } catch (error) {
        console.error('Error checking initial accounts:', error);
    }
});

// Handle user type change
document.getElementById('userType').addEventListener('change', function () {
    const userType = this.value;
    toggleFields(userType);
    const dobAlert = document.getElementById('dobAlert');
    dobAlert.classList.add('hidden');
    dobAlert.classList.remove('visible');
});

// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!web3) {
        alert('Web3 is not initialized. Please install MetaMask.');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0].toLowerCase();
        console.log('Connected address for registration:', userAddress);

        // Check if admin is trying to register
        if (userAddress === adminAddress) {
            alert('Admin cannot register as a user. Redirecting to admin dashboard.');
            window.location.replace('/admin.html');
            return;
        }

        const userTypeInput = document.getElementById('userType').value;
        const userType = userTypeInput.toLowerCase().trim();
        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;

        const isRegistered = await medVaultContract.methods.isUserRegistered(userAddress).call();
        if (isRegistered) {
            throw new Error('User already registered. Please log in or use a different address.');
        }

        if (userType === 'patient') {
            const dob = document.getElementById('dob').value;
            const bloodGroup = document.getElementById('bloodGroup').value;
            const gender = document.getElementById('gender').value;

            if (!validateDOB(dob)) {
                throw new Error('Date of Birth cannot be in the future.');
            }

            await medVaultContract.methods.registerUser(
                name,
                contact,
                userType,
                dob,
                bloodGroup,
                gender,
                '',
                '',
                ''
            ).send({ from: userAddress, gas: 3000000, gasPrice: web3.utils.toWei('150', 'gwei') });

            alert('Registration Successful!');
            window.location.replace('/patient-dashboard.html');
        } else if (userType === 'doctor') {

            // Inside registerForm event listener in script.js
    const pendingRequest = await doctorApprovalContract.methods.pendingDoctors(userAddress).call();
    if (pendingRequest.isPending) {
        throw new Error('Your registration is still pending approval.');
    }
    // If not pending, assume approved and allow registration
    const licenseNo = document.getElementById('licenseNo').value;
    const hospitalName = document.getElementById('hospitalName').value;
    const faculty = document.getElementById('faculty').value;

    await medVaultContract.methods.registerUser(
        name,
        contact,
        userType,
        '',
        '',
        '',
        licenseNo,
        hospitalName,
        faculty
    ).send({ from: userAddress, gas: 3000000, gasPrice: web3.utils.toWei('150', 'gwei') });

    alert('Registration Successful!');
    window.location.replace('/doctor-dashboard.html');
} else {
            throw new Error('Invalid user type. Must be "patient" or "doctor".');
        }

        sessionStorage.removeItem('signedOut');
    } catch (error) {
        console.error('Error registering user:', error);
        alert('Registration failed: ' + error.message + '. Check the console for details.');
    }
});

// Optimized function to request signature with retries
async function requestSignature(userAddress, message, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempt ${attempt}: Requesting signature...`);
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [web3.utils.utf8ToHex(message), userAddress]
            });
            console.log('Signature obtained:', signature);
            return signature;
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt === retries) {
                throw new Error('Failed to obtain signature after multiple attempts. Please ensure MetaMask is unlocked and try again.');
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

// Handle login with MetaMask and signature verification
document.getElementById('loginButton').addEventListener('click', async function () {
    if (!web3) {
        alert('Web3 is not initialized. Please install MetaMask.');
        return;
    }

    try {
        console.log('Step 1: Requesting accounts for login...');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0].toLowerCase();
        console.log('Logged in with address:', userAddress);

        // Redirect admin to admin.html
        if (userAddress === adminAddress) {
            console.log('Admin detected during login, redirecting to admin.html');
            window.location.replace('/admin.html');
            return;
        }

        const userConfirmed = confirm('Please ensure MetaMask is unlocked. Click OK to proceed with signing.');
        if (!userConfirmed) {
            throw new Error('Login cancelled by user.');
        }

        console.log('Step 1.5: Requesting signature for authentication...');
        const message = `Authenticate login for MedVault at ${new Date().toISOString()}`;
        const signature = await requestSignature(userAddress, message);

        const recoveredAddress = await web3.eth.personal.ecRecover(message, signature);
        if (recoveredAddress.toLowerCase() !== userAddress) {
            throw new Error('Signature verification failed. Please try again.');
        }
        console.log('Signature verified successfully for address:', recoveredAddress);

        console.log('Step 2: Checking registration...');
        const isRegistered = await medVaultContract.methods.isUserRegistered(userAddress).call();
        if (!isRegistered) {
            alert('User not registered. Please register first.');
            return;
        }

        console.log('Step 3: Fetching user details...');
        const userDetails = await medVaultContract.methods.getUserDetails(userAddress).call();
        console.log('User Details:', userDetails);

        const userType = userDetails.userType.toLowerCase().trim();
        if (userType === 'patient') {
            window.location.replace('/patient-dashboard.html');
        } else if (userType === 'doctor') {
            window.location.replace('/doctor-dashboard.html');
        } else {
            alert('Invalid user type. Please register as a patient or doctor.');
            return;
        }
        sessionStorage.removeItem('signedOut');
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed: ' + error.message + '. Check the console for details.');
    }
});