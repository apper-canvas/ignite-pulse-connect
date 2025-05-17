import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../../utils/iconUtils';
import { updateTask, deleteTask } from '../../services/taskService';

// Icons
const LoadingSpinner = getIcon('Loader');
const Edit2 = getIcon('Edit2');
const Trash2 = getIcon('Trash2');
const Clock = getIcon('Clock');
const CheckCircle = getIcon('CheckCircle');
const AlertCircle = getIcon('AlertCircle');
const Tag = getIcon('Tag');

function TaskCard({ task, onEdit, onTasksChange }) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Format date if available
  const formattedDate = task.DueDate ? 
    format(new Date(task.DueDate), 'MMM d, yyyy') : 
    'No due date';

  // Determine priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Medium': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-300';
    }
  };

  // Determine status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-300';
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsProcessing(true);
    try {
      await updateTask({
        Id: task.Id,
        Status: newStatus
      });
      toast.success(`Task marked as ${newStatus}`);
      onTasksChange();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsProcessing(true);
      try {
        await deleteTask(task.Id);
        toast.info("Task deleted successfully");
        onTasksChange();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <motion.div
      className="card-neu group transition-all duration-300 hover:translate-y-[-4px]"
      whileHover={{ scale: 1.01 }}
      layout
    >
      {isProcessing && (
        <div className="absolute inset-0 bg-white/50 dark:bg-surface-800/50 flex items-center justify-center rounded-xl z-10">
          <LoadingSpinner className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.Status)}`}>
          {task.Status}
        </div>
        
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-full text-surface-500 hover:text-primary hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
            aria-label="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDeleteTask}
            className="p-1.5 rounded-full text-surface-500 hover:text-red-500 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{task.Name}</h3>
      
      {task.Description && (
        <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
          {task.Description.length > 100 
            ? `${task.Description.substring(0, 100)}...` 
            : task.Description}
        </p>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
          <Clock className="w-3.5 h-3.5 mr-1" />
          <span>{formattedDate}</span>
        </div>
        
        <div className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.Priority)}`}>
          {task.Priority}
        </div>
      </div>
      
      {task.Tags && (
        <div className="flex flex-wrap gap-1 mt-3">
          {task.Tags.split(',').map((tag, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 text-xs rounded-full bg-primary-light/20 dark:bg-primary-dark/30 text-primary-dark dark:text-primary-light"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
      
      {task.Status !== 'Completed' ? (
        <button
          onClick={() => handleStatusChange('Completed')}
          className="w-full mt-4 flex items-center justify-center py-2 text-sm font-medium text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as Complete
        </button>
      ) : (
        <button
          onClick={() => handleStatusChange('In Progress')}
          className="w-full mt-4 flex items-center justify-center py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Reopen Task
        </button>
      )}
    </motion.div>
  );
}

export default TaskCard;