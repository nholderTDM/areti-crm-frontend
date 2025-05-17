// src/services/mockData/contacts.js
import { faker } from '@faker-js/faker';

// Generate a random contact
const generateMockContact = (id) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const company = faker.company.name();
  const createdDate = faker.date.past({ years: 1 });
  
  return {
    _id: id || `mock_contact_${faker.string.uuid()}`,
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    company,
    jobTitle: faker.person.jobTitle(),
    address: faker.location.streetAddress({ useFullAddress: true }),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    notes: faker.lorem.paragraph(),
    tags: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => 
      faker.helpers.arrayElement(['client', 'prospect', 'supplier', 'partner', 'influencer', 'investor', 'other'])
    ),
    source: faker.helpers.arrayElement(['referral', 'website', 'event', 'social', 'email', 'other']),
    createdAt: createdDate,
    updatedAt: faker.date.between({ from: createdDate, to: new Date() }),
    lastContact: Math.random() > 0.3 ? faker.date.recent({ days: 30 }) : null,
  };
};

// Generate mock contacts dataset
export const generateMockContacts = (filters = {}, count = 40) => {
  // Generate base data if not already cached
  if (!window._mockContactsCache) {
    window._mockContactsCache = Array.from({ length: count }, () => generateMockContact());
  }

  // Apply filters if provided
  let filteredContacts = [...window._mockContactsCache];
  
  if (filters) {
    // Filter by tag
    if (filters.tag && filters.tag !== 'all') {
      filteredContacts = filteredContacts.filter(contact => 
        contact.tags.includes(filters.tag)
      );
    }
    
    // Filter by source
    if (filters.source && filters.source !== 'all') {
      filteredContacts = filteredContacts.filter(contact => 
        contact.source === filters.source
      );
    }
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredContacts = filteredContacts.filter(contact => 
        contact.firstName.toLowerCase().includes(searchLower) ||
        contact.lastName.toLowerCase().includes(searchLower) ||
        contact.company.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        (contact.phone && contact.phone.includes(filters.search)) ||
        (contact.jobTitle && contact.jobTitle.toLowerCase().includes(searchLower))
      );
    }
  }
  
  return filteredContacts;
};

export default {
  generateMockContacts,
  generateMockContact
};