// Admin panel functionality
import db from './db.js';

// Check if user is authenticated
function checkAuth() {
  const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
  if (!isAuthenticated) {
    window.location.href = 'login.html';
  }
}

// Logout function
function logout() {
  sessionStorage.removeItem('authenticated');
  window.location.href = 'login.html';
}

// Populate passes table
function populatePassesTable() {
  const tableBody = document.getElementById('passesTableBody');
  const passes = db.getAllPasses();
  
  // Clear existing table content
  tableBody.innerHTML = '';
  
  // Add each pass as a row in the table
  passes.forEach(pass => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${pass.name}</td>
      <td>${pass.email}</td>
      <td>${pass.id}</td>
      <td>${new Date(pass.createdAt).toLocaleDateString()}</td>
      <td>
        <button onclick="viewPass('${pass.id}')" style="margin-right: 5px;">View</button>
        <button onclick="deletePass('${pass.id}')" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  // Update statistics
  document.getElementById('totalPasses').textContent = db.getPassesCount();
  document.getElementById('monthlyPasses').textContent = db.getMonthlyPasses().length;
  document.getElementById('emailDomains').textContent = db.getUniqueEmailDomains().length;
}

// View pass function
function viewPass(passId) {
  const pass = db.getPassById(passId);
  if (pass) {
    alert(`Pass Details:\nName: ${pass.name}\nEmail: ${pass.email}\nPass ID: ${pass.id}\nGenerated: ${new Date(pass.createdAt).toLocaleString()}`);
  } else {
    alert('Pass not found');
  }
}

// Delete pass function
function deletePass(passId) {
  if (confirm(`Are you sure you want to delete pass ${passId}?`)) {
    db.deletePassById(passId);
    populatePassesTable(); // Refresh the table
  }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  populatePassesTable();
  
  // Attach logout function to logout button
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});

// Make functions available globally for inline event handlers
window.viewPass = viewPass;
window.deletePass = deletePass;