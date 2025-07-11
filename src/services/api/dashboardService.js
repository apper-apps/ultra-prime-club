// Dashboard Service - Centralized data management for dashboard components
import salesRepsData from "@/services/mockData/salesReps.json";
import dashboardData from "@/services/mockData/dashboard.json";

// Standardized API delay for consistent UX
const API_DELAY = 300;

// Helper function to simulate API calls with consistent delay
const simulateAPICall = (delay = API_DELAY) => 
  new Promise(resolve => setTimeout(resolve, delay));

// Helper function to safely access external services
const safeServiceCall = async (serviceCall, fallback = null) => {
  try {
    return await serviceCall();
  } catch (error) {
    console.warn('Service call failed, using fallback:', error.message);
    return fallback;
  }
};

// Helper function to get current date with consistent timezone handling
const getCurrentDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Helper function to calculate date ranges
const getDateRange = (period) => {
  const today = getCurrentDate();
  
  switch (period) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    case 'yesterday':
      return {
        start: new Date(today.getTime() - 24 * 60 * 60 * 1000),
        end: today
      };
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      return {
        start: weekStart,
        end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      };
    case 'month':
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 1)
      };
    default:
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
  }
};

// Helper function to validate and sanitize user input
const validateUserId = (userId) => {
  if (typeof userId === 'string') {
    const parsed = parseInt(userId, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return typeof userId === 'number' ? userId : null;
};

// Core dashboard metrics from static data
export const getDashboardMetrics = async () => {
  await simulateAPICall();
  
  if (!dashboardData?.metrics || !Array.isArray(dashboardData.metrics)) {
    throw new Error('Invalid dashboard metrics data structure');
  }
  
  return dashboardData.metrics.map(metric => ({
    ...metric,
    id: metric.id || Math.random(),
    value: metric.value || '0',
    trend: metric.trend || 'neutral',
    trendValue: metric.trendValue || '0%'
  }));
};

// Recent activity from static data
export const getRecentActivity = async () => {
  await simulateAPICall();
  
  if (!dashboardData?.recentActivity || !Array.isArray(dashboardData.recentActivity)) {
    throw new Error('Invalid recent activity data structure');
  }
  
  return dashboardData.recentActivity.map(activity => ({
    ...activity,
    id: activity.id || Math.random(),
    time: activity.time || 'Unknown time',
    type: activity.type || 'general'
  }));
};

// Today's meetings from static data
export const getTodaysMeetings = async () => {
  await simulateAPICall();
  
  if (!dashboardData?.todaysMeetings || !Array.isArray(dashboardData.todaysMeetings)) {
    return [];
  }
  
  return dashboardData.todaysMeetings.map(meeting => ({
    ...meeting,
    id: meeting.id || Math.random(),
    title: meeting.title || 'Untitled Meeting',
    time: meeting.time || 'TBD',
    client: meeting.client || meeting.title || 'Unknown Client'
  }));
};

// Pending follow-ups from leads service
export const getPendingFollowUps = async () => {
  await simulateAPICall();
  
  const fallback = [];
  return safeServiceCall(async () => {
    const { getPendingFollowUps } = await import("@/services/api/leadsService");
    const followUps = await getPendingFollowUps();
    
    if (!Array.isArray(followUps)) {
      return fallback;
    }
    
    return followUps.map(followUp => ({
      ...followUp,
      Id: followUp.Id || Math.random(),
      websiteUrl: followUp.websiteUrl || 'Unknown URL',
      category: followUp.category || 'General',
      followUpDate: followUp.followUpDate || new Date().toISOString()
    }));
  }, fallback);
};

// Lead performance chart data
export const getLeadPerformanceChart = async () => {
  await simulateAPICall();
  
  const fallback = {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [{ name: 'Leads', data: [12, 19, 15, 27, 22, 31, 28] }]
  };
  
  return safeServiceCall(async () => {
    const { getDailyLeadsChart } = await import("@/services/api/analyticsService");
    const chartData = await getDailyLeadsChart('all', 14);
    
    if (!chartData || !chartData.categories || !chartData.series) {
      return fallback;
    }
    
    return {
      categories: chartData.categories,
      series: chartData.series.map(series => ({
        name: series.name || 'Leads',
        data: Array.isArray(series.data) ? series.data : []
      }))
    };
  }, fallback);
};

// Sales funnel analysis
export const getSalesFunnelAnalysis = async () => {
  await simulateAPICall();
  
  const fallback = {
    categories: ['Leads', 'Connected', 'Meetings', 'Closed'],
    series: [{ name: 'Conversion Rate', data: [100, 25, 12, 8] }]
  };
  
  return safeServiceCall(async () => {
    const { getLeadsAnalytics } = await import("@/services/api/analyticsService");
    const analyticsData = await getLeadsAnalytics('all', 'all');
    
    if (!analyticsData?.leads || !Array.isArray(analyticsData.leads)) {
      return fallback;
    }
    
    const totalLeads = analyticsData.leads.length;
    if (totalLeads === 0) {
      return fallback;
    }
    
    const statusCounts = analyticsData.leads.reduce((acc, lead) => {
      const status = lead.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    const funnelStages = [
      { name: 'Leads', count: totalLeads },
      { name: 'Connected', count: statusCounts['Connected'] || 0 },
      { name: 'Meetings', count: statusCounts['Meeting Booked'] || 0 },
      { name: 'Closed', count: statusCounts['Meeting Done'] || 0 }
    ];
    
    return {
      categories: funnelStages.map(stage => stage.name),
      series: [{
        name: 'Conversion Rate',
        data: funnelStages.map(stage => 
          Math.round((stage.count / totalLeads) * 100)
        )
      }]
    };
  }, fallback);
};

// Team performance rankings
export const getTeamPerformanceRankings = async () => {
  await simulateAPICall();
  
  const fallback = salesRepsData.map(rep => ({
    Id: rep.Id,
    name: rep.name,
    totalLeads: Math.floor(Math.random() * 100) + 10,
    weekLeads: Math.floor(Math.random() * 20) + 1,
    todayLeads: Math.floor(Math.random() * 5)
  }));
  
  return safeServiceCall(async () => {
    const { getUserPerformance } = await import("@/services/api/analyticsService");
    const performanceData = await getUserPerformance();
    
    if (!Array.isArray(performanceData)) {
      return fallback;
    }
    
    return performanceData
      .map(rep => ({
        Id: rep.Id || Math.random(),
        name: rep.name || 'Unknown Rep',
        totalLeads: rep.totalLeads || 0,
        weekLeads: rep.weekLeads || 0,
        todayLeads: rep.todayLeads || 0
      }))
      .sort((a, b) => b.totalLeads - a.totalLeads);
  }, fallback);
};

// Revenue trends data
export const getRevenueTrendsData = async () => {
  await simulateAPICall();
  
  const fallback = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [{ name: 'Cumulative ARR', data: [2500000, 3200000, 3800000, 4500000, 5100000, 5800000] }]
  };
  
  return safeServiceCall(async () => {
    const { getWebsiteUrlActivity } = await import("@/services/api/reportService");
    const urlActivity = await getWebsiteUrlActivity();
    
    if (!urlActivity?.data || !Array.isArray(urlActivity.data)) {
      return fallback;
    }
    
    const leads = urlActivity.data;
    
    // Group leads by month and calculate cumulative ARR
    const monthlyData = leads.reduce((acc, lead) => {
      if (!lead.createdAt) return acc;
      
      const month = new Date(lead.createdAt).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { count: 0, arr: 0 };
      }
      acc[month].count += 1;
      acc[month].arr += lead.arr || 0;
      return acc;
    }, {});
    
    const sortedMonths = Object.keys(monthlyData).sort();
    const last6Months = sortedMonths.slice(-6);
    
    if (last6Months.length === 0) {
      return fallback;
    }
    
    let cumulativeARR = 0;
    const trendData = last6Months.map(month => {
      cumulativeARR += monthlyData[month].arr;
      return cumulativeARR;
    });
    
    return {
      categories: last6Months.map(month => {
        const date = new Date(month);
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }),
      series: [{ name: 'Cumulative ARR', data: trendData }]
    };
  }, fallback);
};

// Detailed recent activity
export const getDetailedRecentActivity = async () => {
  await simulateAPICall();
  
  const fallback = dashboardData.recentActivity || [];
  
  return safeServiceCall(async () => {
    const { getWebsiteUrlActivity } = await import("@/services/api/reportService");
    const urlActivity = await getWebsiteUrlActivity();
    
    if (!urlActivity?.data || !Array.isArray(urlActivity.data)) {
      return fallback;
    }
    
    const recentLeads = urlActivity.data.slice(0, 10);
    
    const detailedActivity = recentLeads.map(lead => ({
      id: lead.Id || Math.random(),
      title: `New lead added: ${(lead.websiteUrl || 'Unknown URL').replace(/^https?:\/\//, '').replace(/\/$/, '')}`,
      type: "contact",
      time: lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) : 'Unknown time',
      date: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
    }));
    
    // Combine with dashboard activity
    const combinedActivity = [...detailedActivity, ...fallback];
    
    return combinedActivity
      .sort((a, b) => {
        const dateA = new Date(a.date || Date.now());
        const dateB = new Date(b.date || Date.now());
        return dateB - dateA;
      })
      .slice(0, 15);
  }, fallback);
};

// User leads report with period filtering
export const getUserLeadsReport = async (userId, period = 'today') => {
  await simulateAPICall();
  
  const validUserId = validateUserId(userId);
  if (!validUserId) {
    console.warn('Invalid user ID provided:', userId);
    return [];
  }
  
  const fallback = [];
  
  return safeServiceCall(async () => {
    const { getLeads } = await import("@/services/api/leadsService");
    const leadsData = await getLeads();
    
    if (!leadsData?.leads || !Array.isArray(leadsData.leads)) {
      return fallback;
    }
    
    const allLeads = leadsData.leads;
    
    // Filter leads by user
    const userLeads = allLeads.filter(lead => 
      lead.addedBy === validUserId
    );
    
    // Get date range for filtering
    const { start: startDate, end: endDate } = getDateRange(period);
    
    // Filter leads by date range
    const filteredLeads = userLeads.filter(lead => {
      if (!lead.createdAt) return false;
      
      const leadDate = new Date(lead.createdAt);
      return leadDate >= startDate && leadDate < endDate;
    });
    
    // Sort by creation date (most recent first) and ensure data integrity
    return filteredLeads
      .map(lead => ({
        ...lead,
        Id: lead.Id || Math.random(),
        websiteUrl: lead.websiteUrl || 'Unknown URL',
        category: lead.category || 'General',
        createdAt: lead.createdAt || new Date().toISOString()
      }))
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, fallback);
};

// Lead quota alerts - Check if sales reps meet minimum daily lead requirements
export const getLeadQuotaAlerts = async () => {
  await simulateAPICall();
  
  const MINIMUM_DAILY_LEADS = 10;
  const fallback = [];
  
  // Helper function to check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };
  
  // Helper function to get today's date string for comparison
  const getTodayDateString = () => {
    const today = getCurrentDate();
    return today.toISOString().split('T')[0];
  };
  
  // Skip alerts on weekends
  const today = getCurrentDate();
  if (isWeekend(today)) {
    return fallback;
  }
  
  return safeServiceCall(async () => {
    const { getLeads } = await import("@/services/api/leadsService");
    const leadsData = await getLeads();
    
    if (!leadsData?.leads || !Array.isArray(leadsData.leads)) {
      return fallback;
    }
    
    const allLeads = leadsData.leads;
    const todayDateString = getTodayDateString();
    
    // Get today's leads grouped by sales rep
    const todayLeadsByRep = allLeads.reduce((acc, lead) => {
      if (!lead.createdAt || !lead.addedBy) return acc;
      
      const leadDate = new Date(lead.createdAt).toISOString().split('T')[0];
      if (leadDate === todayDateString) {
        const repId = lead.addedBy;
        if (!acc[repId]) {
          acc[repId] = {
            repId,
            repName: lead.addedByName || 'Unknown Rep',
            leads: []
          };
        }
        acc[repId].leads.push(lead);
      }
      return acc;
    }, {});
    
    // Get all unique sales reps from leads data
    const allReps = allLeads.reduce((acc, lead) => {
      if (lead.addedBy && lead.addedByName) {
        acc[lead.addedBy] = {
          repId: lead.addedBy,
          repName: lead.addedByName
        };
      }
      return acc;
    }, {});
    
    // Check each rep against quota and create alerts for underperformers
    const quotaAlerts = [];
    
    Object.values(allReps).forEach(rep => {
      const repLeadsToday = todayLeadsByRep[rep.repId];
      const currentLeads = repLeadsToday ? repLeadsToday.leads.length : 0;
      
      if (currentLeads < MINIMUM_DAILY_LEADS) {
        quotaAlerts.push({
          repId: rep.repId,
          repName: rep.repName,
          currentLeads,
          requiredLeads: MINIMUM_DAILY_LEADS,
          deficit: MINIMUM_DAILY_LEADS - currentLeads,
          date: today.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
    });
    
    // Sort alerts by deficit (highest deficit first)
    return quotaAlerts.sort((a, b) => b.deficit - a.deficit);
  }, fallback);
};