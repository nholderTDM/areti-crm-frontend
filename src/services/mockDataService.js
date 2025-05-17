const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// Local storage key for mock data preference
const MOCK_DATA_PREF_KEY = 'use_mock_data';

/**
 * Get user preference for using mock data
 * @returns {boolean} Whether to use mock data
 */
export const getUseMockDataPreference = () => {
  // First check if there is a user preference stored
  const storedPref = localStorage.getItem(MOCK_DATA_PREF_KEY);
  if (storedPref !== null) {
    return storedPref === 'true';
  }
  
  // If no preference, use the environment setting
  return USE_MOCK_DATA;
};

/**
 * Set user preference for using mock data
 * @param {boolean} useMock - Whether to use mock data
 */
export const setUseMockDataPreference = (useMock) => {
  localStorage.setItem(MOCK_DATA_PREF_KEY, useMock.toString());
};

/**
 * Mock API response with the given data
 * @param {any} data - The data to return
 * @param {number} delay - Optional delay in ms to simulate network latency
 * @param {boolean} shouldFail - Whether the request should fail (for testing error handling)
 * @param {number} errorStatus - HTTP status code for the error
 * @returns {Promise} A promise that resolves to the data or rejects with an error
 */
export const mockResponse = (data, delay = 300, shouldFail = false, errorStatus = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject({
          status: errorStatus,
          message: `Mock API error (${errorStatus})`,
          response: { status: errorStatus }
        });
      } else {
        resolve({ data, status: 200 });
      }
    }, delay);
  });
};

/**
 * Helper to decide whether to use the actual API call or return mock data
 * Renamed to avoid React Hook linting errors
 */
export const getApiOrMockResponse = async (apiCall, mockDataFn, params) => {
  const useMock = getUseMockDataPreference();
  
  // In development with mock data enabled, use mock data
  if (useMock) {
    return mockDataFn(params);
  }
  
  // Otherwise use the real API
  return apiCall(params);
};

// Generate mock leads
export const generateMockLeads = (filters = {}, count = 50) => {
  // Generate base data if not already cached
  if (!window._mockLeadsCache) {
    // Create mock leads
    window._mockLeadsCache = Array.from({ length: count }, (_, idx) => ({
      _id: `mock_lead_${idx}`,
      firstName: `FirstName${idx}`,
      lastName: `LastName${idx}`,
      company: `Company ${idx} Ltd`,
      email: `contact${idx}@example.com`,
      phone: `(123) 456-${idx.toString().padStart(4, '0')}`,
      status: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'][idx % 7],
      source: ['website', 'referral', 'social-media', 'email-campaign', 'cold-call', 'lead-generator', 'event', 'other'][idx % 8],
      value: Math.floor(Math.random() * 100000),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
      updatedAt: new Date(),
      lastContact: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000),
      nextFollowUp: new Date(Date.now() + Math.floor(Math.random() * 10) * 86400000),
      history: [
        {
          _id: `hist_${idx}_1`,
          type: 'note',
          content: `This is a sample note for lead ${idx}`,
          timestamp: new Date(Date.now() - 5 * 86400000),
          userName: 'Demo User'
        }
      ],
      tasks: [
        {
          _id: `task_${idx}_1`,
          title: `Task for lead ${idx}`,
          dueDate: new Date(Date.now() + 3 * 86400000),
          completed: false,
          createdAt: new Date(Date.now() - 2 * 86400000)
        }
      ]
    }));
  }

  // Apply filters if provided
  let filteredLeads = [...window._mockLeadsCache];
  
  if (filters) {
    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
    }
    
    // Filter by source
    if (filters.source && filters.source !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.source === filters.source);
    }
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredLeads = filteredLeads.filter(lead => 
        lead.firstName.toLowerCase().includes(searchLower) ||
        lead.lastName.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        (lead.phone && lead.phone.includes(filters.search))
      );
    }
  }
  
  return filteredLeads;
};

// Generate mock tasks
export const generateMockTasks = (filters = {}, count = 30) => {
  if (!window._mockTasksCache) {
    window._mockTasksCache = Array.from({ length: count }, (_, idx) => ({
      _id: `mock_task_${idx}`,
      title: `Task ${idx}`,
      description: `Description for task ${idx}`,
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 14) * 86400000),
      priority: ['low', 'medium', 'high', 'urgent'][idx % 4],
      status: ['pending', 'in-progress', 'completed'][idx % 3],
      category: ['follow-up', 'meeting', 'call', 'email', 'other'][idx % 5],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
      updatedAt: new Date()
    }));
  }
  
  // Filter tasks based on provided filters
  let filteredTasks = [...window._mockTasksCache];
  // Add filter logic here if needed
  
  return filteredTasks;
};

