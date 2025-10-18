// This script contains the fixes for the Free Press Pass Generator

// 1. Real-time name update function
function setupRealTimeUpdates() {
  // Get the name input element
  const nameInput = document.getElementById('name');
  
  // Add event listener for input changes
  nameInput.addEventListener('input', function() {
    // Get the current name value
    const nameValue = nameInput.value.trim();
    
    // Get the current title value
    const titleValue = document.getElementById('title').value.trim();
    
    // Update the press pass in real-time
    drawPass(nameValue || 'YOUR NAME HERE', titleValue);
  });
  
  // Also add event listener for title changes
  document.getElementById('title').addEventListener('input', function() {
    const nameValue = nameInput.value.trim();
    const titleValue = this.value.trim();
    drawPass(nameValue || 'YOUR NAME HERE', titleValue);
  });
}

// 2. Update button text
function updateButtonText() {
  // Update the Generate Press Pass button
  const generateButton = document.getElementById('generate');
  generateButton.innerHTML = 'Generate <strong>FREE</strong> Press Pass Now';
  
  // Update the Laminated Pass button
  const checkoutButton = document.getElementById('checkout');
  checkoutButton.textContent = 'Enhanced/Laminated Version $15';
}

// Initialize the fixes when the page loads
document.addEventListener('DOMContentLoaded', function() {
  setupRealTimeUpdates();
  updateButtonText();
});