import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getLeads, updateLead, deleteLead, createLead } from "@/services/api/leadsService";

const Leads = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fundingFilter, setFundingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const leadsData = await getLeads();
      setData(leadsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const updatedLead = await updateLead(leadId, { status: newStatus });
      setData(prevData => 
        prevData.map(lead => 
          lead.Id === leadId ? updatedLead : lead
        )
      );
      toast.success("Lead status updated successfully!");
    } catch (err) {
      toast.error("Failed to update lead status");
    }
  };

  const handleDelete = async (leadId) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      await deleteLead(leadId);
      setData(prevData => prevData.filter(lead => lead.Id !== leadId));
      toast.success("Lead deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  const handleAddLead = async (leadData) => {
    try {
      const newLead = await createLead(leadData);
      setData(prevData => [newLead, ...prevData]);
      setShowAddForm(false);
      toast.success("Lead added successfully!");
    } catch (err) {
      toast.error("Failed to add lead");
    }
  };

const handleUpdateLead = async (leadId, updates) => {
    try {
      const updatedLead = await updateLead(leadId, updates);
      setData(prevData => 
        prevData.map(lead => 
          lead.Id === leadId ? updatedLead : lead
        )
      );
      setEditingLead(null);
      toast.success("Lead updated successfully!");
    } catch (err) {
      toast.error("Failed to update lead");
    }
  };

  const handleFieldUpdate = async (leadId, field, value) => {
    try {
      const updates = { [field]: field === 'arr' ? Number(value) : value };
      const updatedLead = await updateLead(leadId, updates);
      setData(prevData => 
        prevData.map(lead => 
          lead.Id === leadId ? updatedLead : lead
        )
      );
      toast.success("Lead updated successfully!");
    } catch (err) {
      toast.error("Failed to update lead");
    }
  };

  const handleInlineEdit = (leadId, field, currentValue) => {
    const newValue = prompt(`Edit ${field}:`, currentValue);
    if (newValue !== null && newValue !== currentValue) {
      handleFieldUpdate(leadId, field, newValue);
    }
  };

