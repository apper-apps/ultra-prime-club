import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import MetricCard from "@/components/molecules/MetricCard";
import {
  getRevenueOverview,
  getAverageSalesCycle,
  getAverageDealValue,
  getDealsWonCount,
  getNewOpportunities,
  getRevenueTrendsChart,
  getFunnelProgressionChart
} from "@/services/api/revenueInsightsService";

const RevenueInsights = () => {
  const [revenueOverview, setRevenueOverview] = useState(null);
  const [salesCycle, setSalesCycle] = useState(null);
  const [dealValue, setDealValue] = useState(null);
  const [dealsWon, setDealsWon] = useState(null);
  const [newOpportunities, setNewOpportunities] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState(null);
  const [funnelProgression, setFunnelProgression] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [
        revenueData,
        salesCycleData,
        dealValueData,
        dealsWonData,
        newOppsData,
        trendsData,
        funnelData
      ] = await Promise.all([
        getRevenueOverview(),
        getAverageSalesCycle(),
        getAverageDealValue(),
        getDealsWonCount(),
        getNewOpportunities(),
        getRevenueTrendsChart(),
        getFunnelProgressionChart()
      ]);
      
      setRevenueOverview(revenueData);
      setSalesCycle(salesCycleData);
      setDealValue(dealValueData);
      setDealsWon(dealsWonData);
      setNewOpportunities(newOppsData);
      setRevenueTrends(trendsData);
      setFunnelProgression(funnelData);
    } catch (err) {
      setError("Failed to load revenue insights data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenueData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadRevenueData} />;

  return (
    <div className="space-y-8">
<div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
          <p className="text-gray-600 mt-1">Track sales performance, lead generation, and funnel progression for 2025.</p>
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {revenueOverview && (
          <MetricCard
            title="Total Revenue"
            value={revenueOverview.value}
            icon="DollarSign"
            trend={revenueOverview.trend}
            trendValue={revenueOverview.trendValue}
            color="success"
            delay={0}
          />
        )}
        {salesCycle && (
          <MetricCard
            title="Avg Sales Cycle"
            value={salesCycle.value}
            icon="Clock"
            trend={salesCycle.trend}
            trendValue={salesCycle.trendValue}
            color="info"
            delay={0.1}
          />
        )}
        {dealValue && (
          <MetricCard
            title="Avg Deal Value"
            value={dealValue.value}
            icon="TrendingUp"
            trend={dealValue.trend}
            trendValue={dealValue.trendValue}
            color="primary"
            delay={0.2}
          />
        )}
        {dealsWon && (
          <MetricCard
            title="Deals Won"
            value={dealsWon.value}
            icon="Trophy"
            trend={dealsWon.trend}
            trendValue={dealsWon.trendValue}
            color="success"
            delay={0.3}
          />
        )}
        {newOpportunities && (
          <MetricCard
            title="New Opportunities"
            value={newOpportunities.value}
            icon="Target"
            trend={newOpportunities.trend}
            trendValue={newOpportunities.trendValue}
            color="warning"
            delay={0.4}
          />
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
              <p className="text-sm text-gray-600">Monthly revenue progression for 2025</p>
            </div>
            <ApperIcon name="BarChart3" size={20} className="text-primary-600" />
          </div>
          {revenueTrends && (
            <Chart
              options={{
                chart: { type: 'area', height: 320, toolbar: { show: false } },
                colors: ['#10B981'],
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 3 },
                fill: {
                  type: 'gradient',
                  gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1 }
                },
                grid: { show: true, borderColor: '#E5E7EB' },
                xaxis: { categories: revenueTrends.categories },
                yaxis: { labels: { formatter: (val) => `$${(val/1000).toFixed(0)}K` } },
                tooltip: { y: { formatter: (val) => `$${val.toLocaleString()}` } }
              }}
              series={revenueTrends.series}
              type="area"
              height={320}
            />
          )}
        </Card>

        {/* Sales Funnel Progression */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales Funnel</h3>
              <p className="text-sm text-gray-600">Opportunity progression through stages</p>
            </div>
            <ApperIcon name="Filter" size={20} className="text-primary-600" />
          </div>
          {funnelProgression && (
            <Chart
              options={{
                chart: { type: 'bar', height: 320, toolbar: { show: false } },
                colors: ['#8B5CF6'],
                dataLabels: { enabled: false },
                plotOptions: {
                  bar: { horizontal: true, barHeight: '70%' }
                },
                grid: { show: true, borderColor: '#E5E7EB' },
                xaxis: { categories: funnelProgression.categories },
                yaxis: { labels: { formatter: (val) => `${val}` } },
                tooltip: { y: { formatter: (val) => `${val} deals` } }
              }}
              series={funnelProgression.series}
              type="bar"
              height={320}
            />
          )}
        </Card>
      </div>

      {/* Detailed Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Cycle Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Cycle Analysis</h3>
            <ApperIcon name="Clock" size={20} className="text-primary-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Days</span>
              <span className="font-semibold text-gray-900">{salesCycle?.avgDays || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Shortest Cycle</span>
              <span className="font-semibold text-green-600">{salesCycle?.shortest || 'N/A'} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Longest Cycle</span>
              <span className="font-semibold text-red-600">{salesCycle?.longest || 'N/A'} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">vs Previous Year</span>
              <span className={`font-semibold ${salesCycle?.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                {salesCycle?.trendValue || 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        {/* Deal Value Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Deal Value Metrics</h3>
            <ApperIcon name="DollarSign" size={20} className="text-primary-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Deal</span>
              <span className="font-semibold text-gray-900">{dealValue?.avgValue || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Highest Deal</span>
              <span className="font-semibold text-green-600">{dealValue?.highest || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lowest Deal</span>
              <span className="font-semibold text-gray-600">{dealValue?.lowest || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">vs Previous Year</span>
              <span className={`font-semibold ${dealValue?.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {dealValue?.trendValue || 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        {/* Opportunity Pipeline */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pipeline Health</h3>
            <ApperIcon name="Target" size={20} className="text-primary-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Opportunities</span>
              <span className="font-semibold text-gray-900">{newOpportunities?.total || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New This Month</span>
              <span className="font-semibold text-blue-600">{newOpportunities?.thisMonth || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="font-semibold text-green-600">{newOpportunities?.conversionRate || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">vs Previous Year</span>
              <span className={`font-semibold ${newOpportunities?.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {newOpportunities?.trendValue || 'N/A'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RevenueInsights;