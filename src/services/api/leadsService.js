import leadsData from "@/services/mockData/leads.json";

let leads = [...leadsData];

export const getLeads = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [...leads];
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