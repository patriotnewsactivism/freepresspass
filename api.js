// API layer for interacting with Netlify serverless functions.
// These functions abstract the network requests used by the application.

/**
 * Send a new press pass record to the backend for persistent storage.
 *
 * @param {Object} passData - Object containing name, title, email and pass_number.
 * @returns {Promise<Object>} The inserted pass record as returned by the server.
 */
export async function trackPass(passData) {
  const response = await fetch('/api/track-pass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(passData)
  });
  if (!response.ok) {
    throw new Error(`Failed to track press pass: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch all issued press passes from the backend.
 *
 * @returns {Promise<Array>} Array of press pass records.
 */
export async function fetchPasses() {
  const response = await fetch('/api/get-passes');
  if (!response.ok) {
    throw new Error(`Failed to fetch passes: ${response.statusText}`);
  }
  return response.json();
}