// Generate mock contacts
export const generateMockContacts = (filters = {}, count = 40) => {
  if (!window._mockContactsCache) {
    window._mockContactsCache = Array.from({ length: count }, (_, idx) => ({
      _id: `mock_contact_${idx}`,
      firstName: `Contact${idx}`,
      lastName: `LastName${idx}`,
      email: `contact${idx}@example.com`,
      phone: `(123) 456-${idx.toString().padStart(4, '0')}`,
      company: `Company ${idx} Ltd`,
      jobTitle: `Job Title ${idx}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
      updatedAt: new Date()
    }));
  }
  
  // Filter contacts based on provided filters
  let filteredContacts = [...window._mockContactsCache];
  // Add filter logic here if needed
  
  return filteredContacts;
};

// Generate mock companies
export const generateMockCompanies = (filters = {}, count = 25) => {
  if (!window._mockCompaniesCache) {
    window._mockCompaniesCache = Array.from({ length: count }, (_, idx) => ({
      _id: `mock_company_${idx}`,
      name: `Company ${idx} Ltd`,
      description: `Description for company ${idx}`,
      industry: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'][idx % 5],
      website: `https://company${idx}.example.com`,
      email: `info@company${idx}.example.com`,
      phone: `(123) 456-${idx.toString().padStart(4, '0')}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
      updatedAt: new Date()
    }));
  }
  
  // Filter companies based on provided filters
  let filteredCompanies = [...window._mockCompaniesCache];
  // Add filter logic here if needed
  
  return filteredCompanies;
};

// Mock implementation of lead-related functions
const findMockLeadById = (id) => {
  if (!window._mockLeadsCache) {
    window._mockLeadsCache = generateMockLeads();
  }
  return window._mockLeadsCache.find(lead => lead._id === id);
};

const addMockLeadNote = (leadId, noteContent) => {
  const lead = findMockLeadById(leadId);
  if (!lead) return null;
  
  // Create new note
  const newNote = {
    _id: `note_${Date.now()}`,
    type: 'note',
    content: noteContent,
    timestamp: new Date(),
    userName: 'Current User',
    user: {
      firstName: 'Current',
      lastName: 'User'
    }
  };
  
  // Add to history
  if (!lead.history) lead.history = [];
  lead.history = [newNote, ...lead.history];
  lead.updatedAt = new Date();
  
  return lead;
};

const addMockLeadTask = (leadId, taskData) => {
  const lead = findMockLeadById(leadId);
  if (!lead) return null;
  
  // Create new task
  const newTask = {
    _id: `task_${Date.now()}`,
    ...taskData,
    createdAt: new Date()
  };
  
  // Add to tasks
  if (!lead.tasks) lead.tasks = [];
  lead.tasks = [newTask, ...lead.tasks];
  lead.updatedAt = new Date();
  
  return lead;
};

const updateMockLeadTask = (leadId, taskId, taskData) => {
  const lead = findMockLeadById(leadId);
  if (!lead) return null;
  if (!lead.tasks) lead.tasks = [];
  
  // Find the task
  const taskIndex = lead.tasks.findIndex(task => task._id === taskId);
  if (taskIndex === -1) return lead;
  
  // Update task
  lead.tasks[taskIndex] = {
    ...lead.tasks[taskIndex],
    ...taskData,
    // If completing the task, set completedAt
    completedAt: taskData.completed ? new Date() : lead.tasks[taskIndex].completedAt
  };
  
  lead.updatedAt = new Date();
  
  return lead;
};

const createMockLead = (leadData) => {
  const newLead = {
    ...leadData,
    _id: `mock_lead_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  if (!window._mockLeadsCache) {
    window._mockLeadsCache = generateMockLeads();
  }
  
  window._mockLeadsCache.unshift(newLead);
  return newLead;
};

const updateMockLead = (id, leadData) => {
  const lead = findMockLeadById(id);
  if (!lead) return null;
  
  Object.assign(lead, leadData, { updatedAt: new Date() });
  return lead;
};

const deleteMockLead = (id) => {
  if (!window._mockLeadsCache) return { success: true };
  
  window._mockLeadsCache = window._mockLeadsCache.filter(lead => lead._id !== id);
  return { success: true };
};

// Export specialized mock service functions
export const mockDataService = {
  // Leads
  getLeads: (filters) => mockResponse(generateMockLeads(filters)),
  getLead: (id) => mockResponse(findMockLeadById(id)),
  createLead: (leadData) => mockResponse(createMockLead(leadData)),
  updateLead: (id, leadData) => mockResponse(updateMockLead(id, leadData)),
  deleteLead: (id) => mockResponse(deleteMockLead(id)),
  
  // Lead additional functions
  addLeadNote: (leadId, noteContent) => mockResponse(addMockLeadNote(leadId, noteContent)),
  addLeadTask: (leadId, taskData) => mockResponse(addMockLeadTask(leadId, taskData)),
  updateLeadTask: (leadId, taskId, taskData) => mockResponse(updateMockLeadTask(leadId, taskId, taskData)),
  
  // Tasks
  getTasks: (filters) => mockResponse(generateMockTasks(filters)),
  getTask: (id) => mockResponse(generateMockTasks().find(task => task._id === id)),
  
  // Contacts
  getContacts: (filters) => mockResponse(generateMockContacts(filters)),
  getContact: (id) => mockResponse(generateMockContacts().find(contact => contact._id === id)),
  
  // Companies
  getCompanies: (filters) => mockResponse(generateMockCompanies(filters)),
  getCompany: (id) => mockResponse(generateMockCompanies().find(company => company._id === id)),
  
  // Add more mock API functions as needed
};

export default mockDataService;