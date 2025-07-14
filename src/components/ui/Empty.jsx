import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FloatingParticle = ({ delay = 0, duration = 3, size = 4 }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-primary-200 to-primary-300 opacity-20"
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionText = "Add New",
  onAction,
  icon = "Database"
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex items-center justify-center min-h-[400px] relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 animate-gradient-pulse">
        {/* Floating Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            duration={3 + Math.random() * 2}
            size={3 + Math.random() * 4}
          />
        ))}
      </div>

      {/* Main Content */}
      <Card className="relative z-10 p-8 text-center max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <motion.div variants={itemVariants} className="mb-6">
          <motion.div
            variants={iconVariants}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.3 }
            }}
            className="relative mx-auto mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full animate-pulse opacity-30"></div>
              <ApperIcon name={icon} size={36} className="text-primary-600 relative z-10" />
            </div>
            {/* Icon glow effect */}
            <div className="absolute inset-0 w-20 h-20 bg-primary-400 rounded-full blur-xl opacity-20 animate-pulse mx-auto"></div>
          </motion.div>
        </motion.div>

        <motion.h3 
          variants={itemVariants}
          className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3"
        >
          {title}
        </motion.h3>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          {description}
        </motion.p>
        
        {onAction && (
          <motion.div variants={itemVariants}>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                onClick={onAction} 
                className="mx-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <ApperIcon name="Plus" size={18} className="mr-2" />
                </motion.div>
                {actionText}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default Empty;