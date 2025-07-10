import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getSalesReps } from "@/services/api/salesRepService";

const Leaderboard = () => {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSalesReps = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await getSalesReps();
      // Sort by total performance score
      const sortedReps = data.sort((a, b) => {
        const scoreA = a.dealsClosed * 3 + a.meetingsBooked * 2 + a.leadsContacted;
        const scoreB = b.dealsClosed * 3 + b.meetingsBooked * 2 + b.leadsContacted;
        return scoreB - scoreA;
      });
      setSalesReps(sortedReps);
    } catch (err) {
      setError("Failed to load sales reps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesReps();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPerformanceTier = (rank) => {
    switch (rank) {
      case 1:
        return {
          tier: "Gold",
          color: "from-accent-400 to-accent-600",
          textColor: "text-accent-700",
          bgColor: "bg-gradient-to-r from-accent-50 to-accent-100",
          icon: "Crown"
        };
      case 2:
        return {
          tier: "Silver",
          color: "from-gray-400 to-gray-600",
          textColor: "text-gray-700",
          bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
          icon: "Medal"
        };
      case 3:
        return {
          tier: "Bronze",
          color: "from-primary-400 to-primary-600",
          textColor: "text-primary-700",
          bgColor: "bg-gradient-to-r from-primary-50 to-primary-100",
          icon: "Award"
        };
      default:
        return {
          tier: "Performer",
          color: "from-gray-300 to-gray-500",
          textColor: "text-gray-600",
          bgColor: "bg-gradient-to-r from-gray-25 to-gray-50",
          icon: "User"
        };
    }
  };

  const calculateProgress = (value, max) => {
    return Math.min((value / max) * 100, 100);
  };

  const getMaxValues = () => {
    if (salesReps.length === 0) return { leads: 0, meetings: 0, deals: 0, revenue: 0 };
    
    return {
      leads: Math.max(...salesReps.map(rep => rep.leadsContacted)),
      meetings: Math.max(...salesReps.map(rep => rep.meetingsBooked)),
      deals: Math.max(...salesReps.map(rep => rep.dealsClosed)),
      revenue: Math.max(...salesReps.map(rep => rep.totalRevenue))
    };
  };

  const maxValues = getMaxValues();

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadSalesReps} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Performance Leaderboard</h1>
        <p className="text-gray-600">Celebrating excellence and driving success</p>
      </div>

      {salesReps.length === 0 ? (
        <Empty
          title="No sales reps found"
          description="Add sales representatives to see the leaderboard"
          actionText="Add Rep"
          icon="Trophy"
        />
      ) : (
        <div className="space-y-8">
          {/* Champion Spotlight */}
          {salesReps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-3"></div>
                <div className="relative p-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                    <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Avatar name={salesReps[0].name} size="xl" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                          <ApperIcon name="Crown" size={20} className="text-white" />
                        </div>
                      </div>
                      <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                          <ApperIcon name="Trophy" size={24} className="text-yellow-300" />
                          <h2 className="text-2xl font-bold">Champion of the Month</h2>
                        </div>
                        <p className="text-3xl font-bold mb-2">{salesReps[0].name}</p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                          <span className="bg-white/20 px-3 py-1 rounded-full">
                            🎯 {salesReps[0].dealsClosed} deals closed
                          </span>
                          <span className="bg-white/20 px-3 py-1 rounded-full">
                            💰 {formatCurrency(salesReps[0].totalRevenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">
                        {salesReps[0].dealsClosed * 3 + salesReps[0].meetingsBooked * 2 + salesReps[0].leadsContacted}
                      </div>
                      <div className="text-xl opacity-90">Performance Score</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Performance Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesReps.map((rep, index) => {
              const rank = index + 1;
              const score = rep.dealsClosed * 3 + rep.meetingsBooked * 2 + rep.leadsContacted;
              const tier = getPerformanceTier(rank);
              
              return (
                <motion.div
                  key={rep.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className={`relative overflow-hidden ${tier.bgColor} border-2 border-transparent group-hover:border-primary-200 transition-all duration-300`}>
                    {/* Rank Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {rank}
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center space-x-4 mb-6">
                        <Avatar name={rep.name} size="lg" />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{rep.name}</h3>
                          <div className="flex items-center space-x-2">
                            <ApperIcon name={tier.icon} size={16} className={tier.textColor} />
                            <span className={`text-sm font-medium ${tier.textColor}`}>
                              {tier.tier} Tier
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="space-y-4">
                        {/* Leads */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Leads Contacted</span>
                            <span className="text-sm font-bold text-primary-600">{rep.leadsContacted}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${calculateProgress(rep.leadsContacted, maxValues.leads)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Meetings */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Meetings Booked</span>
                            <span className="text-sm font-bold text-info-600">{rep.meetingsBooked}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-info-400 to-info-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${calculateProgress(rep.meetingsBooked, maxValues.meetings)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Deals */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Deals Closed</span>
                            <span className="text-sm font-bold text-success-600">{rep.dealsClosed}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-success-400 to-success-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${calculateProgress(rep.dealsClosed, maxValues.deals)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Revenue */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Revenue</span>
                            <span className="text-sm font-bold text-accent-600">{formatCurrency(rep.totalRevenue)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${calculateProgress(rep.totalRevenue, maxValues.revenue)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Score */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Performance Score</span>
                          <span className="text-2xl font-bold text-primary-600">{score}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ApperIcon name="Users" size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Leads</h3>
              <p className="text-4xl font-bold text-primary-600 mb-2">
                {salesReps.reduce((sum, rep) => sum + rep.leadsContacted, 0)}
              </p>
              <p className="text-sm text-gray-600">Across all reps</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-info-50 to-info-100 border-info-200">
              <div className="w-16 h-16 bg-gradient-to-r from-info-500 to-info-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ApperIcon name="Calendar" size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Meetings</h3>
              <p className="text-4xl font-bold text-info-600 mb-2">
                {salesReps.reduce((sum, rep) => sum + rep.meetingsBooked, 0)}
              </p>
              <p className="text-sm text-gray-600">Scheduled & completed</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-success-50 to-success-100 border-success-200">
              <div className="w-16 h-16 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ApperIcon name="CheckCircle" size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Deals</h3>
              <p className="text-4xl font-bold text-success-600 mb-2">
                {salesReps.reduce((sum, rep) => sum + rep.dealsClosed, 0)}
              </p>
              <p className="text-sm text-gray-600">Successfully closed</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ApperIcon name="DollarSign" size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
              <p className="text-4xl font-bold text-accent-600 mb-2">
                {formatCurrency(salesReps.reduce((sum, rep) => sum + rep.totalRevenue, 0))}
              </p>
              <p className="text-sm text-gray-600">Team performance</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;