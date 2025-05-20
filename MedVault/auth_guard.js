// auth_guard.js
if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum); // Attach to window for global access
  } else {
    alert('Please install MetaMask to use this app.');
    throw new Error('MetaMask is not installed.');
  }
  
  // Function to check if user is logged in via MetaMask
  async function isUserLoggedIn() {
    try {
      const accounts = await window.web3.eth.getAccounts();
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
  
  // Function to redirect to homepage
  function redirectToHomepage() {
    sessionStorage.setItem('signedOut', 'true');
    window.location.replace('homepage.html');
  }
  
  // Global navigation check
  async function checkNavigation() {
    const isLoggedIn = await isUserLoggedIn();
    if (!isLoggedIn) {
      if (isSignedOut()) {
        alert('You have been signed out. Please log in again.');
        redirectToHomepage();
        return false;
      } else {
        alert('Please log in to access this page.');
        redirectToHomepage();
        return false;
      }
    }
    sessionStorage.removeItem('signedOut');
    return true;
  }
  
  // Prevent back navigation
  function preventBackNavigation() {
    history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', async () => {
      const canProceed = await checkNavigation();
      if (!canProceed) {
        history.pushState(null, null, window.location.pathname);
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const canProceed = await checkNavigation();
    if (!canProceed) {
      preventBackNavigation();
    } else {
      preventBackNavigation();
      window.dispatchEvent(new Event('authReady'));
    }
  });