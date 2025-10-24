import React from 'react';
// Import path ko bhi absolute kar rahe hain taaki "Could not resolve" error na aaye
import { formatDate } from '/src/utils/formatDate.js';

/**
 * Task Card Component
 */
const TaskCard = ({ task, onUpdateStatus, onDelete }) => {
  
  // Gets tailwind classes based on status (No Change)
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Not Done':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Gets tailwind classes for the <select> ring color (No Change)
  const getSelectRingClass = (status) => {
    switch (status) {
      case 'Done':
        return 'focus:ring-green-500';
      case 'Pending':
        return 'focus:ring-yellow-500';
      case 'Not Done':
        return 'focus:ring-red-500';
      default:
        return 'focus:ring-blue-500';
    }
  }

  return (
    <div className="relative flex flex-col justify-between p-6 bg-white rounded-lg shadow-md">
      
      {/* --- FIX 1: task.id -> task._id --- */}
      <button
        onClick={() => onDelete(task._id)}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Task Info (No Change) */}
      <div className="pr-8">
        <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
        <p className="mt-1 text-sm text-gray-600">
          Due: {formatDate(task.date)}
        </p>
      </div>

      {/* --- FIX 2, 3, 4: task.id -> task._id --- */}
      <div className="mt-4">
        <label htmlFor={`status-${task._id}`} className="sr-only">Task Status</label>
        <select
          id={`status-${task._id}`}
          value={task.status}
          onChange={(e) => onUpdateStatus(task._id, e.target.value)}
          className={`text-xs font-medium rounded-full border px-3 py-1 focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusClasses(task.status)} ${getSelectRingClass(task.status)}`}
        >
          <option value="Pending">Pending</option>
          <option value="Not Done">Not Done</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;

