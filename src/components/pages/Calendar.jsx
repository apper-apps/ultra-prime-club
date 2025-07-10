import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import TimelineBar from "@/components/molecules/TimelineBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getDeals } from "@/services/api/dealsService";

const Calendar = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await getDeals();
      setDeals(data);
    } catch (err) {
      setError("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleDealUpdate = (dealId, updates) => {
    setDeals(prev => prev.map(deal => 
      deal.Id === dealId ? { ...deal, ...updates } : deal
    ));
    toast.success("Deal timeline updated");
  };

  const getDealsForMonth = (monthIndex) => {
    return deals.filter(deal => {
      const start = deal.startMonth || 1;
      const end = deal.endMonth || 3;
      return monthIndex >= start && monthIndex <= end;
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDeals} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar Timeline</h1>
          <p className="text-gray-600 mt-1">Visual timeline of your deals across the year</p>
        </div>
        <Button>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Deal
        </Button>
      </div>

      {deals.length === 0 ? (
        <Empty
          title="No deals found"
          description="Start by adding deals to see them on the timeline"
          actionText="Add Deal"
          icon="Calendar"
        />
      ) : (
        <Card className="p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Month Headers */}
              <div className="grid grid-cols-12 gap-4 mb-6">
                {months.map((month, index) => (
                  <motion.div
                    key={month}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-center"
                  >
                    <div className="bg-gray-100 rounded-lg p-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{month}</h3>
                      <p className="text-sm text-gray-500">
                        {getDealsForMonth(index + 1).length} deals
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {deals.map((deal, index) => (
                  <motion.div
                    key={deal.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="grid grid-cols-12 gap-4 h-16 items-center">
                      <div className="col-span-12 relative">
                        <div className="absolute inset-0 bg-gray-100 rounded-lg" />
                        <TimelineBar
                          deal={deal}
                          onUpdate={(updates) => handleDealUpdate(deal.Id, updates)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded mr-2" />
                    <span className="text-sm text-gray-600">$100K+</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded mr-2" />
                    <span className="text-sm text-gray-600">$50K - $100K</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded mr-2" />
                    <span className="text-sm text-gray-600">$25K - $50K</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-gray-500 to-gray-600 rounded mr-2" />
                    <span className="text-sm text-gray-600">Under $25K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Calendar;