// Admin dashboard logic with enhanced features
import { fetchPasses } from './api.js';

let allPasses = [];
let filteredPasses = [];
let sortColumn = 'created_at';
let sortDirection = 'desc';

/**
 * Format a JavaScript Date into a human-readable string.
 */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Parse user agent to get device info
 */
function parseUserAgent(ua) {
  if (!ua || ua === 'Unknown') return 'Unknown';
  
  // Extract browser
  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  // Extract OS
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'Mac';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  
  return `${browser} on ${os}`;
}

/**
 * Calculate statistics from passes
 */
function calculateStats(passes) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  let total = passes.length;
  let monthly = 0;
  let todayCount = 0;
  const domains = new Set();
  
  passes.forEach((pass) => {
    const issuedDate = new Date(pass.created_at);
    
    if (issuedDate >= thisMonth) {
      monthly++;
    }
    
    if (issuedDate >= today) {
      todayCount++;
    }
    
    const domain = (pass.email || '').split('@')[1];
    if (domain) domains.add(domain);
  });
  
  return { total, monthly, todayCount, uniqueDomains: domains.size };
}

/**
 * Filter passes based on search and date filter
 */
function filterPasses() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const dateFilter = document.getElementById('dateFilter').value;
  
  let filtered = allPasses;
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(pass => {
      return (
        (pass.name || '').toLowerCase().includes(searchTerm) ||
        (pass.email || '').toLowerCase().includes(searchTerm) ||
        (pass.pass_number || '').toLowerCase().includes(searchTerm) ||
        (pass.title || '').toLowerCase().includes(searchTerm)
      );
    });
  }
  
  // Apply date filter
  if (dateFilter !== 'all') {
    const now = new Date();
    let filterDate;
    
    switch (dateFilter) {
      case 'today':
        filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        filterDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        filterDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    
    if (filterDate) {
      filtered = filtered.filter(pass => {
        const passDate = new Date(pass.created_at);
        return passDate >= filterDate;
      });
    }
  }
  
  filteredPasses = filtered;
  renderTable();
}

/**
 * Sort passes by column
 */
function sortPasses(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = column;
    sortDirection = 'asc';
  }
  
  filteredPasses.sort((a, b) => {
    let aVal = a[column] || '';
    let bVal = b[column] || '';
    
    // Handle dates
    if (column === 'created_at') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  renderTable();
}

/**
 * Render the table with filtered and sorted data
 */
function renderTable() {
  const tbody = document.querySelector('#passesTable tbody');
  tbody.innerHTML = '';
  
  filteredPasses.forEach((pass) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${pass.name || 'N/A'}</td>
      <td>${pass.email || 'N/A'}</td>
      <td>${pass.title || 'N/A'}</td>
      <td>${pass.pass_number || 'N/A'}</td>
      <td>${formatDate(pass.created_at)}</td>
      <td>${pass.ip_address || 'N/A'}</td>
      <td title="${pass.user_agent || 'Unknown'}">${parseUserAgent(pass.user_agent)}</td>
    `;
    tbody.appendChild(tr);
  });
  
  // Update sort indicators
  document.querySelectorAll('.pass-table th').forEach(th => {
    const col = th.dataset.sort;
    if (col === sortColumn) {
      th.textContent = th.textContent.split(' ')[0] + (sortDirection === 'asc' ? ' ↑' : ' ↓');
    } else {
      th.textContent = th.textContent.split(' ')[0] + ' ↕';
    }
  });
}

/**
 * Export data to CSV
 */
function exportToCSV() {
  const headers = ['Name', 'Email', 'Title', 'Pass Number', 'Date Issued', 'IP Address', 'User Agent'];
  const rows = filteredPasses.map(pass => [
    pass.name || '',
    pass.email || '',
    pass.title || '',
    pass.pass_number || '',
    formatDate(pass.created_at),
    pass.ip_address || '',
    pass.user_agent || ''
  ]);
  
  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `press-passes-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Load and display passes
 */
async function loadPasses() {
  const loadingMessage = document.getElementById('loadingMessage');
  const errorMessage = document.getElementById('errorMessage');
  const table = document.getElementById('passesTable');
  
  try {
    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    table.style.display = 'none';
    
    const passes = await fetchPasses();
    allPasses = passes;
    filteredPasses = passes;
    
    // Calculate and display stats
    const stats = calculateStats(passes);
    document.getElementById('totalPasses').textContent = stats.total;
    document.getElementById('monthlyPasses').textContent = stats.monthly;
    document.getElementById('uniqueEmails').textContent = stats.uniqueDomains;
    document.getElementById('todayPasses').textContent = stats.todayCount;
    
    // Sort by date (newest first) by default
    sortPasses('created_at');
    sortDirection = 'desc';
    
    loadingMessage.style.display = 'none';
    table.style.display = 'table';
  } catch (err) {
    console.error('Error loading passes:', err);
    loadingMessage.style.display = 'none';
    errorMessage.textContent = `Error loading passes: ${err.message}`;
    errorMessage.style.display = 'block';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
    return;
  }

  // Logout handler
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
  });

  // Search handler
  document.getElementById('searchInput').addEventListener('input', filterPasses);
  
  // Date filter handler
  document.getElementById('dateFilter').addEventListener('change', filterPasses);
  
  // Export handler
  document.getElementById('exportCSV').addEventListener('click', exportToCSV);
  
  // Refresh handler
  document.getElementById('refreshData').addEventListener('click', loadPasses);
  
  // Sort handlers
  document.querySelectorAll('.pass-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      sortPasses(th.dataset.sort);
    });
  });

  // Load initial data
  await loadPasses();
});