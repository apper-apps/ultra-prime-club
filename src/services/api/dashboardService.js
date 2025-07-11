import dashboardData from "@/services/mockData/dashboard.json";
import { getDailyLeadsReport as getLeadsReport } from "@/services/api/leadsService";
import { getLeadsAnalytics, getDailyLeadsChart, getUserPerformance } from "@/services/api/analyticsService";
import { getWebsiteUrlActivity } from "@/services/api/reportService";
import salesRepsData from "@/services/mockData/salesReps.json";
export const getDashboardMetrics = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [...dashboardData.metrics];
};

export const getRecentActivity = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [...dashboardData.recentActivity];
};

export const getDailyLeadsReport = async () => {
  // Simulate API delay
await new Promise(resolve => setTimeout(resolve, 300));
  
  return await getLeadsReport();
};

export const getTodaysMeetings = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
return [...dashboardData.todaysMeetings];
};

export const getPendingFollowUps = async () => {
  const { getPendingFollowUps: getFollowUps } = await import("@/services/api/leadsService");
  return await getFollowUps();
};

export const getLeadPerformanceChart = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const chartData = await getDailyLeadsChart('all', 14);
    return chartData;
  } catch (error) {
    // Fallback data if analytics service fails
    return {
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      series: [{ name: 'Leads', data: [12, 19, 15, 27, 22, 31, 28] }]
    };
  }
};

export const getSalesFunnelAnalysis = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const analyticsData = await getLeadsAnalytics('all', 'all');
    const totalLeads = analyticsData.leads.length;
    
    const statusCounts = analyticsData.leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    
    const funnelStages = [
      { name: 'Leads', count: totalLeads, color: '#8B5CF6' },
      { name: 'Connected', count: statusCounts['Connected'] || 0, color: '#10B981' },
      { name: 'Meetings', count: statusCounts['Meeting Booked'] || 0, color: '#F59E0B' },
      { name: 'Closed', count: statusCounts['Meeting Done'] || 0, color: '#EF4444' }
    ];
    
    return {
      categories: funnelStages.map(stage => stage.name),
      series: [{
        name: 'Conversion Rate',
        data: funnelStages.map(stage => 
          totalLeads > 0 ? Math.round((stage.count / totalLeads) * 100) : 0
        )
      }]
    };
  } catch (error) {
    // Fallback data
    return {
      categories: ['Leads', 'Connected', 'Meetings', 'Closed'],
      series: [{ name: 'Conversion Rate', data: [100, 25, 12, 8] }]
    };
  }
};

export const getTeamPerformanceRankings = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const performanceData = await getUserPerformance();
    return performanceData.sort((a, b) => b.totalLeads - a.totalLeads);
  } catch (error) {
    // Fallback data
    return salesRepsData.map(rep => ({
      Id: rep.Id,
      name: rep.name,
      totalLeads: Math.floor(Math.random() * 100) + 10,
      weekLeads: Math.floor(Math.random() * 20) + 1,
      todayLeads: Math.floor(Math.random() * 5)
    }));
  }
};

export const getRevenueTrendsData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const urlActivity = await getWebsiteUrlActivity();
    const leads = urlActivity.data;
    
    // Group leads by month and calculate cumulative ARR
    const monthlyData = leads.reduce((acc, lead) => {
      const month = new Date(lead.createdAt).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { count: 0, arr: 0 };
      }
      acc[month].count += 1;
      acc[month].arr += lead.arr;
      return acc;
    }, {});
    
    const sortedMonths = Object.keys(monthlyData).sort();
    const last6Months = sortedMonths.slice(-6);
    
    let cumulativeARR = 0;
    const trendData = last6Months.map(month => {
      cumulativeARR += monthlyData[month].arr;
      return cumulativeARR;
    });
    
    return {
      categories: last6Months.map(month => new Date(month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })),
      series: [{ name: 'Cumulative ARR', data: trendData }]
    };
  } catch (error) {
    // Fallback data
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      series: [{ name: 'Cumulative ARR', data: [2500000, 3200000, 3800000, 4500000, 5100000, 5800000] }]
    };
  }
};

export const getDetailedRecentActivity = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const urlActivity = await getWebsiteUrlActivity();
    const recentLeads = urlActivity.data.slice(0, 10);
    
    const detailedActivity = recentLeads.map((lead, index) => ({
      id: lead.Id,
      title: `New lead added: ${lead.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}`,
      type: "contact",
      time: new Date(lead.createdAt).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      date: new Date(lead.createdAt).toLocaleDateString()
    }));
    
    // Add dashboard activity
    const dashboardActivity = [...dashboardData.recentActivity];
    
    return [...detailedActivity, ...dashboardActivity]
      .sort((a, b) => new Date(b.date || Date.now()) - new Date(a.date || Date.now()))
      .slice(0, 15);
  } catch (error) {
    // Fallback to dashboard data
    return [...dashboardData.recentActivity];
  }
};