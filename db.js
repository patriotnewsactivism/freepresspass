// Database implementation using localStorage as a simple solution
// In a production environment, this would be replaced with a proper database

class Database {
  constructor() {
    this.storageKey = 'pressPasses';
    this.ensureStorage();
  }

  // Ensure localStorage has the required structure
  ensureStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Add a new press pass to the database
  addPass(passData) {
    const passes = JSON.parse(localStorage.getItem(this.storageKey));
    passes.push({
      ...passData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(this.storageKey, JSON.stringify(passes));
    return passes[passes.length - 1];
  }

  // Generate a unique ID for each pass
  generateId() {
    return 'FP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Get all passes from the database
  getAllPasses() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  // Get a specific pass by ID
  getPassById(id) {
    const passes = this.getAllPasses();
    return passes.find(pass => pass.id === id);
  }

  // Delete a pass by ID
  deletePassById(id) {
    const passes = this.getAllPasses();
    const filteredPasses = passes.filter(pass => pass.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredPasses));
    return filteredPasses;
  }

  // Update a pass by ID
  updatePassById(id, updateData) {
    const passes = this.getAllPasses();
    const passIndex = passes.findIndex(pass => pass.id === id);
    
    if (passIndex !== -1) {
      passes[passIndex] = {
        ...passes[passIndex],
        ...updateData
      };
      localStorage.setItem(this.storageKey, JSON.stringify(passes));
      return passes[passIndex];
    }
    
    return null;
  }

  // Get passes count
  getPassesCount() {
    return this.getAllPasses().length;
  }

  // Get passes for current month
  getMonthlyPasses() {
    const passes = this.getAllPasses();
    const currentMonth = new Date().toISOString().slice(0, 7);
    return passes.filter(pass => pass.createdAt.startsWith(currentMonth));
  }

  // Get unique email domains
  getUniqueEmailDomains() {
    const passes = this.getAllPasses();
    const domains = passes.map(pass => pass.email.split('@')[1]);
    return [...new Set(domains)];
  }
}

// Create a global instance of the database
const db = new Database();

// Export the database instance
export default db;