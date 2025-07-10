import { useState, useRef } from "react";
import { motion } from "framer-motion";

const TimelineBar = ({ item, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const barRef = useRef(null);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(item.companyName || "");
  };

  const handleEditSubmit = () => {
    if (editValue.trim()) {
      onUpdate({ companyName: editValue.trim() });
    }
    setIsEditing(false);
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue("");
    }
  };

const handleMouseDown = (e) => {
    if (e.target.classList.contains("resize-handle")) {
      setIsResizing(true);
    } else if (!isEditing) {
      setIsDragging(true);
    }
  };

  const startMonth = item.startMonth || 1;
  const endMonth = item.endMonth || 1;
  const duration = endMonth - startMonth + 1;
  const leftPosition = ((startMonth - 1) / 12) * 100;
  const width = (duration / 12) * 100;

  // Don't render if no company name and it's an empty placeholder
  if (!item.companyName && item.color === "from-gray-300 to-gray-400") {
    return null;
  }

return (
    <motion.div
      ref={barRef}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.3 }}
      className={`absolute top-0 h-full rounded-lg bg-gradient-to-r ${item.color} 
        shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 group
        ${isDragging ? "ring-2 ring-primary-400 ring-opacity-60" : "hover:shadow-xl"}
        ${isResizing ? "ring-2 ring-blue-400 ring-opacity-60" : ""}
        ${isEditing ? "ring-2 ring-green-400 ring-opacity-60" : ""}
      `}
      style={{
        left: `${leftPosition}%`,
        width: `${width}%`,
        minWidth: "120px"
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
>
      <div className="h-full flex items-center justify-between px-3 text-white text-sm font-medium">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyPress={handleEditKeyPress}
              className="bg-white text-gray-900 px-2 py-1 rounded text-sm font-semibold w-full"
              autoFocus
            />
          ) : (
            <div className="truncate font-semibold">
              {item.companyName || "Double-click to edit"}
            </div>
          )}
          <div className="text-xs opacity-90">
            {months[startMonth - 1]} - {months[endMonth - 1]}
          </div>
        </div>
        
        {/* Resize handle */}
        <div className="resize-handle w-2 h-full bg-white bg-opacity-30 rounded-r-lg cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Tooltip */}
      {!isEditing && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="font-semibold">{item.companyName || "Unnamed Project"}</div>
          <div>{months[startMonth - 1]} - {months[endMonth - 1]}</div>
          <div className="text-xs opacity-75">Double-click to edit</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </motion.div>
  );
};

export default TimelineBar;