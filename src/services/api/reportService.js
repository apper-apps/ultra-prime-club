import leadsData from "@/services/mockData/leads.json";
import salesRepsData from "@/services/mockData/salesReps.json";

// Get website URL activity with filtering options
export const getWebsiteUrlActivity = async (filters = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredData = [...leadsData];
  
  // Filter by date range
  if (filters.startDate || filters.endDate) {
    filteredData = filteredData.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      const start = filters.startDate ? new Date(filters.startDate) : new Date('1900-01-01');
      const end = filters.endDate ? new Date(filters.endDate) : new Date('2100-12-31');
      
      // Set time to compare only dates
      leadDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      return leadDate >= start && leadDate <= end;
    });
  }
  
  // Filter by specific date (for today, yesterday, etc.)
  if (filters.date) {
    const targetDate = new Date(filters.date);
    filteredData = filteredData.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate.toDateString() === targetDate.toDateString();
    });
  }
  
  // Filter by user/sales rep
  if (filters.addedBy) {
    filteredData = filteredData.filter(lead => lead.addedBy === filters.addedBy);
  }
  
  // Filter by search term
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredData = filteredData.filter(lead => 
      lead.websiteUrl.toLowerCase().includes(term) ||
      lead.category.toLowerCase().includes(term) ||
      lead.addedByName.toLowerCase().includes(term)
    );
  }
  
  return {
    data: filteredData,
    summary: {
      totalUrls: filteredData.length,
      totalArr: filteredData.reduce((sum, lead) => sum + lead.arr, 0),
      byStatus: getStatusSummary(filteredData),
      byCategory: getCategorySummary(filteredData)
    }
  };
};

// Get activity for a specific date
export const getActivityByDate = async (date) => {
  return await getWebsiteUrlActivity({ date });
};

// Get activity for a specific user
export const getActivityByUser = async (userId) => {
  return await getWebsiteUrlActivity({ addedBy: userId });
};

// Get quick date filters (today, yesterday, this week, etc.)
export const getQuickDateFilters = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    today: today.toISOString().split('T')[0],
    yesterday: yesterday.toISOString().split('T')[0],
    thisWeekStart: thisWeekStart.toISOString().split('T')[0],
    thisWeekEnd: today.toISOString().split('T')[0],
    lastWeekStart: lastWeekStart.toISOString().split('T')[0],
    lastWeekEnd: lastWeekEnd.toISOString().split('T')[0],
    thisMonthStart: thisMonthStart.toISOString().split('T')[0],
    thisMonthEnd: today.toISOString().split('T')[0]
  };
};

// Get all sales reps for filtering
export const getSalesRepsForFilter = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [...salesRepsData];
};

// Helper functions
const getStatusSummary = (data) => {
  const summary = {};
  data.forEach(lead => {
    summary[lead.status] = (summary[lead.status] || 0) + 1;
  });
  return summary;
};

const getCategorySummary = (data) => {
  const summary = {};
  data.forEach(lead => {
    summary[lead.category] = (summary[lead.category] || 0) + 1;
  });
  return summary;
};

// Export lead data for external use (CSV, etc.)
export const exportWebsiteUrlData = async (filters = {}) => {
  const result = await getWebsiteUrlActivity(filters);
  
  return result.data.map(lead => ({
    'Website URL': lead.websiteUrl,
    'Category': lead.category,
    'Team Size': lead.teamSize,
    'ARR': `$${(lead.arr / 1000000).toFixed(1)}M`,
    'Status': lead.status,
    'Funding Type': lead.fundingType,
    'Added By': lead.addedByName,
    'Date Added': new Date(lead.createdAt).toLocaleDateString()
  }));
};