import { LeadAPI } from './api';
import axios from 'axios';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Get all leads
export const getLeads = async () => {
  try {
    const response = await LeadAPI.getAll();
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

// Get single lead by ID
export const getLead = async (id) => {
  try {
    const response = await LeadAPI.getById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lead with ID ${id}:`, error);
    return null;
  }
};

// Create a new lead
export const createLead = async (leadData) => {
  try {
    const response = await LeadAPI.create(leadData);
    return response.data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

// Update an existing lead
export const updateLead = async (id, leadData) => {
  try {
    const response = await LeadAPI.update(id, leadData);
    return response.data;
  } catch (error) {
    console.error(`Error updating lead with ID ${id}:`, error);
    throw error;
  }
};

// Delete a lead
export const deleteLead = async (id) => {
  try {
    await LeadAPI.delete(id);
    return true;
  } catch (error) {
    console.error(`Error deleting lead with ID ${id}:`, error);
    throw error;
  }
};

// Add a note to a lead
export const addLeadNote = async (id, note) => {
  try {
    const response = await LeadAPI.addNote(id, note);
    return response.data;
  } catch (error) {
    console.error(`Error adding note to lead with ID ${id}:`, error);
    throw error;
  }
};

// Add a task to a lead
export const addLeadTask = async (id, task) => {
  try {
    const response = await LeadAPI.addTask(id, task);
    return response.data;
  } catch (error) {
    console.error(`Error adding task to lead with ID ${id}:`, error);
    throw error;
  }
};

// Update a task associated with a lead
export const updateLeadTask = async (leadId, taskId, updates) => {
  try {
    const response = await LeadAPI.updateTask(leadId, taskId, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating task for lead with ID ${leadId}:`, error);
    throw error;
  }
};

// Backwards compatibility functions for LeadScriptNavigator

// Get all leads (renamed function)
export const getAllLeads = async () => {
  try {
    const response = await LeadAPI.getAll();
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

// Get lead by ID (renamed function)
export const getLeadById = async (id) => {
  try {
    const response = await LeadAPI.getById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lead with ID ${id}:`, error);
    return null;
  }
};

// Fallback to localStorage for offline/development use
export const getAllLeadsFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('appLeads') || '[]');
  } catch (error) {
    console.error('Error loading leads from localStorage:', error);
    return [];
  }
};

// Save leads to localStorage (fallback)
export const saveLeadsToLocalStorage = (leads) => {
  try {
    localStorage.setItem('appLeads', JSON.stringify(leads));
    return true;
  } catch (error) {
    console.error('Error saving leads to localStorage:', error);
    return false;
  }
};

// Export a default object for backwards compatibility
const leadService = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  addLeadNote,
  addLeadTask,
  updateLeadTask,
  getAllLeads,
  getLeadById,
  getAllLeadsFromLocalStorage,
  saveLeadsToLocalStorage
};

export default leadService;