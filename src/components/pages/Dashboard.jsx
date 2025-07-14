import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Analytics from "@/components/pages/Analytics";
import Pipeline from "@/components/pages/Pipeline";
import Leads from "@/components/pages/Leads";
import MetricCard from "@/components/molecules/MetricCard";
import { getPendingFollowUps } from "@/services/api/leadsService";
import { 
  getDashboardMetrics, 
  getRecentActivity, 
  getTodaysMeetings,
  getLeadPerformanceChart,
  getTeamPerformanceRankings,
  getRevenueTrendsData,
  getDetailedRecentActivity,
  getUserLeadsReport
} from "@/services/api/dashboardService";
const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState([]);
  const [activity, setActivity] = useState([]);
  const [meetings, setMeetings] = useState([]);
const [pendingFollowUps, setPendingFollowUps] = useState([]);
  const [leadChart, setLeadChart] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [revenueTrends, setRevenueTrends] = useState(null);
const [detailedActivity, setDetailedActivity] = useState([]);
  const [userLeads, setUserLeads] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Missing revenue analytics state
  const [revenueVsGoal, setRevenueVsGoal] = useState(null);
  const [quarterlyRevenue, setQuarterlyRevenue] = useState(null);
  const [topAccounts, setTopAccounts] = useState([]);
  const [topLeadSources, setTopLeadSources] = useState([]);
  const [topLostReasons, setTopLostReasons] = useState([]);
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [
        metricsData, 
        activityData, 
        meetingsData, 
        followUpsData,
        leadChartData,
        teamPerformanceData,
        revenueTrendsData,
        detailedActivityData,
        userLeadsData
      ] = await Promise.all([
        getDashboardMetrics(),
        getRecentActivity(),
        getTodaysMeetings(),
        getPendingFollowUps(),
        getLeadPerformanceChart(),
        getTeamPerformanceRankings(),
        getRevenueTrendsData(),
        getDetailedRecentActivity(),
        getUserLeadsReport(1, selectedPeriod) // Shashank Sharma's ID
      ]);
      
