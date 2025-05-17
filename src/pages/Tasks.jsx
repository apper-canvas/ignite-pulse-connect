import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { fetchTasks } from '../services/taskService';

// Icons
const ListTodo = getIcon('ListTodo');
const LoadingSpinner = getIcon('Loader');

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useSelector((state) => state.user);

  // Fetch tasks when component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-content"
      >
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title flex items-center">
              <ListTodo className="mr-3 text-primary" />
              Task Management
            </h1>
            <p className="dashboard-subtitle">
              Create, organize, and track your tasks efficiently
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <TaskList tasks={tasks} onTasksChange={loadTasks} />
        )}
      </motion.div>
    </div>
  );
}

export default Tasks;