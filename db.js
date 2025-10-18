// Database implementation using Supabase
// This file provides a client-side interface to the Supabase database

import { createClient } from '@supabase/supabase-js';

class Database {
  constructor() {
    // Initialize Supabase client with public anon key (safe for client-side)
    // These values should be replaced with environment variables in production
    this.supabaseUrl = 'https://your-supabase-url.supabase.co';
    this.supabaseAnonKey = 'your-supabase-anon-key';
    
    // Initialize the Supabase client
    this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
    
    // Fallback to localStorage if offline or for development
    this.storageKey = 'pressPasses';
    this.ensureLocalStorage();
  }

  // Ensure localStorage has the required structure for offline/development use
  ensureLocalStorage() {
    if (typeof localStorage !== 'undefined' && !localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Add a new press pass to the database
  async addPass(passData) {
    try {
      // First try to add to Supabase
      const { data, error } = await this.supabase
        .from('press_passes')
        .insert({
          full_name: passData.name,
          email: passData.email,
          title: passData.title || null,
          organization: passData.organization || null,
          // Use the provided pass number or generate a new one
          pass_number: passData.pass_number || this.generateId()
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        // Fall back to localStorage if Supabase fails
        return this.addPassToLocalStorage(passData);
      }

      return data[0];
    } catch (err) {
      console.error('Database error:', err);
      // Fall back to localStorage if there's any error
      return this.addPassToLocalStorage(passData);
    }
  }

  // Fallback method to add pass to localStorage
  addPassToLocalStorage(passData) {
    try {
      const passes = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      const newPass = {
        ...passData,
        id: this.generateId(),
        created_at: new Date().toISOString()
      };
      passes.push(newPass);
      localStorage.setItem(this.storageKey, JSON.stringify(passes));
      return newPass;
    } catch (err) {
      console.error('LocalStorage error:', err);
      return null;
    }
  }

  // Generate a unique ID for each pass
  generateId() {
    return 'FP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Get all passes from the database
  async getAllPasses() {
    try {
      // Try to get from Supabase first
      const { data, error } = await this.supabase
        .from('press_passes')
        .select('*')
        .order('issued_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        // Fall back to localStorage
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
      }

      return data;
    } catch (err) {
      console.error('Database error:', err);
      // Fall back to localStorage
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }
  }

  // Get a specific pass by ID
  async getPassById(id) {
    try {
      // Try to get from Supabase first
      const { data, error } = await this.supabase
        .from('press_passes')
        .select('*')
        .eq('pass_number', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        // Fall back to localStorage
        const passes = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        return passes.find(pass => pass.id === id || pass.pass_number === id);
      }

      return data;
    } catch (err) {
      console.error('Database error:', err);
      // Fall back to localStorage
      const passes = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      return passes.find(pass => pass.id === id || pass.pass_number === id);
    }
  }

  // Delete a pass by ID
  async deletePassById(id) {
    try {
      // Try to delete from Supabase first
      const { error } = await this.supabase
        .from('press_passes')
        .delete()
        .eq('pass_number', id);

      if (error) {
        console.error('Supabase error:', error);
        // Fall back to localStorage
        const passes = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const filteredPasses = passes.filter(pass => pass.id !== id && pass.pass_number !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredPasses));
        return filteredPasses;
      }

      // Also remove from localStorage if it exists there
      const passes = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      const filteredPasses = passes.filter(pass => pass.id !== id && pass.pass_number !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredPasses));
      
      return await this.getAllPasses();
    } catch (err) {
      console.error('Database error:', err);
      // Fall back to localStorage
      const passes = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      const filteredPasses = passes.filter(pass => pass.id !== id && pass.pass_number !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredPasses));
      return filteredPasses;
    }
  }

  // Update a pass by ID
  async updatePassById(id, updateData) {
    try {
      // Try to update in Supabase first
      const { data, error } = await this.supabase
        .from('press_passes')
        .update({
          full_name: updateData.name,
          email: updateData.email,
          title: updateData.title,
          organization: updateData.organization
        })
        .eq('pass_number', id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        // Fall back to localStorage
        const passes = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const passIndex = passes.findIndex(pass => pass.id === id || pass.pass_number === id);
        
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

      return data[0];
    } catch (err) {
      console.error('Database error:', err);
      // Fall back to localStorage
      const passes = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      const passIndex = passes.findIndex(pass => pass.id === id || pass.pass_number === id);
      
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
  }

  // Get passes count
  async getPassesCount() {
    const passes = await this.getAllPasses();
    return passes.length;
  }

  // Get passes for current month
  async getMonthlyPasses() {
    const passes = await this.getAllPasses();
    const currentMonth = new Date().toISOString().slice(0, 7);
    return passes.filter(pass => {
      const createdAt = pass.created_at || pass.issued_at;
      return createdAt && createdAt.startsWith(currentMonth);
    });
  }

  // Get unique email domains
  async getUniqueEmailDomains() {
    const passes = await this.getAllPasses();
    const domains = passes
      .filter(pass => pass.email)
      .map(pass => pass.email.split('@')[1]);
    return [...new Set(domains)];
  }
}

// Create a global instance of the database
const db = new Database();

// Export the database instance
export default db;