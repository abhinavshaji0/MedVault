// script_medvault.js
// Ensure Web3 is loaded
if (typeof Web3 === 'undefined') {
    console.error('Web3 is not loaded. Please include the Web3 library.');
} else {
    console.log('Web3 is loaded:', Web3);
}

let web3;

if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('Please install MetaMask to use this app.');
    throw new Error('MetaMask is not installed.');
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

// Function to check if user has signed out (via session state)
function isSignedOut() {
    return sessionStorage.getItem('signedOut') === 'true';
}

// Function to clear MedVault system history and redirect
function clearMedVaultHistoryAndRedirect() {
    sessionStorage.setItem('signedOut', 'true');
    // Clear all MedVault system pages from history and redirect to homepage
    window.location.replace('homepage.html'); // Use replace to avoid adding to history
}

// Global navigation check to prevent access after sign-out
async function checkMedVaultNavigation() {
    const isLoggedIn = await isUserLoggedIn();
    if (!isLoggedIn) {
        const signedOut = isSignedOut();
        if (signedOut) {
            alert('You have been signed out. Please log in again to access this page.');
            clearMedVaultHistoryAndRedirect();
            return false;
        }
    }
    sessionStorage.removeItem('signedOut'); // Clear sign-out flag if logged in
    return true;
}

// Handle popstate (back button) for all MedVault pages
window.addEventListener('popstate', async () => {
    const canProceed = await checkMedVaultNavigation();
    if (!canProceed) {
        // Prevent default back navigation and stay on homepage
        history.pushState(null, null, window.location.pathname);
    }
});

// Export functions for use in other scripts (optional, if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { isUserLoggedIn, isSignedOut, clearMedVaultHistoryAndRedirect, checkMedVaultNavigation };
}