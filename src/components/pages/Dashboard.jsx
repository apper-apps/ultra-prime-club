import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import MetricCard from "@/components/molecules/MetricCard";
import { getDailyLeadsReport, getDashboardMetrics, getRecentActivity } from "@/services/api/dashboardService";

const DailyLeadsReport = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeadsData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDailyLeadsReport();
        setLeadsData(data || []);
      } catch (err) {
        setError("Failed to load leads report");
      } finally {
        setLoading(false);
      }
    };

    loadLeadsData();
  }, []);

  if (loading) return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Leads Report</h3>
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </Card>
  );

  if (error) return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Leads Report</h3>
      <p className="text-red-600 text-sm">{error}</p>
    </Card>
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Leads Report</h3>
      <div className="space-y-4">
        {leadsData.length > 0 ? (
          leadsData.map((lead, index) => (
            <motion.div
              key={lead.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{lead.name || 'Unknown Lead'}</p>
                <p className="text-sm text-gray-500">{lead.source || 'Unknown Source'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{lead.value || '$0'}</p>
                <p className="text-xs text-gray-500">{lead.time || 'Today'}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No leads data available</p>
        )}
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [metricsData, activityData] = await Promise.all([
        getDashboardMetrics(),
        getRecentActivity()
      ]);
      
      setMetrics(metricsData);
      setActivity(activityData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            trendValue={metric.trendValue}
            color={metric.color}
            delay={index * 0.1}
          />
        ))}
      </div>

{/* Reports and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activity.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${
                  item.type === "meeting" ? "bg-blue-500" :
                  item.type === "deal" ? "bg-green-500" :
                  "bg-yellow-500"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <DailyLeadsReport />

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <div className="font-medium text-gray-900">Add New Lead</div>
              <div className="text-sm text-gray-500">Create a new lead contact</div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <div className="font-medium text-gray-900">Schedule Meeting</div>
              <div className="text-sm text-gray-500">Book a meeting with a lead</div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <div className="font-medium text-gray-900">Update Pipeline</div>
              <div className="text-sm text-gray-500">Move deals through stages</div>
            </motion.button>
          </div>
        </Card>
      </div>
</div>
  );
};

export default Dashboard;