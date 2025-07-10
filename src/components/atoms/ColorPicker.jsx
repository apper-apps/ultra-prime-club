import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const ColorPicker = ({ 
  selectedColor, 
  onColorSelect, 
  onClose, 
  className = "",
  position = "bottom-left" 
}) => {
  const pickerRef = useRef(null);

  const colorOptions = [
    { name: 'Red', value: 'from-red-500 to-red-600' },
    { name: 'Orange', value: 'from-orange-500 to-orange-600' },
    { name: 'Yellow', value: 'from-yellow-500 to-yellow-600' },
    { name: 'Green', value: 'from-green-500 to-green-600' },
    { name: 'Blue', value: 'from-blue-500 to-blue-600' },
    { name: 'Indigo', value: 'from-indigo-500 to-indigo-600' },
    { name: 'Purple', value: 'from-purple-500 to-purple-600' },
    { name: 'Pink', value: 'from-pink-500 to-pink-600' },
    { name: 'Teal', value: 'from-teal-500 to-teal-600' },
    { name: 'Cyan', value: 'from-cyan-500 to-cyan-600' },
    { name: 'Emerald', value: 'from-emerald-500 to-emerald-600' },
    { name: 'Slate', value: 'from-slate-500 to-slate-600' },
  ];

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleColorSelect = (color) => {
    onColorSelect(color.value);
    onClose();
  };

  const handleRemoveColor = () => {
    onColorSelect(null);
    onClose();
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      case 'bottom-left':
      default:
        return 'top-full left-0 mt-2';
    }
  };

  return (
    <motion.div
      ref={pickerRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]",
        getPositionClasses(),
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900">Choose Color</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" size={14} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {colorOptions.map((color) => (
          <button
            key={color.name}
            onClick={() => handleColorSelect(color)}
            className={cn(
              "w-8 h-8 rounded-lg bg-gradient-to-r transition-all duration-200 hover:scale-110 hover:shadow-md",
              color.value,
              selectedColor === color.value && "ring-2 ring-gray-400 ring-offset-2"
            )}
            title={color.name}
          />
        ))}
      </div>

      <div className="border-t border-gray-200 pt-2">
        <button
          onClick={handleRemoveColor}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
        >
          <ApperIcon name="RotateCcw" size={14} />
          Reset to Default
        </button>
      </div>
    </motion.div>
  );
};

export default ColorPicker;