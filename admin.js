// Admin dashboard logic.  This module is responsible for displaying
// statistics and press pass data to authenticated administrators.

import { fetchPasses } from './api.js';

/**
 * Format a JavaScript Date into a human‑readable string.
 *
 * @param {string|Date} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // Redirect unauthenticated users to the login page
  if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
    return;
  }

  // Logout handler
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
  });

  try {
    const passes = await fetchPasses();
    const tbody = document.querySelector('#passesTable tbody');
    let total = 0;
    let monthly = 0;
    const domains = new Set();
    const now = new Date();

    passes.forEach((pass) => {
      total += 1;
      const issuedDate = new Date(pass.created_at || pass.issued_on || pass.created_at);
      if (
        issuedDate.getFullYear() === now.getFullYear() &&
        issuedDate.getMonth() === now.getMonth()
      ) {
        monthly += 1;
      }
      const domain = (pass.email || '').split('@')[1];
      if (domain) domains.add(domain);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${pass.name || ''}</td>
        <td>${pass.email || ''}</td>
        <td>${pass.title || ''}</td>
        <td>${pass.pass_number || ''}</td>
        <td>${formatDate(pass.created_at || pass.issued_on)}</td>
      `;
      tbody.appendChild(tr);
    });
    document.getElementById('totalPasses').textContent = `Total Passes: ${total}`;
    document.getElementById('monthlyPasses').textContent = `Passes This Month: ${monthly}`;
    document.getElementById('uniqueEmails').textContent = `Unique Email Domains: ${domains.size}`;
  } catch (err) {
    console.error('Error loading passes:', err);
  }
});