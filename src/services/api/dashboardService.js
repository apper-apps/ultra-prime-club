import dashboardData from "@/services/mockData/dashboard.json";
import { getDailyLeadsReport as getLeadsReport } from "@/services/api/leadsService";

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