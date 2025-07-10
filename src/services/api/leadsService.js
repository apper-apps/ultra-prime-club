import leadsData from "@/services/mockData/leads.json";
import salesRepData from "@/services/mockData/salesReps.json";

let leads = [...leadsData];
let salesReps = [...salesRepData];

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
  
  // Enhance leads with sales rep names
  const leadsWithRepNames = leads.map(lead => {
    const salesRep = salesReps.find(rep => rep.Id === lead.addedBy);
    return {
      ...lead,
      addedByName: salesRep ? salesRep.name : 'Unknown'
    };
  });
  
  return {
    leads: leadsWithRepNames,
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
  
  // Validate required fields
  if (!leadData.websiteUrl || !leadData.websiteUrl.trim()) {
    throw new Error("Website URL is required");
  }
  
  // Check for duplicate website URL before creating
  const normalizedUrl = leadData.websiteUrl.toLowerCase().replace(/\/$/, '');
  const existingLead = leads.find(lead => 
    lead.websiteUrl.toLowerCase().replace(/\/$/, '') === normalizedUrl
  );
  
  if (existingLead) {
    throw new Error(`A lead with website URL "${leadData.websiteUrl}" already exists`);
  }
  
const maxId = Math.max(...leads.map(l => l.Id), 0);
  const newLead = {
    websiteUrl: leadData.websiteUrl,
    teamSize: leadData.teamSize || "1-10",
    arr: leadData.arr || 0,
    category: leadData.category || "Other",
    linkedinUrl: leadData.linkedinUrl || "",
    status: leadData.status || "Keep an Eye",
    fundingType: leadData.fundingType || "Bootstrapped",
    edition: leadData.edition || "Select Edition",
    followUpDate: leadData.followUpDate || null,
    addedBy: leadData.addedBy || 1, // Default to first sales rep for demo
    Id: maxId + 1,
    createdAt: new Date().toISOString()
  };
  
  leads.push(newLead);
  
  // Return lead with sales rep name
  const salesRep = salesReps.find(rep => rep.Id === newLead.addedBy);
  return { 
    ...newLead,
    addedByName: salesRep ? salesRep.name : 'Unknown'
  };
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

export const getDailyLeadsReport = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Filter leads created today
  const todaysLeads = leads.filter(lead => {
    const leadDate = lead.createdAt.split('T')[0];
    return leadDate === today;
  });
  
  // Group by sales rep
  const reportData = {};
  
  // Initialize all sales reps with empty data
  salesReps.forEach(rep => {
    reportData[rep.name] = {
      salesRep: rep.name,
      salesRepId: rep.Id,
      leads: [],
      leadCount: 0,
      lowPerformance: false
    };
  });
  
  // Add today's leads to the respective sales reps
  todaysLeads.forEach(lead => {
    const salesRep = salesReps.find(rep => rep.Id === lead.addedBy);
    const repName = salesRep ? salesRep.name : 'Unknown';
    
    if (reportData[repName]) {
      reportData[repName].leads.push(lead);
    }
  });
  
  // Calculate lead counts and identify low performers
  Object.values(reportData).forEach(repData => {
    repData.leadCount = repData.leads.length;
    repData.lowPerformance = repData.leadCount < 5;
  });
  
  // Convert to array and sort by lead count (descending)
return Object.values(reportData).sort((a, b) => b.leads.length - a.leads.length);
};

export const getPendingFollowUps = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get current date and 7 days from now
  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);
  
  // Filter leads with follow-up dates within the next 7 days
  const pendingFollowUps = leads.filter(lead => {
    if (!lead.followUpDate) return false;
    
    const followUpDate = new Date(lead.followUpDate);
    return followUpDate >= now && followUpDate <= sevenDaysFromNow;
  });
  
  // Sort by follow-up date (earliest first)
  return pendingFollowUps.sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));
};