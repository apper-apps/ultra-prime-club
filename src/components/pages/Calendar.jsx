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
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Mock timeline data for company projects
  const mockTimelineItems = [
    {
      Id: 1,
      companyName: "Notion LTD",
      startMonth: 1, // January
      endMonth: 3,   // March
      color: "from-blue-500 to-blue-600"
    },
    {
      Id: 2,
      companyName: "Canva LTD",
      startMonth: 5, // May
      endMonth: 7,   // July
      color: "from-purple-500 to-purple-600"
    },
    {
      Id: 3,
      companyName: "",
      startMonth: 1,
      endMonth: 1,
      color: "from-gray-300 to-gray-400"
    },
    {
      Id: 4,
      companyName: "",
      startMonth: 1,
      endMonth: 1,
      color: "from-gray-300 to-gray-400"
    },
    {
      Id: 5,
      companyName: "",
      startMonth: 1,
      endMonth: 1,
      color: "from-gray-300 to-gray-400"
    },
    {
      Id: 6,
      companyName: "",
      startMonth: 1,
      endMonth: 1,
      color: "from-gray-300 to-gray-400"
    },
    {
      Id: 7,
      companyName: "",
      startMonth: 1,
      endMonth: 1,
      color: "from-gray-300 to-gray-400"
    }
  ];

const loadTimeline = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setTimelineItems(mockTimelineItems);
    } catch (err) {
      setError("Failed to load timeline");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadTimeline();
  }, []);

  const handleTimelineUpdate = (itemId, updates) => {
    setTimelineItems(prev => prev.map(item => 
      item.Id === itemId ? { ...item, ...updates } : item
    ));
    toast.success("Timeline updated");
  };

const getActiveItemsForMonth = (monthIndex) => {
    return timelineItems.filter(item => {
      const start = item.startMonth || 1;
      const end = item.endMonth || 1;
      return monthIndex >= start && monthIndex <= end && item.companyName;
    });
  };

  if (loading) return <Loading />;
if (error) return <Error message={error} onRetry={loadTimeline} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
<div>
          <h1 className="text-3xl font-bold text-gray-900">Project Timeline</h1>
          <p className="text-gray-600 mt-1">Visual timeline of company projects across the year</p>
        </div>
        <Button>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Project
        </Button>
      </div>

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
                      {getActiveItemsForMonth(index + 1).length} projects
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Timeline Rows */}
            <div className="space-y-4">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={item.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="grid grid-cols-12 gap-4 h-16 items-center">
                    <div className="col-span-12 relative">
                      <div className="absolute inset-0 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200" />
                      <TimelineBar
                        item={item}
                        onUpdate={(updates) => handleTimelineUpdate(item.Id, updates)}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Drag timeline bars to reposition them across months</li>
                <li>• Drag the right edge of bars to resize duration</li>
                <li>• Double-click on a bar to edit the company name</li>
                <li>• Empty rows are ready for new projects</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar;