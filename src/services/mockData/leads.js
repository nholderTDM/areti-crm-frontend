// src/services/mockData/leads.js
import { faker } from '@faker-js/faker';

// Lead statuses and sources (same as in your components)
const leadStatuses = [
  { value: 'new', label: 'New', color: 'primary' },
  { value: 'contacted', label: 'Contacted', color: 'info' },
  { value: 'qualified', label: 'Qualified', color: 'warning' },
  { value: 'proposal', label: 'Proposal', color: 'secondary' },
  { value: 'negotiation', label: 'Negotiation', color: 'dark' },
  { value: 'closed-won', label: 'Closed (Won)', color: 'success' },
  { value: 'closed-lost', label: 'Closed (Lost)', color: 'danger' }
];

const leadSources = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'email-campaign', label: 'Email Campaign' },
  { value: 'cold-call', label: 'Cold Call' },
  { value: 'lead-generator', label: 'Lead Generator' },
  { value: 'event', label: 'Event/Trade Show' },
  { value: 'other', label: 'Other' }
];

// Generate a random lead
const generateMockLead = (id) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const company = faker.company.name();
  const createdDate = faker.date.past({ years: 1 });
  const updatedDate = faker.date.between({ from: createdDate, to: new Date() });
  const lastContactDate = faker.date.between({ from: createdDate, to: new Date() });
  const nextFollowUp = Math.random() > 0.3 ? faker.date.future({ years: 0.5 }) : null;
  
  return {
    _id: id || `mock_lead_${faker.string.uuid()}`,
    firstName,
    lastName,
    company,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    address: faker.location.streetAddress({ useFullAddress: true }),
    status: faker.helpers.arrayElement(leadStatuses).value,
    source: faker.helpers.arrayElement(leadSources).value,
    value: faker.number.int({ min: 1000, max: 100000 }),
    notes: faker.lorem.paragraph(),
    createdAt: createdDate,
    updatedAt: updatedDate,
    lastContact: lastContactDate,
    nextFollowUp,
    // Generate history items
    history: Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, () => ({
      _id: `hist_${faker.string.uuid()}`,
      type: faker.helpers.arrayElement(['note', 'status_change', 'call', 'email', 'task']),
      content: faker.lorem.paragraph(),
      timestamp: faker.date.between({ from: createdDate, to: new Date() }),
      userName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      user: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      }
    })),
    // Generate tasks
    tasks: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => {
      const isCompleted = faker.datatype.boolean();
      const taskCreatedDate = faker.date.between({ from: createdDate, to: new Date() });
      const completedDate = isCompleted ? faker.date.between({ from: taskCreatedDate, to: new Date() }) : null;
      
      return {
        _id: `task_${faker.string.uuid()}`,
        title: faker.lorem.sentence(),
        dueDate: faker.date.future({ years: 0.3, refDate: taskCreatedDate }),
        completed: isCompleted,
        completedAt: completedDate,
        createdAt: taskCreatedDate
      };
    }),
    // Generate documents
    documents: Math.random() > 0.7 ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      _id: `doc_${faker.string.uuid()}`,
      name: `${faker.system.fileName()}.${faker.helpers.arrayElement(['pdf', 'docx', 'xlsx'])}`,
      fileURL: '#',
      size: `${faker.number.int({ min: 10, max: 5000 })} KB`,
      uploadedAt: faker.date.between({ from: createdDate, to: new Date() })
    })) : []
  };
};

// Generate mock leads dataset
export const generateMockLeads = (filters = {}, count = 50) => {
  // Generate base data if not already cached
  if (!window._mockLeadsCache) {
    window._mockLeadsCache = Array.from({ length: count }, () => generateMockLead());
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

// Helper to find a lead by ID
export const findMockLeadById = (id) => {
  // Generate the cache if it doesn't exist
  if (!window._mockLeadsCache) {
    generateMockLeads();
  }
  
  return window._mockLeadsCache.find(lead => lead._id === id);
};

// Add a note to a lead
export const addMockLeadNote = (leadId, noteContent) => {
  const lead = findMockLeadById(leadId);
  if (!lead) return null;
  
  // Create new note
  const newNote = {
    _id: `note_${faker.string.uuid()}`,
    type: 'note',
    content: noteContent,
    timestamp: new Date(),
    userName: 'You',
    user: {
      firstName: 'Current',
      lastName: 'User'
    }
  };
  
  // Add to history
  lead.history = [newNote, ...lead.history];
  lead.updatedAt = new Date();
  
  return lead;
};

// Add a task to a lead
export const addMockLeadTask = (leadId, taskData) => {
  const lead = findMockLeadById(leadId);
  if (!lead) return null;
  
  // Create new task
  const newTask = {
    _id: `task_${faker.string.uuid()}`,
    ...taskData,
    createdAt: new Date()
  };
  
  // Add to tasks
  lead.tasks = [newTask, ...lead.tasks];
  lead.updatedAt = new Date();
  
  return lead;
};

// Update a lead task
export const updateMockLeadTask = (leadId, taskId, taskData) => {
  const lead = findMockLeadById(leadId);
  if (!lead) return null;
  
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

// Delete a lead
export const deleteMockLead = (leadId) => {
  if (!window._mockLeadsCache) return;
  
  window._mockLeadsCache = window._mockLeadsCache.filter(lead => lead._id !== leadId);
  return { success: true };
};

// Create a new lead
export const createMockLead = (leadData) => {
  if (!window._mockLeadsCache) {
    generateMockLeads();
  }
  
  const newLead = {
    ...generateMockLead(`mock_lead_${faker.string.uuid()}`),
    ...leadData,
    createdAt: new Date(),
    updatedAt: new Date(),
    history: [],
    tasks: [],
    documents: []
  };
  
  window._mockLeadsCache.unshift(newLead);
  
  return newLead;
};

// Update a lead
export const updateMockLead = (leadId, leadData) => {
  const lead = findMockLeadById(leadId);
  if (!lead) return null;
  
  Object.assign(lead, leadData, { updatedAt: new Date() });
  
  return lead;
};

export default {
  generateMockLeads,
  findMockLeadById,
  addMockLeadNote,
  addMockLeadTask,
  updateMockLeadTask,
  deleteMockLead,
  createMockLead,
  updateMockLead
};