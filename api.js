// API layer for interacting with Netlify serverless functions.
// These functions abstract the network requests used by the application.

/**
 * Send a new press pass record to the backend for persistent storage.
 *
 * @param {Object} passData - Object containing name, title, email and pass_number.
 * @returns {Promise<Object>} The inserted pass record as returned by the server.
 */
export async function trackPass(passData) {
  try {
    // Validate required fields before sending
    if (!passData.name || !passData.email || !passData.pass_number) {
      throw new Error('Missing required fields: name, email, or pass number');
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(passData.email)) {
      throw new Error('Invalid email format');
    }

    const response = await fetch('/api/track-pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to track press pass: ${errorData.error || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error tracking press pass:', error);
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
}

/**
 * Fetch all issued press passes from the backend.
 *
 * @returns {Promise<Array>} Array of press pass records.
 */
export async function fetchPasses() {
  try {
    const response = await fetch('/api/get-passes');
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to fetch passes: ${errorData.error || response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching passes:', error);
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
}

/**
 * Check if the backend API is available.
 * This can be used to determine if we should use the API or fall back to localStorage.
 *
 * @returns {Promise<boolean>} True if the API is available, false otherwise.
 */
export async function isApiAvailable() {
  try {
    // Use a HEAD request to check if the API endpoint is available
    const response = await fetch('/api/health-check', {
      method: 'HEAD'
    });
    
    return response.ok;
  } catch (error) {
    console.warn('API availability check failed:', error);
    return false;
  }
}