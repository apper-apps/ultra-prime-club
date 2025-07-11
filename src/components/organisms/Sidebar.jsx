import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

const navigation = [
    { to: "/", icon: "BarChart3", label: "Dashboard" },
    { to: "/leads", icon: "Building2", label: "Leads" },
    { to: "/hotlist", icon: "Flame", label: "Hotlist" },
    { to: "/pipeline", icon: "Kanban", label: "Deal Pipeline" },
    { to: "/calendar", icon: "Calendar", label: "Calendar" },
    { to: "/analytics", icon: "TrendingUp", label: "Analytics" },
    { to: "/leaderboard", icon: "Trophy", label: "Leaderboard" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ x: -240 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-30 transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
<div className="flex items-center justify-between p-6 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={18} className="text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">Prime Club</h1>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={20} 
                className="text-gray-500" 
              />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <UserSettings isCollapsed={isCollapsed} />
          </div>
        </motion.div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        <MobileSidebar navigation={navigation} />
      </div>
    </>
  );
};

const MobileSidebar = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={18} className="text-white" />
          </div>
          <h1 className="ml-3 text-xl font-bold text-gray-900">Prime Club</h1>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon name="Menu" size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl"
          >
<div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={18} className="text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">Prime Club</h1>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.to} onClick={() => setIsOpen(false)}>
                  <NavItem
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                  />
                </div>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );
};

const UserSettings = ({ isCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);

const settingsItems = [
    { icon: "User", label: "Profile", action: () => console.log("Profile") },
    { icon: "Users", label: "Team Management", action: () => setShowTeamManagement(true) },
    { icon: "Settings", label: "Account Settings", action: () => console.log("Account Settings") },
    { icon: "Palette", label: "Preferences", action: () => console.log("Preferences") },
    { icon: "LogOut", label: "Logout", action: () => console.log("Logout") }
  ];

return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">U</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">User</p>
              <p className="text-xs text-gray-500">Sales Manager</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <ApperIcon 
            name="ChevronDown" 
            size={16} 
            className="text-gray-500 ml-auto" 
          />
        )}
      </button>

{isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className={`absolute ${isCollapsed ? 'left-0' : 'left-0'} bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50`}>
            <div className="py-2">
              {settingsItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                >
                  <ApperIcon name={item.icon} size={16} className="mr-3 text-gray-500" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
</>
      )}
      
      {/* Team Management Modal */}
      {showTeamManagement && (
        <TeamManagement onClose={() => setShowTeamManagement(false)} />
      )}
    </div>
  );
};

// Team Management Component
const TeamManagement = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Team Management</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Manage your team members and control their access to different features.
          </p>
          <div className="text-center py-8">
            <ApperIcon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Team management interface will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;