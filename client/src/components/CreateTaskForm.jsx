import React, { useState } from 'react';
import FormInput from './FormInput.jsx';
import PrimaryButton from './PrimaryButton.jsx';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const CreateTaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) {
      return;
    }
    setLoading(true);
    
    const newTask = {
      name: taskName,
      date: dueDate,
    };

    try {
      await onAddTask(newTask);
      setTaskName('');
      setDueDate(getTodayDate());
    } catch (error) {
      console.error("Failed to add task", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Add a New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="taskName"
          label="Task Name"
          type="text"
          placeholder="e.g., Finish project report"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        
        <FormInput
          id="dueDate"
          label="Due Date"
          type="date"
          value={dueDate}
          // --- FIX: Corrected typo "e.g.target.value" to "e.target.value" ---
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div>
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Task'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;