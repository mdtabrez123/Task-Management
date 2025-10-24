import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// --- YEH HAI IMPORT FIX ---
// Humne absolute paths ('/src/...') ko wapas relative paths ('../') se badal diya hai
// Taaki file sahi se mil sake.
import { useAuth } from '../context/AuthContext.jsx';
import TaskCard from '../components/TaskCard.jsx';
import CreateTaskForm from '../components/CreateTaskForm.jsx';
// --- END IMPORT FIX ---

const API_BASE_URL = 'http://localhost:5000';

const HomePage = () => {
  // State khaali array se shuru ho rahi hai (Bilkul sahi)
  const [tasks, setTasks] = useState([]); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, logout, authHeader } = useAuth();
  const navigate = useNavigate();

  // useEffect se data fetch ho raha hai (Bilkul sahi)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE_URL}/api/tasks`, {
          headers: authHeader(),
        });
        
        if (!response.ok) {
          if(response.status === 401) {
             logout(); 
             navigate('/login');
          }
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setTasks(sortedData); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [authHeader, navigate, logout]);

  // handleLogout function (Bilkul sahi)
  const handleLogout = () => {
    try {
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  // handleAddTask function (Bilkul sahi)
  const handleAddTask = async (newTaskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(newTaskData),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      const createdTask = await response.json();
      setTasks([createdTask, ...tasks]);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- YEH HAI NAYA UPDATE FUNCTION (DEBUGGING KE SAATH) ---
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    
    // Debugging ke liye console log
    console.log(`UPDATE FUNTION CALLED`);
    console.log(`Task ID: ${taskId}`);
    console.log(`New Status: ${newStatus}`);
    
    // Safety Check (Bilkul sahi)
    if (!taskId) {
      console.error("Update attempt with undefined taskId was prevented.");
      return; 
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ status: newStatus }),
      });

      // Response ko text mein padhein (error dekhne ke liye)
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        // Agar response OK nahin hai, toh error throw karein
        throw new Error(`Failed to update task. Server says: ${responseText}`);
      }
      
      // Agar response OK hai, toh JSON parse karein
      const updatedTask = JSON.parse(responseText);
      console.log('Task updated successfully:', updatedTask);
      
      // UI (frontend) turant update ho jaayega
      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));

    } catch (err) {
      // Error ko console mein dikhayein
      console.error('ERROR in handleUpdateTaskStatus:', err);
      setError(err.message); // Error ko UI par bhi dikhayein
    }
  };
  // --- END NAYA UPDATE FUNCTION ---

  // handleDeleteTask function (Bilkul sahi)
  const handleDeleteTask = async (taskId) => {
    if (!taskId) {
      console.error("Delete attempt with undefined taskId was prevented.");
      return; 
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: authHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };
  
  // renderContent function (Bilkul sahi)
  const renderContent = () => {
    if (loading) {
      return <div className="mt-8 text-center text-gray-500">Loading tasks...</div>;
    }
    // Agar koi error hai, toh use UI par dikhayein
    if (error) {
      return <div className="mt-8 text-center text-red-500">Error: {error}</div>;
    }
    if (tasks.length === 0) {
      return (
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-500">You have no tasks. Add one above to get started!</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id} 
            task={task}
            onUpdateStatus={handleUpdateTaskStatus}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    );
  };

  // Return (bilkul sahi, onClick fix ke saath)
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">TaskFlow</span>
            </div>
            <div className="flex items-center">
              <span className="hidden sm:inline-block mr-4 text-sm text-gray-70g0">
                Welcome, {currentUser.name || currentUser.email}
              </span>
              <button
                onClick={handleLogout} // 'onClick' bilkul sahi hai
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        <CreateTaskForm onAddTask={handleAddTask} />

        <div className="pb-6 mt-12 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default HomePage;