const getStatusColor = (status) => {
    const colors = {
      "Launched on AppSumo": "success",
      "Launched on Prime Club": "primary",
      "Keep an Eye": "info",
      "Rejected": "error",
      "Unsubscribed": "warning",
      "Outdated": "default",
      "Hotlist": "primary",
      "Out of League": "error",
      "Connected": "info",
      "Locked": "warning",
      "Meeting Booked": "primary",
      "Meeting Done": "success",
      "Negotiation": "warning",
      "Closed Lost": "error"
    };
    return colors[status] || "default";
  };

  const filteredAndSortedData = data
    .filter(lead => {
      const matchesSearch = !searchTerm || 
        lead.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.teamSize.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesFunding = fundingFilter === "all" || lead.fundingType === fundingFilter;
      
      return matchesSearch && matchesStatus && matchesFunding;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "arr") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (sortBy === "createdAt") {
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

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
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage your lead pipeline and track opportunities</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="shrink-0">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add New Lead
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by website, category, or team size..."
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
<select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="Launched on AppSumo">Launched on AppSumo</option>
              <option value="Launched on Prime Club">Launched on Prime Club</option>
              <option value="Keep an Eye">Keep an Eye</option>
              <option value="Rejected">Rejected</option>
              <option value="Unsubscribed">Unsubscribed</option>
              <option value="Outdated">Outdated</option>
              <option value="Hotlist">Hotlist</option>
              <option value="Out of League">Out of League</option>
              <option value="Connected">Connected</option>
              <option value="Locked">Locked</option>
              <option value="Meeting Booked">Meeting Booked</option>
              <option value="Meeting Done">Meeting Done</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
            <select
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Funding Types</option>
              <option value="Bootstrapped">Bootstrapped</option>
              <option value="Pre-seed">Pre-seed</option>
              <option value="Y Combinator">Y Combinator</option>
              <option value="Angel">Angel</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C">Series C</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="overflow-hidden">
        {filteredAndSortedData.length === 0 ? (
          <Empty
            title="No leads found"
            description="Add your first lead to get started with lead management"
            actionText="Add Lead"
            onAction={() => setShowAddForm(true)}
            icon="Building2"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("websiteUrl")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Website URL
                      <ApperIcon name="ArrowUpDown" size={12} />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("teamSize")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Team Size
                      <ApperIcon name="ArrowUpDown" size={12} />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("arr")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      ARR
                      <ApperIcon name="ArrowUpDown" size={12} />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LinkedIn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funding Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedData.map((lead) => (
                  <tr key={lead.Id} className="hover:bg-gray-50">
<td className="px-6 py-4 whitespace-nowrap">
                      <div
                        onClick={() => handleInlineEdit(lead.Id, 'websiteUrl', lead.websiteUrl)}
                        className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <a
                          href={lead.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {lead.websiteUrl.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div
                        onClick={() => handleInlineEdit(lead.Id, 'teamSize', lead.teamSize)}
                        className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        {lead.teamSize}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div
                        onClick={() => handleInlineEdit(lead.Id, 'arr', lead.arr.toString())}
                        className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        ${lead.arr.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div
                        onClick={() => handleInlineEdit(lead.Id, 'category', lead.category)}
                        className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        {lead.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        onClick={() => handleInlineEdit(lead.Id, 'linkedinUrl', lead.linkedinUrl)}
                        className="cursor-pointer hover:bg-gray-50 p-1 rounded inline-block"
                      >
                        <a
                          href={lead.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ApperIcon name="Linkedin" size={16} />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.Id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                      >
                        <option value="Launched on AppSumo">Launched on AppSumo</option>
                        <option value="Launched on Prime Club">Launched on Prime Club</option>
                        <option value="Keep an Eye">Keep an Eye</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Unsubscribed">Unsubscribed</option>
                        <option value="Outdated">Outdated</option>
                        <option value="Hotlist">Hotlist</option>
                        <option value="Out of League">Out of League</option>
                        <option value="Connected">Connected</option>
                        <option value="Locked">Locked</option>
                        <option value="Meeting Booked">Meeting Booked</option>
                        <option value="Meeting Done">Meeting Done</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Closed Lost">Closed Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        onClick={() => handleInlineEdit(lead.Id, 'fundingType', lead.fundingType)}
                        className="cursor-pointer hover:bg-gray-50 p-1 rounded inline-block"
                      >
                        <Badge variant={lead.fundingType === "Series C" ? "primary" : "default"}>
                          {lead.fundingType}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.Id)}
                          className="text-red-600 hover:text-red-800"
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

      {/* Add Lead Modal */}
      {showAddForm && (
        <AddLeadModal
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddLead}
        />
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSubmit={handleUpdateLead}
        />
      )}
    </motion.div>
  );
};

const AddLeadModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    websiteUrl: "",
    teamSize: "1-10",
    arr: "",
    category: "",
    linkedinUrl: "",
    status: "Keep an Eye",
    fundingType: "Bootstrapped"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      arr: Number(formData.arr)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Add New Lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <Input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
              placeholder="https://example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Size
            </label>
            <select
              value={formData.teamSize}
              onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-100">51-100</option>
              <option value="101-500">101-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1001+">1001+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ARR (USD)
            </label>
            <Input
              type="number"
              value={formData.arr}
              onChange={(e) => setFormData({...formData, arr: e.target.value})}
              placeholder="150000"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="CRM, Marketing, Productivity"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL
            </label>
            <Input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
              placeholder="https://linkedin.com/company/example"
              required
            />
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
<option value="Launched on AppSumo">Launched on AppSumo</option>
              <option value="Launched on Prime Club">Launched on Prime Club</option>
              <option value="Keep an Eye">Keep an Eye</option>
              <option value="Rejected">Rejected</option>
              <option value="Unsubscribed">Unsubscribed</option>
              <option value="Outdated">Outdated</option>
              <option value="Hotlist">Hotlist</option>
              <option value="Out of League">Out of League</option>
              <option value="Connected">Connected</option>
              <option value="Locked">Locked</option>
              <option value="Meeting Booked">Meeting Booked</option>
              <option value="Meeting Done">Meeting Done</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funding Type
            </label>
            <select
              value={formData.fundingType}
              onChange={(e) => setFormData({...formData, fundingType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Bootstrapped">Bootstrapped</option>
              <option value="Pre-seed">Pre-seed</option>
              <option value="Y Combinator">Y Combinator</option>
              <option value="Angel">Angel</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C">Series C</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditLeadModal = ({ lead, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    websiteUrl: lead.websiteUrl,
    teamSize: lead.teamSize,
    arr: lead.arr.toString(),
    category: lead.category,
    linkedinUrl: lead.linkedinUrl,
    status: lead.status,
    fundingType: lead.fundingType
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(lead.Id, {
      ...formData,
      arr: Number(formData.arr)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Edit Lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <Input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Size
            </label>
            <select
              value={formData.teamSize}
              onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-100">51-100</option>
              <option value="101-500">101-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1001+">1001+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ARR (USD)
            </label>
            <Input
              type="number"
              value={formData.arr}
              onChange={(e) => setFormData({...formData, arr: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL
            </label>
            <Input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
              required
            />
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
<option value="Launched on AppSumo">Launched on AppSumo</option>
              <option value="Launched on Prime Club">Launched on Prime Club</option>
              <option value="Keep an Eye">Keep an Eye</option>
              <option value="Rejected">Rejected</option>
              <option value="Unsubscribed">Unsubscribed</option>
              <option value="Outdated">Outdated</option>
              <option value="Hotlist">Hotlist</option>
              <option value="Out of League">Out of League</option>
              <option value="Connected">Connected</option>
              <option value="Locked">Locked</option>
              <option value="Meeting Booked">Meeting Booked</option>
              <option value="Meeting Done">Meeting Done</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funding Type
            </label>
            <select
              value={formData.fundingType}
              onChange={(e) => setFormData({...formData, fundingType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Bootstrapped">Bootstrapped</option>
              <option value="Pre-seed">Pre-seed</option>
              <option value="Y Combinator">Y Combinator</option>
              <option value="Angel">Angel</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C">Series C</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Leads;