setMetrics(metricsData);
      setActivity(activityData);
      setMeetings(meetingsData);
      setPendingFollowUps(followUpsData);
      setLeadChart(leadChartData);
      setTeamPerformance(teamPerformanceData);
      setRevenueTrends(revenueTrendsData);
      setDetailedActivity(detailedActivityData);
      setUserLeads(userLeadsData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = async (period) => {
    setSelectedPeriod(period);
    try {
      const userLeadsData = await getUserLeadsReport(1, period); // Shashank Sharma's ID
      setUserLeads(userLeadsData);
    } catch (err) {
      console.error("Failed to load user leads:", err);
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
        {metrics.map((metric, index) => <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            trendValue={metric.trendValue}
            color={metric.color}
            delay={index * 0.1} />)}
</div>
    
{/* Revenue Analytics Dashboard */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics 2025</h2>
<div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/revenue-insights')}>
            <ApperIcon name="TrendingUp" size={16} className="mr-2" />
            Insights
          </Button>
          <Button variant="outline" onClick={() => navigate('/analytics')}>
            <ApperIcon name="BarChart3" size={16} className="mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Revenue Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Expected Revenue vs Goal */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Expected Revenue vs Goal</h4>
            <ApperIcon name="Target" size={16} className="text-green-600" />
          </div>
          {revenueVsGoal && (
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${(revenueVsGoal.expected / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-gray-500">of ${(revenueVsGoal.goal / 1000000).toFixed(1)}M goal</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, parseFloat(revenueVsGoal.achievementPercentage))}%` }}
                />
              </div>
              <p className="text-xs text-green-600 mt-1">{revenueVsGoal.achievementPercentage} achieved</p>
            </div>
          )}
        </Card>

        {/* Revenue by Quarter Chart */}
        <Card className="p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Revenue by Quarter</h4>
            <ApperIcon name="BarChart3" size={16} className="text-blue-600" />
          </div>
          {quarterlyRevenue && (
            <Chart
              options={{
                chart: { type: 'bar', height: 160, toolbar: { show: false } },
                colors: ['#3B82F6'],
                dataLabels: { enabled: false },
                plotOptions: { bar: { columnWidth: '60%' } },
                grid: { show: false },
                xaxis: { categories: quarterlyRevenue.categories },
                yaxis: { labels: { formatter: (val) => `$${(val/1000).toFixed(0)}K` } },
                tooltip: { y: { formatter: (val) => `$${(val/1000).toFixed(0)}K` } }
              }}
              series={quarterlyRevenue.series}
              type="bar"
              height={160}
            />
          )}
        </Card>

        {/* Top Earning Accounts */}
        <Card className="p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Top 5 Earning Accounts</h4>
            <ApperIcon name="Building" size={16} className="text-purple-600" />
          </div>
<div className="space-y-2">
            {topAccounts?.slice(0, 5).map((account, index) => (
              <div key={account.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-purple-600">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-900">{account.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  ${(account.revenue / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lead Sources and Lost Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Lead Sources */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Top Lead Sources</h4>
            <ApperIcon name="Users" size={20} className="text-blue-600" />
          </div>
<div className="space-y-3">
            {topLeadSources?.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
<div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${topLeadSources.length > 0 ? (source.count / Math.max(...topLeadSources.map(s => s.count))) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{source.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Lost Reasons */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Top Lost Reasons</h4>
            <ApperIcon name="XCircle" size={20} className="text-red-600" />
          </div>
<div className="space-y-3">
            {topLostReasons?.map((reason, index) => (
              <div key={reason.reason} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-red-600">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-900">{reason.reason}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-600">{reason.count}</span>
                  <span className="text-xs text-gray-500 ml-1">({reason.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
    
    {/* Comprehensive Reports Dashboard */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sales Reports & Analytics</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/website-url-report')}>
            <ApperIcon name="FileText" size={16} className="mr-2" />
            URL Report
          </Button>
          <Button variant="outline" onClick={() => navigate('/analytics')}>
            <ApperIcon name="BarChart3" size={16} className="mr-2" />
            Analytics
          </Button>
        </div>
      </div>

{/* Lead Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lead Performance</h3>
              <p className="text-sm text-gray-600">Daily lead generation trends</p>
            </div>
            <ApperIcon name="TrendingUp" size={20} className="text-primary-600" />
          </div>
          {leadChart && (
            <Chart
              options={{
                chart: { type: 'area', height: 280, toolbar: { show: false } },
                colors: ['#8B5CF6'],
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 3 },
                fill: {
                  type: 'gradient',
                  gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1 }
                },
                grid: { show: true, borderColor: '#E5E7EB' },
                xaxis: { categories: leadChart.categories },
                yaxis: { labels: { formatter: (val) => `${val}` } },
                tooltip: { y: { formatter: (val) => `${val} leads` } }
              }}
              series={leadChart.series}
              type="area"
              height={280}
            />
          )}
        </Card>
      </div>

      {/* Team Performance & Revenue Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
              <p className="text-sm text-gray-600">Top performing sales reps</p>
            </div>
            <ApperIcon name="Users" size={20} className="text-primary-600" />
          </div>
          <div className="space-y-4">
            {teamPerformance.slice(0, 5).map((rep, index) => (
              <div key={rep.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {rep.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{rep.name}</p>
                    <p className="text-xs text-gray-500">{rep.weekLeads} leads this week</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">{rep.totalLeads}</p>
                  <p className="text-xs text-gray-500">total</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
              <p className="text-sm text-gray-600">ARR growth over time</p>
            </div>
            <ApperIcon name="DollarSign" size={20} className="text-primary-600" />
          </div>
          {revenueTrends && (
            <Chart
              options={{
                chart: { type: 'line', height: 280, toolbar: { show: false } },
                colors: ['#10B981'],
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 4 },
                grid: { show: true, borderColor: '#E5E7EB' },
                xaxis: { categories: revenueTrends.categories },
                yaxis: { labels: { formatter: (val) => `$${(val/1000000).toFixed(1)}M` } },
                tooltip: { y: { formatter: (val) => `$${(val/1000000).toFixed(2)}M ARR` } }
              }}
              series={revenueTrends.series}
              type="line"
              height={280}
/>
          )}
        </Card>
      </div>

      {/* Shashank Sharma Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Shashank Sharma</h3>
              <p className="text-sm text-gray-600">Lead performance report</p>
            </div>
            <ApperIcon name="User" size={20} className="text-primary-600" />
          </div>
          
          {/* Time Period Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['today', 'yesterday', 'week', 'month'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => handlePeriodChange(period)}
                className="text-xs"
              >
                {period === 'today' ? 'Today' : 
                 period === 'yesterday' ? 'Yesterday' : 
                 period === 'week' ? 'This Week' : 'This Month'}
              </Button>
            ))}
          </div>
{/* Leads List */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {userLeads?.length > 0 ? userLeads.map((lead, index) => {
              // Map status to badge variant
              const getStatusVariant = (status) => {
                switch (status) {
                  case 'Connected':
                  case 'Meeting Done':
                  case 'Launched on AppSumo':
                  case 'Launched on Prime Club':
                    return 'success';
                  case 'Meeting Booked':
                  case 'Negotiation':
                  case 'Hotlist':
                    return 'warning';
                  case 'Rejected':
                  case 'Unsubscribed':
                  case 'Closed Lost':
                  case 'Out of League':
                    return 'error';
                  default:
                    return 'default';
                }
              };

              return (
                <motion.div
                  key={lead.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
<div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {lead.websiteUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </div>
                    <div className="text-xs text-gray-500">{lead.category}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge 
                      variant={getStatusVariant(lead.status)} 
                      size="sm"
                      className="text-xs"
                    >
                      {lead.status}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="text-center text-gray-500 py-8">
                <ApperIcon name="FileText" size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No leads for selected period</p>
              </div>
            )}
          </div>
        </Card>
      </div>
      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {detailedActivity.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === "meeting" ? "bg-blue-500" : 
                  item.type === "deal" ? "bg-green-500" : "bg-yellow-500"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Follow-ups</h3>
          <div className="space-y-3">
            {pendingFollowUps.length > 0 ? pendingFollowUps.slice(0, 5).map((followUp, index) => (
              <motion.div
                key={followUp.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="flex items-center justify-between">
<div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {followUp.websiteUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </div>
                    <div className="text-xs text-gray-500">{followUp.category}</div>
                  </div>
                  <div className="text-xs font-medium text-primary-600">
                    {new Date(followUp.followUpDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center text-gray-500 py-8">
                <ApperIcon name="Calendar" size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No pending follow-ups</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Meetings Today</h3>
          <div className="space-y-3">
            {meetings.length > 0 ? meetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{meeting.title}</div>
                    <div className="text-xs text-gray-500">{meeting.client}</div>
                  </div>
                  <div className="text-xs font-medium text-primary-600">
                    {meeting.time}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center text-gray-500 py-8">
                <ApperIcon name="Calendar" size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No meetings today</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
</div>
  );
};

export default Dashboard;