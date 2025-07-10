import { motion } from "framer-motion";

const DealBar = ({ deal, maxValue, monthIndex }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getBarColor = (value) => {
    if (value >= 100000) return "from-green-500 to-green-600";
    if (value >= 50000) return "from-blue-500 to-blue-600";
    if (value >= 25000) return "from-yellow-500 to-yellow-600";
    return "from-gray-500 to-gray-600";
  };

  const height = (deal.value / maxValue) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ delay: monthIndex * 0.1, duration: 0.5 }}
      className="relative group cursor-pointer"
    >
      <div
        className={`w-full rounded-t-lg bg-gradient-to-t ${getBarColor(deal.value)} 
          shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105
          min-h-[20px] flex items-end justify-center pb-2`}
        style={{ height: `${Math.max(height, 10)}%` }}
      >
        <div className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          {formatCurrency(deal.value)}
        </div>
      </div>
      
      <div className="mt-1 text-xs text-gray-600 truncate px-1">
        {deal.name}
      </div>
      
      {/* Enhanced Tooltip */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
        <div className="font-semibold">{deal.name}</div>
        <div className="text-gray-300">{deal.leadName}</div>
        <div className="text-green-300">{formatCurrency(deal.value)}</div>
        <div className="text-gray-300">Stage: {deal.stage}</div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </motion.div>
  );
};

export default DealBar;