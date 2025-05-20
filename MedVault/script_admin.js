let web3;
let userAddress;
let medVaultContract;
let doctorApprovalContract;

const adminAddress = '0xCe5Ab2d31301232E95dAC52d3153428c5aDD49Dc'.toLowerCase();

if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('Please install MetaMask to use this app.');
    throw new Error('MetaMask is not installed.');
}

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
const doctorApprovalAddress = '0x44473B41A9E151D56FA8FBE7e0feE4216A4b29CF'; 
if (!web3.utils.isAddress(medVaultAddress)) {
    throw new Error(`Invalid MedVault address: ${medVaultAddress}`);
}
console.log('Initializing MedVault contract with address:', medVaultAddress);
medVaultContract = new web3.eth.Contract(medVaultABI, medVaultAddress);

if (!web3.utils.isAddress(doctorApprovalAddress)) {
    throw new Error(`Invalid DoctorApproval address: ${doctorApprovalAddress}`);
}
console.log('Initializing DoctorApproval contract with address:', doctorApprovalAddress);
doctorApprovalContract = new web3.eth.Contract(doctorApprovalABI, doctorApprovalAddress);

async function initialize() {
    const status = document.getElementById('status');
    const pendingDoctorsList = document.getElementById('pendingDoctorsList');

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0].toLowerCase();
        console.log('Connected address:', userAddress);

        if (userAddress !== adminAddress) {
            throw new Error('Access denied: Only the admin can access this page.');
        }

        status.textContent = 'Loading pending doctor registrations...';
        status.classList.remove('hidden', 'success', 'error');

        await loadPendingDoctors();

        history.replaceState({ page: 'admin' }, '', window.location.pathname);
    } catch (error) {
        console.error('Error initializing:', error);
        status.textContent = 'Initialization failed: ' + error.message;
        status.classList.add('error');
        status.classList.remove('hidden');
        pendingDoctorsList.innerHTML = '<p class="empty-state">Unable to load pending registrations.</p>';
    }
}

async function loadPendingDoctors() {
    const status = document.getElementById('status');
    const pendingDoctorsList = document.getElementById('pendingDoctorsList');

    try {
        const pending = await doctorApprovalContract.methods.getPendingDoctors().call();
        const pendingDoctors = pending.filter(req => req.isPending);

        if (pendingDoctors.length === 0) {
            pendingDoctorsList.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3>No Pending Registrations</h3>
                    <p>No doctor registration requests found.</p>
                </div>
            `;
        } else {
            pendingDoctorsList.innerHTML = `
                <table class="records-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>License No</th>
                            <th>Hospital</th>
                            <th>Faculty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pendingDoctors.map(doctor => `
                            <tr>
                                <td>${doctor.name || 'N/A'}</td>
                                <td title="${doctor.doctorAddress}">${truncateHash(doctor.doctorAddress)}</td>
                                <td>${doctor.licenseNo || 'N/A'}</td>
                                <td>${doctor.hospitalName || 'N/A'}</td>
                                <td>${doctor.faculty || 'N/A'}</td>
                                <td>
                                    <button class="action-button approve-button" data-address="${doctor.doctorAddress}">Approve</button>
                                    <button class="action-button reject-button" data-address="${doctor.doctorAddress}">Reject</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            document.querySelectorAll('.approve-button').forEach(button => {
                button.addEventListener('click', async () => {
                    const address = button.getAttribute('data-address');
                    await handleApproval(address, true);
                });
            });

            document.querySelectorAll('.reject-button').forEach(button => {
                button.addEventListener('click', async () => {
                    const address = button.getAttribute('data-address');
                    await handleApproval(address, false);
                });
            });
        }

        status.textContent = 'Pending registrations loaded successfully.';
        status.classList.add('success');
        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 3000);
    } catch (error) {
        console.error('Error loading pending doctors:', error);
        status.textContent = 'Failed to load pending registrations: ' + error.message;
        status.classList.add('error');
        status.classList.remove('hidden');
    }
}

async function handleApproval(doctorAddress, approve) {
    const status = document.getElementById('status');
    try {
        status.textContent = `${approve ? 'Approving' : 'Rejecting'} doctor ${truncateHash(doctorAddress)}...`;
        status.classList.remove('hidden', 'success', 'error');

        const pendingRequest = await doctorApprovalContract.methods.pendingDoctors(doctorAddress).call();
        console.log('Pending request for', doctorAddress, ':', pendingRequest);
        if (!pendingRequest.isPending) {
            throw new Error('No pending registration request for this doctor.');
        }

        const isRegistered = await medVaultContract.methods.isUserRegistered(doctorAddress).call();
        console.log('Is registered in MedVault:', isRegistered);
        if (isRegistered) {
            throw new Error('Doctor is already registered in MedVault.');
        }

        if (approve) {
            await doctorApprovalContract.methods.approveDoctor(doctorAddress).send({
                from: userAddress,
                gas: 3000000,
                gasPrice: web3.utils.toWei('150', 'gwei')
            });
            status.textContent = `Doctor ${truncateHash(doctorAddress)} approved. They can now register in MedVault.`;
        } else {
            await doctorApprovalContract.methods.rejectDoctor(doctorAddress).send({
                from: userAddress,
                gas: 3000000,
                gasPrice: web3.utils.toWei('150', 'gwei')
            });
            status.textContent = `Doctor ${truncateHash(doctorAddress)} rejected successfully.`;
        }

        await loadPendingDoctors();

        status.classList.add('success');
        setTimeout(() => status.classList.add('hidden'), 3000);
    } catch (error) {
        console.error(`Error ${approve ? 'approving' : 'rejecting'} doctor:`, error);
        let errorMessage = error.message;
        if (error.code === 4001) {
            errorMessage = 'Transaction rejected by user in MetaMask.';
        } else if (error.message.includes('reverted')) {
            errorMessage = 'Transaction reverted. Ensure the DoctorApproval contract only removes the pending request.';
        }
        status.textContent = `Failed to ${approve ? 'approve' : 'reject'} doctor: ${errorMessage}`;
        status.classList.add('error');
        status.classList.remove('hidden');
    }
}

function truncateHash(hash) {
    if (hash.length > 16) {
        return hash.substring(0, 8) + '...' + hash.substring(hash.length - 8);
    }
    return hash;
}

document.addEventListener('DOMContentLoaded', initialize);