// src/services/mockData/companies.js
import { faker } from '@faker-js/faker';

// Generate a random company
const generateMockCompany = (id) => {
  const name = faker.company.name();
  const createdDate = faker.date.past({ years: 1 });
  
  return {
    _id: id || `mock_company_${faker.string.uuid()}`,
    name,
    description: faker.company.catchPhrase(),
    industry: faker.helpers.arrayElement([
      'Technology', 'Healthcare', 'Finance', 'Manufacturing', 
      'Retail', 'Education', 'Transportation', 'Entertainment',
      'Construction', 'Energy', 'Agriculture', 'Hospitality'
    ]),
    website: faker.internet.url(),
    email: faker.internet.email({ firstName: name.split(' ')[0], lastName: 'info' }),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    employeeCount: faker.number.int({ min: 1, max: 10000 }),
    revenue: Math.random() > 0.3 ? `$${faker.number.int({ min: 100000, max: 100000000 }).toLocaleString()}` : null,
    founded: faker.date.past({ years: 30 }).getFullYear(),
    notes: faker.lorem.paragraph(),
    tags: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => 
      faker.helpers.arrayElement(['client', 'prospect', 'supplier', 'partner', 'competitor', 'other'])
    ),
    status: faker.helpers.arrayElement(['active', 'inactive', 'lead', 'opportunity', 'customer']),
    createdAt: createdDate,
    updatedAt: faker.date.between({ from: createdDate, to: new Date() }),
    lastContact: Math.random() > 0.3 ? faker.date.recent({ days: 30 }) : null,
  };
};

// Generate mock companies dataset
export const generateMockCompanies = (filters = {}, count = 25) => {
  // Generate base data if not already cached
  if (!window._mockCompaniesCache) {
    window._mockCompaniesCache = Array.from({ length: count }, () => generateMockCompany());
  }

  // Apply filters if provided
  let filteredCompanies = [...window._mockCompaniesCache];
  
  if (filters) {
    // Filter by industry
    if (filters.industry && filters.industry !== 'all') {
      filteredCompanies = filteredCompanies.filter(company => 
        company.industry === filters.industry
      );
    }
    
    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filteredCompanies = filteredCompanies.filter(company => 
        company.status === filters.status
      );
    }
    
    // Filter by tag
    if (filters.tag && filters.tag !== 'all') {
      filteredCompanies = filteredCompanies.filter(company => 
        company.tags.includes(filters.tag)
      );
    }
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCompanies = filteredCompanies.filter(company => 
        company.name.toLowerCase().includes(searchLower) ||
        (company.description && company.description.toLowerCase().includes(searchLower)) ||
        company.industry.toLowerCase().includes(searchLower) ||
        (company.website && company.website.toLowerCase().includes(searchLower)) ||
        (company.email && company.email.toLowerCase().includes(searchLower))
      );
    }
  }
  
  return filteredCompanies;
};

export default {
  generateMockCompanies,
  generateMockCompany
};