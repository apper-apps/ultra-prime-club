import teamsData from "@/services/mockData/teams.json";
import salesRepsData from "@/services/mockData/salesReps.json";

let teams = [...teamsData];
let salesReps = [...salesRepsData];

export const getTeams = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [...teams];
};

export const getTeamById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const team = teams.find(t => t.Id === id);
  if (!team) {
    throw new Error("Team not found");
  }
  
  return { ...team };
};

export const createTeam = async (teamData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Validate required fields
  if (!teamData.name || !teamData.name.trim()) {
    throw new Error("Team name is required");
  }
  
  if (!teamData.leaderId) {
    throw new Error("Team leader is required");
  }
  
  // Validate leader exists
  const leader = salesReps.find(rep => rep.Id === teamData.leaderId);
  if (!leader) {
    throw new Error("Invalid team leader selected");
  }
  
  const maxId = Math.max(...teams.map(t => t.Id), 0);
  const newTeam = {
    Id: maxId + 1,
    name: teamData.name.trim(),
    description: teamData.description || "",
    leaderId: teamData.leaderId,
    leaderName: leader.name,
    members: teamData.members || [teamData.leaderId],
    memberNames: teamData.members ? 
      teamData.members.map(memberId => {
        const member = salesReps.find(rep => rep.Id === memberId);
        return member ? member.name : "Unknown";
      }) : [leader.name],
    performance: {
      totalLeads: 0,
      totalDeals: 0,
      totalRevenue: 0,
      avgDealSize: 0,
      conversionRate: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  teams.push(newTeam);
  return { ...newTeam };
};

export const updateTeam = async (id, updates) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = teams.findIndex(t => t.Id === id);
  if (index === -1) {
    throw new Error("Team not found");
  }
  
  // If leader is being updated, validate and update leader name
  if (updates.leaderId) {
    const leader = salesReps.find(rep => rep.Id === updates.leaderId);
    if (!leader) {
      throw new Error("Invalid team leader selected");
    }
    updates.leaderName = leader.name;
  }
  
  // If members are being updated, update member names
  if (updates.members) {
    updates.memberNames = updates.members.map(memberId => {
      const member = salesReps.find(rep => rep.Id === memberId);
      return member ? member.name : "Unknown";
    });
  }
  
  teams[index] = { 
    ...teams[index], 
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return { ...teams[index] };
};

export const deleteTeam = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = teams.findIndex(t => t.Id === id);
  if (index === -1) {
    throw new Error("Team not found");
  }
  
  teams.splice(index, 1);
  return { success: true };
};

export const getTeamPerformance = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const team = teams.find(t => t.Id === id);
  if (!team) {
    throw new Error("Team not found");
  }
  
  // Calculate real-time performance based on team members
  const memberPerformance = team.members.map(memberId => {
    const member = salesReps.find(rep => rep.Id === memberId);
    return member || { leadsContacted: 0, meetingsBooked: 0, dealsClosed: 0, totalRevenue: 0 };
  });
  
  const performance = memberPerformance.reduce((acc, member) => ({
    totalLeads: acc.totalLeads + member.leadsContacted,
    totalDeals: acc.totalDeals + member.dealsClosed,
    totalRevenue: acc.totalRevenue + member.totalRevenue,
    totalMeetings: acc.totalMeetings + member.meetingsBooked
  }), { totalLeads: 0, totalDeals: 0, totalRevenue: 0, totalMeetings: 0 });
  
  performance.avgDealSize = performance.totalDeals > 0 ? 
    Math.round(performance.totalRevenue / performance.totalDeals) : 0;
  performance.conversionRate = performance.totalLeads > 0 ? 
    Math.round((performance.totalDeals / performance.totalLeads) * 100 * 10) / 10 : 0;
  
  return performance;
};

export const getAvailableSalesReps = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [...salesReps];
};

export const getTeamMemberPerformance = async (teamId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const team = teams.find(t => t.Id === teamId);
  if (!team) {
    throw new Error("Team not found");
  }
  
  const memberPerformance = team.members.map(memberId => {
    const member = salesReps.find(rep => rep.Id === memberId);
    if (!member) return null;
    
    const performance = {
      ...member,
      performanceScore: member.dealsClosed * 3 + member.meetingsBooked * 2 + member.leadsContacted,
      conversionRate: member.leadsContacted > 0 ? 
        Math.round((member.dealsClosed / member.leadsContacted) * 100 * 10) / 10 : 0
    };
    
    return performance;
  }).filter(Boolean);
  
  return memberPerformance.sort((a, b) => b.performanceScore - a.performanceScore);
};