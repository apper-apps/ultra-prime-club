import leadsData from "@/services/mockData/leads.json";

let leads = [...leadsData];

// Utility function to remove duplicate website URLs, keeping the most recent entry
const deduplicateLeads = (leadsArray) => {
  const urlMap = new Map();
  const duplicates = [];
  
  // Sort by creation date (most recent first) to keep the latest entry
  const sortedLeads = [...leadsArray].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  sortedLeads.forEach(lead => {
    const normalizedUrl = lead.websiteUrl.toLowerCase().replace(/\/$/, ''); // Remove trailing slash and normalize
    if (urlMap.has(normalizedUrl)) {
      duplicates.push(lead);
    } else {
      urlMap.set(normalizedUrl, lead);
    }
  });
  
  return {
    uniqueLeads: Array.from(urlMap.values()),
    duplicatesRemoved: duplicates,
    duplicateCount: duplicates.length
  };
};

export const getLeads = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Automatically deduplicate leads
  const deduplicationResult = deduplicateLeads(leads);
  
  // Update the leads array if duplicates were found
  if (deduplicationResult.duplicateCount > 0) {
    leads = deduplicationResult.uniqueLeads;
  }
  
  return {
    leads: [...leads],
    deduplicationResult: deduplicationResult.duplicateCount > 0 ? deduplicationResult : null
  };
};

export const getLeadById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const lead = leads.find(l => l.Id === id);
  if (!lead) {
    throw new Error("Lead not found");
  }
  
  return { ...lead };
};

export const createLead = async (leadData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check for duplicate website URL before creating
  const normalizedUrl = leadData.websiteUrl.toLowerCase().replace(/\/$/, '');
  const existingLead = leads.find(lead => 
    lead.websiteUrl.toLowerCase().replace(/\/$/, '') === normalizedUrl
  );
  
  if (existingLead) {
    throw new Error(`A lead with website URL "${leadData.websiteUrl}" already exists`);
  }
  
  const maxId = Math.max(...leads.map(l => l.Id));
  const newLead = {
    ...leadData,
    Id: maxId + 1,
    createdAt: new Date().toISOString()
  };
  
  leads.push(newLead);
  return { ...newLead };
};

export const updateLead = async (id, updates) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = leads.findIndex(l => l.Id === id);
  if (index === -1) {
    throw new Error("Lead not found");
  }
  
  leads[index] = { ...leads[index], ...updates };
  return { ...leads[index] };
};

export const deleteLead = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = leads.findIndex(l => l.Id === id);
  if (index === -1) {
    throw new Error("Lead not found");
  }
  
  leads.splice(index, 1);
  return { success: true };
};