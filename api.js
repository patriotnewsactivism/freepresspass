// API endpoints for the admin panel
import db from './db.js';

// Add a new press pass
export function addPass(passData) {
  return db.addPass(passData);
}

// Get all press passes
export function getAllPasses() {
  return db.getAllPasses();
}

// Get a specific press pass by ID
export function getPassById(id) {
  return db.getPassById(id);
}

// Delete a press pass by ID
export function deletePassById(id) {
  return db.deletePassById(id);
}

// Update a press pass by ID
export function updatePassById(id, updateData) {
  return db.updatePassById(id, updateData);
}

// Get statistics
export function getStatistics() {
  return {
    totalPasses: db.getPassesCount(),
    monthlyPasses: db.getMonthlyPasses().length,
    emailDomains: db.getUniqueEmailDomains().length
  };
}