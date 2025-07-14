import dealsData from "@/services/mockData/deals.json";

// Constants for 2025 analysis
const CURRENT_YEAR = 2025;
const PREVIOUS_YEAR = 2024;

// Helper function to simulate API delay
const simulateAPICall = (delay = 300) => 
  new Promise(resolve => setTimeout(resolve, delay));

// Helper function to filter deals by year
const filterDealsByYear = (deals, year) => {
  return deals.filter(deal => {
    const dealYear = deal.year || new Date(deal.createdAt).getFullYear();
    return dealYear === year;
  });
};

// Helper function to calculate percentage change
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
};

// Helper function to calculate average days between dates
const calculateAverageDays = (deals) => {
  if (!deals.length) return 0;
  
  const validDeals = deals.filter(deal => deal.createdAt && deal.stage === 'Closed');
  if (!validDeals.length) return 0;
  
  const totalDays = validDeals.reduce((sum, deal) => {
    const createdDate = new Date(deal.createdAt);
    const closedDate = new Date(); // Assuming closed deals are recent
    const diffTime = Math.abs(closedDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);
  
  return Math.round(totalDays / validDeals.length);
};

// Get revenue overview with year-over-year comparison
export const getRevenueOverview = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  const previousYearDeals = filterDealsByYear(dealsData, PREVIOUS_YEAR);
  
  const currentRevenue = currentYearDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const previousRevenue = previousYearDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  
  return {
    value: `$${(currentRevenue / 1000).toFixed(0)}K`,
    trend: currentRevenue >= previousRevenue ? 'up' : 'down',
    trendValue: calculatePercentageChange(currentRevenue, previousRevenue),
    currentYear: currentRevenue,
    previousYear: previousRevenue
  };
};

// Get average sales cycle with comparison
export const getAverageSalesCycle = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  const previousYearDeals = filterDealsByYear(dealsData, PREVIOUS_YEAR);
  
  const currentAvgDays = calculateAverageDays(currentYearDeals);
  const previousAvgDays = calculateAverageDays(previousYearDeals);
  
  const closedDeals = currentYearDeals.filter(deal => deal.stage === 'Closed');
  const cycleDays = closedDeals.map(deal => {
    const createdDate = new Date(deal.createdAt);
    const closedDate = new Date();
    return Math.ceil(Math.abs(closedDate - createdDate) / (1000 * 60 * 60 * 24));
  });
  
  return {
    value: `${currentAvgDays} days`,
    trend: currentAvgDays <= previousAvgDays ? 'up' : 'down',
    trendValue: calculatePercentageChange(currentAvgDays, previousAvgDays),
    avgDays: currentAvgDays,
    shortest: cycleDays.length ? Math.min(...cycleDays) : 0,
    longest: cycleDays.length ? Math.max(...cycleDays) : 0
  };
};

// Get average deal value with comparison
export const getAverageDealValue = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  const previousYearDeals = filterDealsByYear(dealsData, PREVIOUS_YEAR);
  
  const currentWonDeals = currentYearDeals.filter(deal => deal.stage === 'Closed');
  const previousWonDeals = previousYearDeals.filter(deal => deal.stage === 'Closed');
  
  const currentAvgValue = currentWonDeals.length > 0 
    ? currentWonDeals.reduce((sum, deal) => sum + deal.value, 0) / currentWonDeals.length
    : 0;
  
  const previousAvgValue = previousWonDeals.length > 0
    ? previousWonDeals.reduce((sum, deal) => sum + deal.value, 0) / previousWonDeals.length
    : 0;
  
  const dealValues = currentWonDeals.map(deal => deal.value);
  
  return {
    value: `$${(currentAvgValue / 1000).toFixed(0)}K`,
    trend: currentAvgValue >= previousAvgValue ? 'up' : 'down',
    trendValue: calculatePercentageChange(currentAvgValue, previousAvgValue),
    avgValue: `$${(currentAvgValue / 1000).toFixed(0)}K`,
    highest: dealValues.length ? `$${(Math.max(...dealValues) / 1000).toFixed(0)}K` : '$0',
    lowest: dealValues.length ? `$${(Math.min(...dealValues) / 1000).toFixed(0)}K` : '$0'
  };
};

// Get number of deals won with comparison
export const getDealsWonCount = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  const previousYearDeals = filterDealsByYear(dealsData, PREVIOUS_YEAR);
  
  const currentWonDeals = currentYearDeals.filter(deal => deal.stage === 'Closed').length;
  const previousWonDeals = previousYearDeals.filter(deal => deal.stage === 'Closed').length;
  
  return {
    value: currentWonDeals.toString(),
    trend: currentWonDeals >= previousWonDeals ? 'up' : 'down',
    trendValue: calculatePercentageChange(currentWonDeals, previousWonDeals),
    current: currentWonDeals,
    previous: previousWonDeals
  };
};

// Get new opportunities count with comparison
export const getNewOpportunities = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  const previousYearDeals = filterDealsByYear(dealsData, PREVIOUS_YEAR);
  
  const currentOpportunities = currentYearDeals.length;
  const previousOpportunities = previousYearDeals.length;
  
  const currentMonth = new Date().getMonth();
  const thisMonthDeals = currentYearDeals.filter(deal => {
    const dealMonth = new Date(deal.createdAt).getMonth();
    return dealMonth === currentMonth;
  }).length;
  
  const wonDeals = currentYearDeals.filter(deal => deal.stage === 'Closed').length;
  const conversionRate = currentOpportunities > 0 ? ((wonDeals / currentOpportunities) * 100).toFixed(1) : 0;
  
  return {
    value: currentOpportunities.toString(),
    trend: currentOpportunities >= previousOpportunities ? 'up' : 'down',
    trendValue: calculatePercentageChange(currentOpportunities, previousOpportunities),
    total: currentOpportunities,
    thisMonth: thisMonthDeals,
    conversionRate: `${conversionRate}%`
  };
};

