import mockData from '@/services/mockData/teams.json';

let teams = [...mockData];
let nextId = Math.max(...teams.map(team => team.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getTeams = async () => {
  await delay(300);
  return [...teams];
};

export const getTeamById = async (id) => {
  await delay(200);
  const teamId = parseInt(id);
  const team = teams.find(t => t.Id === teamId);
  if (!team) {
    throw new Error(`Team member with ID ${teamId} not found`);
  }
  return { ...team };
};

export const createTeam = async (teamData) => {
  await delay(400);
  
  // Check for duplicate email
  const existingTeam = teams.find(t => t.email.toLowerCase() === teamData.email.toLowerCase());
  if (existingTeam) {
    throw new Error('A team member with this email already exists');
  }
  
  const newTeam = {
    ...teamData,
    Id: nextId++,
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    status: teamData.status || 'Active',
    avatar: teamData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(teamData.name)}&background=7C3AED&color=fff`
  };
  
  teams.unshift(newTeam);
  return { ...newTeam };
};

export const updateTeam = async (id, updates) => {
  await delay(300);
  
  const teamId = parseInt(id);
  const index = teams.findIndex(t => t.Id === teamId);
  if (index === -1) {
    throw new Error(`Team member with ID ${teamId} not found`);
  }
  
  // Check for duplicate email if email is being updated
  if (updates.email) {
    const existingTeam = teams.find(t => t.email.toLowerCase() === updates.email.toLowerCase() && t.Id !== teamId);
    if (existingTeam) {
      throw new Error('A team member with this email already exists');
    }
  }
  
  const updatedTeam = {
    ...teams[index],
    ...updates,
    Id: teamId // Ensure ID cannot be changed
  };
  
  teams[index] = updatedTeam;
  return { ...updatedTeam };
};

export const deleteTeam = async (id) => {
  await delay(250);
  
  const teamId = parseInt(id);
  const index = teams.findIndex(t => t.Id === teamId);
  if (index === -1) {
    throw new Error(`Team member with ID ${teamId} not found`);
  }
  
  teams.splice(index, 1);
  return true;
};

export const updateTeamStatus = async (id, status) => {
  return updateTeam(id, { status });
};

export const updateTeamAccessLevel = async (id, accessLevel) => {
  return updateTeam(id, { accessLevel });
};

export const getTeamsByDepartment = async (department) => {
  await delay(200);
  return teams.filter(t => t.department === department);
};

export const getTeamsByAccessLevel = async (accessLevel) => {
  await delay(200);
  return teams.filter(t => t.accessLevel === accessLevel);
};