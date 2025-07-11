import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  updateTeamStatus,
  updateTeamAccessLevel
} from "@/services/api/teamsService";

const Team = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [accessLevelFilter, setAccessLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTeams();
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async (teamData) => {
    try {
      const newTeam = await createTeam(teamData);
      setData(prevData => [newTeam, ...prevData]);
      setShowAddForm(false);
      toast.success("Team member added successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateTeam = async (teamId, updates) => {
    try {
      const updatedTeam = await updateTeam(teamId, updates);
      setData(prevData => 
        prevData.map(team => 
          team.Id === teamId ? updatedTeam : team
        )
      );
      setEditingTeam(null);
      toast.success("Team member updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (teamId) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    
    try {
      await deleteTeam(teamId);
      setData(prevData => prevData.filter(team => team.Id !== teamId));
      setSelectedTeams(prevSelected => prevSelected.filter(id => id !== teamId));
      toast.success("Team member removed successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStatusChange = async (teamId, newStatus) => {
    try {
      const updatedTeam = await updateTeamStatus(teamId, newStatus);
      setData(prevData => 
        prevData.map(team => 
          team.Id === teamId ? updatedTeam : team
        )
      );
      toast.success("Team member status updated successfully!");
    } catch (err) {
      toast.error("Failed to update team member status");
    }
  };

  const handleAccessLevelChange = async (teamId, newAccessLevel) => {
    try {
      const updatedTeam = await updateTeamAccessLevel(teamId, newAccessLevel);
      setData(prevData => 
        prevData.map(team => 
          team.Id === teamId ? updatedTeam : team
        )
      );
      toast.success("Access level updated successfully!");
    } catch (err) {
      toast.error("Failed to update access level");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTeams.length === 0) return;
    
    try {
      let successCount = 0;
      let failCount = 0;
      
      for (const teamId of selectedTeams) {
        try {
          await deleteTeam(teamId);
          successCount++;
        } catch (err) {
          failCount++;
        }
      }
      
      setData(prevData => prevData.filter(team => !selectedTeams.includes(team.Id)));
      setSelectedTeams([]);
      setShowBulkDeleteDialog(false);
      
      if (successCount > 0 && failCount === 0) {
        toast.success(`Successfully removed ${successCount} team member${successCount > 1 ? 's' : ''}`);
      } else if (successCount > 0 && failCount > 0) {
        toast.warning(`Removed ${successCount} team member${successCount > 1 ? 's' : ''}, failed to remove ${failCount}`);
      } else {
        toast.error("Failed to remove selected team members");
      }
    } catch (err) {
      toast.error("Failed to remove team members");
      setShowBulkDeleteDialog(false);
    }
  };

  const toggleTeamSelection = (teamId) => {
    setSelectedTeams(prevSelected => {
      if (prevSelected.includes(teamId)) {
        return prevSelected.filter(id => id !== teamId);
      } else {
        return [...prevSelected, teamId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedTeams.length === filteredAndSortedData.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(filteredAndSortedData.map(team => team.Id));
    }
  };

  const clearSelection = () => {
    setSelectedTeams([]);
  };

  const getStatusColor = (status) => {
    const colors = {
      "Active": "success",
      "Inactive": "warning",
      "Suspended": "error"
    };
    return colors[status] || "default";
  };

  const getAccessLevelColor = (accessLevel) => {
    const colors = {
      "Admin": "error",
      "Manager": "warning",
      "Member": "info"
    };
    return colors[accessLevel] || "default";
  };

  const filteredAndSortedData = data
    .filter(team => {
      const matchesSearch = !searchTerm || 
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === "all" || team.department === departmentFilter;
      const matchesAccessLevel = accessLevelFilter === "all" || team.accessLevel === accessLevelFilter;
      const matchesStatus = statusFilter === "all" || team.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesAccessLevel && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "joinDate" || sortBy === "lastActive") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatLastActive = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTeams} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage team members and their access levels</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          variant="outline"
          className="shrink-0"
        >
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by name, email, role, or department..."
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Analytics">Analytics</option>
              <option value="Human Resources">Human Resources</option>
            </select>
            <select
              value={accessLevelFilter}
              onChange={e => setAccessLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Access Levels</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Team Table */}
      <Card className="overflow-hidden">
        {filteredAndSortedData.length === 0 ? (
          <Empty
            title="No team members found"
            description="Add your first team member to get started"
            actionText="Add Team Member"
            onAction={() => setShowAddForm(true)}
            icon="Users"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[50px]">
                    <input
                      type="checkbox"
                      checked={selectedTeams.length === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Team Member
                      <ApperIcon name="ArrowUpDown" size={12} />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    <button
                      onClick={() => handleSort("role")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Role
                      <ApperIcon name="ArrowUpDown" size={12} />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                    <button
                      onClick={() => handleSort("department")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Department
                      <ApperIcon name="ArrowUpDown" size={12} />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Access Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    <button
                      onClick={() => handleSort("lastActive")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Last Active
                      <ApperIcon name="ArrowUpDown" size={12} />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedData.map(team => (
                  <tr key={team.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team.Id)}
                        onChange={() => toggleTeamSelection(team.Id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[250px]">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={team.avatar}
                            alt={team.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{team.name}</div>
                          <div className="text-sm text-gray-500">{team.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[150px]">
                      {team.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[130px]">
                      {team.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[120px]">
                      <div className="relative">
                        <Badge
                          variant={getAccessLevelColor(team.accessLevel)}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                        >
                          {team.accessLevel}
                        </Badge>
                        <select
                          value={team.accessLevel}
                          onChange={(e) => handleAccessLevelChange(team.Id, e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Member">Member</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[100px]">
                      <div className="relative">
                        <Badge
                          variant={getStatusColor(team.status)}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                        >
                          {team.status}
                        </Badge>
                        <select
                          value={team.status}
                          onChange={(e) => handleStatusChange(team.Id, e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[120px]">
                      {formatLastActive(team.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-[120px]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTeam(team)}
                          className="text-primary-600 hover:text-primary-800 p-1 hover:bg-gray-100 rounded"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(team.Id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-gray-100 rounded"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedTeams.length > 0 && (
        <Card className="p-4 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ApperIcon name="CheckCircle" size={20} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                {selectedTeams.length} team member{selectedTeams.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="text-primary-600 border-primary-300 hover:bg-primary-100"
              >
                Clear Selection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkDeleteDialog(true)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Remove Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Add Team Modal */}
      {showAddForm && (
        <AddTeamModal
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddTeam}
        />
      )}

      {/* Edit Team Modal */}
      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
          onSubmit={handleUpdateTeam}
        />
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {showBulkDeleteDialog && (
        <BulkDeleteConfirmationDialog
          selectedCount={selectedTeams.length}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowBulkDeleteDialog(false)}
        />
      )}
    </motion.div>
  );
};

const AddTeamModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    accessLevel: "Member",
    status: "Active",
    phone: "",
    location: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const departmentOptions = [
    "Sales", "Engineering", "Marketing", "Product", "Design", "Analytics", "Human Resources"
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Add Team Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Smith"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john.smith@primeclub.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder="Sales Manager"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Department</option>
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Level
            </label>
            <select
              value={formData.accessLevel}
              onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Member">Member</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="New York, NY"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Team Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditTeamModal = ({ team, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: team.name,
    email: team.email,
    role: team.role,
    department: team.department,
    accessLevel: team.accessLevel,
    status: team.status,
    phone: team.phone || "",
    location: team.location || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(team.Id, formData);
  };

  const departmentOptions = [
    "Sales", "Engineering", "Marketing", "Product", "Design", "Analytics", "Human Resources"
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Edit Team Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Level
            </label>
            <select
              value={formData.accessLevel}
              onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Member">Member</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Team Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BulkDeleteConfirmationDialog = ({ selectedCount, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Bulk Remove</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to remove <span className="font-semibold">{selectedCount}</span> selected team member{selectedCount > 1 ? 's' : ''}?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This will permanently remove the selected team members from your team. This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Remove {selectedCount} Member{selectedCount > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;