// Get revenue trends chart data
export const getRevenueTrendsChart = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  
  // Group deals by month
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const monthDeals = currentYearDeals.filter(deal => {
      const dealMonth = new Date(deal.createdAt).getMonth();
      return dealMonth === i && deal.stage === 'Closed';
    });
    return monthDeals.reduce((sum, deal) => sum + deal.value, 0);
  });
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return {
    categories: monthNames,
    series: [{
      name: 'Revenue',
      data: monthlyRevenue
    }]
  };
};

// Get funnel progression chart data
export const getFunnelProgressionChart = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  
  const stageCounts = currentYearDeals.reduce((acc, deal) => {
    const stage = deal.stage || 'Unknown';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});
  
  const stages = ['Connected', 'Meeting Booked', 'Negotiation', 'Closed'];
  const stageData = stages.map(stage => stageCounts[stage] || 0);
  
  return {
    categories: stages,
    series: [{
      name: 'Deals',
      data: stageData
    }]
  };
};

// Get all revenue insights data
export const getAllRevenueInsights = async () => {
  await simulateAPICall();
  
  const [
    revenue,
    salesCycle,
    dealValue,
    dealsWon,
    opportunities,
    trends,
    funnel
  ] = await Promise.all([
    getRevenueOverview(),
    getAverageSalesCycle(),
    getAverageDealValue(),
    getDealsWonCount(),
    getNewOpportunities(),
    getRevenueTrendsChart(),
    getFunnelProgressionChart()
  ]);
  
  return {
    revenue,
    salesCycle,
    dealValue,
    dealsWon,
    opportunities,
    trends,
    funnel
  };
};

// Export all functions for external use
export default {
  getRevenueOverview,
  getAverageSalesCycle,
  getAverageDealValue,
  getDealsWonCount,
  getNewOpportunities,
  getRevenueTrendsChart,
getAllRevenueInsights
};

// Get expected revenue vs goal for 2025
export const getExpectedRevenueVsGoal = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  const expectedRevenue = currentYearDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const revenueGoal = 2000000; // $2M goal for 2025
  
  const achievementPercentage = ((expectedRevenue / revenueGoal) * 100).toFixed(1);
  
  return {
    expected: expectedRevenue,
    goal: revenueGoal,
    achievementPercentage: `${achievementPercentage}%`,
    remaining: Math.max(0, revenueGoal - expectedRevenue),
    status: expectedRevenue >= revenueGoal ? 'achieved' : 'in-progress'
  };
};

// Get revenue by quarter for 2025
export const getRevenueByQuarter = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  
  const quarterlyRevenue = [
    { quarter: 'Q1', months: [0, 1, 2] },
    { quarter: 'Q2', months: [3, 4, 5] },
    { quarter: 'Q3', months: [6, 7, 8] },
    { quarter: 'Q4', months: [9, 10, 11] }
  ].map(q => {
    const revenue = currentYearDeals
      .filter(deal => {
        const dealMonth = new Date(deal.createdAt).getMonth();
        return q.months.includes(dealMonth) && deal.stage === 'Closed';
      })
      .reduce((sum, deal) => sum + deal.value, 0);
    
    return {
      quarter: q.quarter,
      revenue: revenue
    };
  });
  
  return {
    categories: quarterlyRevenue.map(q => q.quarter),
    series: [{
      name: 'Revenue',
      data: quarterlyRevenue.map(q => q.revenue)
    }],
    quarters: quarterlyRevenue
  };
};

// Get top earning accounts for 2025
export const getTopEarningAccounts = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR)
    .filter(deal => deal.stage === 'Closed');
  
  const accountRevenue = currentYearDeals.reduce((acc, deal) => {
    const accountName = deal.name || 'Unknown Account';
    acc[accountName] = (acc[accountName] || 0) + deal.value;
    return acc;
  }, {});
  
  const topAccounts = Object.entries(accountRevenue)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  return topAccounts;
};

// Get top lead sources for 2025
export const getTopLeadSources = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  
  // Mock lead sources based on deal patterns
  const leadSources = {
    'Website': Math.floor(currentYearDeals.length * 0.35),
    'Referral': Math.floor(currentYearDeals.length * 0.25),
    'Cold Email': Math.floor(currentYearDeals.length * 0.20),
    'Social Media': Math.floor(currentYearDeals.length * 0.15),
    'Events': Math.floor(currentYearDeals.length * 0.05)
  };
  
  return Object.entries(leadSources)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
};

// Get top lost reasons for 2025
export const getTopLostReasons = async () => {
  await simulateAPICall();
  
  const currentYearDeals = filterDealsByYear(dealsData, CURRENT_YEAR);
  const lostDeals = currentYearDeals.filter(deal => 
    deal.stage === 'Rejected' || deal.stage === 'Closed Lost'
  );
  
  // Mock lost reasons based on common patterns
  const lostReasons = {
    'Budget Constraints': Math.floor(lostDeals.length * 0.30),
    'Timing Issues': Math.floor(lostDeals.length * 0.25),
    'Competitor Chosen': Math.floor(lostDeals.length * 0.20),
    'No Decision Made': Math.floor(lostDeals.length * 0.15),
    'Internal Changes': Math.floor(lostDeals.length * 0.10)
  };
  
  const totalLost = Object.values(lostReasons).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(lostReasons)
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: totalLost > 0 ? ((count / totalLost) * 100).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.count - a.count);
};