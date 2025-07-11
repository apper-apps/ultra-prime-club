import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Avatar from "@/components/atoms/Avatar";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamPerformance,
  getAvailableSalesReps,
  getTeamMemberPerformance
} from "@/services/api/teamsService";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [viewingTeam, setViewingTeam] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState({});
  const [memberPerformance, setMemberPerformance] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [teamsData, salesRepsData] = await Promise.all([
        getTeams(),
        getAvailableSalesReps()
      ]);
      
      setTeams(teamsData);
      setSalesReps(salesRepsData);
    } catch (err) {
      setError("Failed to load teams data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData) => {
    try {
      const newTeam = await createTeam(teamData);
      setTeams(prev => [newTeam, ...prev]);
      setShowCreateModal(false);
      toast.success("Team created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to create team");
    }
  };

  const handleUpdateTeam = async (teamId, updates) => {
    try {
      const updatedTeam = await updateTeam(teamId, updates);
      setTeams(prev => prev.map(team => 
        team.Id === teamId ? updatedTeam : team
      ));
      setShowEditModal(false);
      setEditingTeam(null);
      toast.success("Team updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update team");
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    
    try {
      await deleteTeam(teamId);
      setTeams(prev => prev.filter(team => team.Id !== teamId));
      toast.success("Team deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete team");
    }
  };

  const handleViewTeam = async (team) => {
    try {
      setViewingTeam(team);
      setShowViewModal(true);
      
      const [performance, memberPerf] = await Promise.all([
        getTeamPerformance(team.Id),
        getTeamMemberPerformance(team.Id)
      ]);
      
      setTeamPerformance(performance);
      setMemberPerformance(memberPerf);
    } catch (err) {
      toast.error("Failed to load team details");
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredAndSortedTeams = teams
    .filter(team => 
      !searchTerm || 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "members") {
        aValue = a.members.length;
        bValue = b.members.length;
      }
      
      if (sortBy === "performance") {
        aValue = a.performance.totalRevenue;
        bValue = b.performance.totalRevenue;
      }
      
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600">Manage your sales teams and track performance</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Team
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <SearchBar
          placeholder="Search teams by name, description, or leader..."
          onSearch={setSearchTerm}
        />
      </Card>

      {/* Teams Grid */}
      <div className="space-y-6">
        {filteredAndSortedTeams.length === 0 ? (
          <Empty
            title="No teams found"
            description="Create your first team to organize your sales representatives"
            actionText="Create Team"
            onAction={() => setShowCreateModal(true)}
            icon="Users"
          />
        ) : (
          <>
            {/* Team Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedTeams.map((team, index) => (
                <motion.div
                  key={team.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{team.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{team.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewTeam(team)}
                          className="p-1 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded"
                          title="View details"
                        >
                          <ApperIcon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTeam(team);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                          title="Edit team"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.Id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Delete team"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Team Leader */}
                      <div className="flex items-center gap-3">
                        <Avatar name={team.leaderName} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{team.leaderName}</p>
                          <p className="text-xs text-gray-500">Team Leader</p>
                        </div>
                      </div>

                      {/* Team Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Members</p>
                          <p className="text-lg font-semibold text-gray-900">{team.members.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Revenue</p>
                          <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(team.performance.totalRevenue)}
                          </p>
                        </div>
                      </div>

                      {/* Performance Indicators */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Deals Closed</p>
                          <p className="text-sm font-medium text-gray-900">{team.performance.totalDeals}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Conversion</p>
                          <p className="text-sm font-medium text-gray-900">{team.performance.conversionRate}%</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Team Table for detailed view */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Detailed Team Overview</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Team Name
                          <ApperIcon name="ArrowUpDown" size={12} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leader
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("members")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Members
                          <ApperIcon name="ArrowUpDown" size={12} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("performance")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Revenue
                          <ApperIcon name="ArrowUpDown" size={12} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedTeams.map((team) => (
                      <tr key={team.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{team.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{team.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar name={team.leaderName} size="sm" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{team.leaderName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ApperIcon name="Users" size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{team.members.length}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(team.performance.totalRevenue)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {team.performance.totalDeals} deals
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-900">
                              {team.performance.conversionRate}% conversion
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewTeam(team)}
                              className="text-primary-600 hover:text-primary-800"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                setEditingTeam(team);
                                setShowEditModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team.Id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTeam}
          salesReps={salesReps}
        />
      )}

      {/* Edit Team Modal */}
      {showEditModal && editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => {
            setShowEditModal(false);
            setEditingTeam(null);
          }}
          onSubmit={handleUpdateTeam}
          salesReps={salesReps}
        />
      )}

      {/* View Team Modal */}
      {showViewModal && viewingTeam && (
        <ViewTeamModal
          team={viewingTeam}
          onClose={() => {
            setShowViewModal(false);
            setViewingTeam(null);
          }}
          performance={teamPerformance}
          memberPerformance={memberPerformance}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

// Create Team Modal Component
const CreateTeamModal = ({ onClose, onSubmit, salesReps }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leaderId: "",
    members: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    if (!formData.leaderId) {
      toast.error("Team leader is required");
      return;
    }
    
    // Ensure leader is included in members
    const members = Array.from(new Set([formData.leaderId, ...formData.members]));
    
    onSubmit({
      ...formData,
      leaderId: parseInt(formData.leaderId),
      members: members.map(id => parseInt(id))
    });
  };

  const handleMemberToggle = (repId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(repId)
        ? prev.members.filter(id => id !== repId)
        : [...prev.members, repId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Create New Team</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter team name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the team's focus and objectives"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Leader *
            </label>
            <select
              value={formData.leaderId}
              onChange={(e) => setFormData({...formData, leaderId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select a team leader</option>
              {salesReps.map(rep => (
                <option key={rep.Id} value={rep.Id}>{rep.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Team Members
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {salesReps.map(rep => (
                <label key={rep.Id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.members.includes(rep.Id.toString()) || formData.leaderId === rep.Id.toString()}
                    onChange={() => handleMemberToggle(rep.Id.toString())}
                    disabled={formData.leaderId === rep.Id.toString()}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <Avatar name={rep.name} size="sm" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{rep.name}</div>
                    <div className="text-xs text-gray-500">
                      {rep.dealsClosed} deals • {rep.leadsContacted} leads
                    </div>
                  </div>
                  {formData.leaderId === rep.Id.toString() && (
                    <Badge variant="primary" size="sm">Leader</Badge>
                  )}
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Team
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Team Modal Component
const EditTeamModal = ({ team, onClose, onSubmit, salesReps }) => {
  const [formData, setFormData] = useState({
    name: team.name,
    description: team.description,
    leaderId: team.leaderId.toString(),
    members: team.members.map(id => id.toString())
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    if (!formData.leaderId) {
      toast.error("Team leader is required");
      return;
    }
    
    // Ensure leader is included in members
    const members = Array.from(new Set([formData.leaderId, ...formData.members]));
    
    onSubmit(team.Id, {
      ...formData,
      leaderId: parseInt(formData.leaderId),
      members: members.map(id => parseInt(id))
    });
  };

  const handleMemberToggle = (repId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(repId)
        ? prev.members.filter(id => id !== repId)
        : [...prev.members, repId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Edit Team</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter team name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the team's focus and objectives"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Leader *
            </label>
            <select
              value={formData.leaderId}
              onChange={(e) => setFormData({...formData, leaderId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              {salesReps.map(rep => (
                <option key={rep.Id} value={rep.Id}>{rep.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Team Members
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {salesReps.map(rep => (
                <label key={rep.Id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.members.includes(rep.Id.toString()) || formData.leaderId === rep.Id.toString()}
                    onChange={() => handleMemberToggle(rep.Id.toString())}
                    disabled={formData.leaderId === rep.Id.toString()}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <Avatar name={rep.name} size="sm" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{rep.name}</div>
                    <div className="text-xs text-gray-500">
                      {rep.dealsClosed} deals • {rep.leadsContacted} leads
                    </div>
                  </div>
                  {formData.leaderId === rep.Id.toString() && (
                    <Badge variant="primary" size="sm">Leader</Badge>
                  )}
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Team
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Team Modal Component
const ViewTeamModal = ({ team, onClose, performance, memberPerformance, formatCurrency }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">{team.name}</h3>
            <p className="text-sm text-gray-600">{team.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" size={20} className="text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{performance.totalLeads || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" size={20} className="text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Deals Closed</p>
                  <p className="text-2xl font-bold text-gray-900">{performance.totalDeals || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="DollarSign" size={20} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(performance.totalRevenue || 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Percent" size={20} className="text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conversion</p>
                  <p className="text-2xl font-bold text-gray-900">{performance.conversionRate || 0}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Team Members */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Team Members Performance</h4>
            <div className="space-y-3">
              {memberPerformance.map((member) => (
                <Card key={member.Id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar name={member.name} size="md" />
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {member.name}
                          {member.Id === team.leaderId && (
                            <Badge variant="primary" size="sm">Leader</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Performance Score: {member.performanceScore}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.leadsContacted}</p>
                        <p className="text-xs text-gray-500">Leads</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.meetingsBooked}</p>
                        <p className="text-xs text-gray-500">Meetings</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.dealsClosed}</p>
                        <p className="text-xs text-gray-500">Deals</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(member.totalRevenue)}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h5 className="font-medium text-gray-900 mb-3">Team Details</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-900">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="text-gray-900">
                    {new Date(team.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Team Size:</span>
                  <span className="text-gray-900">{team.members.length} members</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h5 className="font-medium text-gray-900 mb-3">Key Metrics</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Deal Size:</span>
                  <span className="text-gray-900">{formatCurrency(performance.avgDealSize || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Meetings:</span>
                  <span className="text-gray-900">{performance.totalMeetings || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Success Rate:</span>
                  <span className="text-gray-900">{performance.conversionRate || 0}%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;