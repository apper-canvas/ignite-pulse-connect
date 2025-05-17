import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

// Icons
const Search = getIcon('Search');
const PlusCircle = getIcon('PlusCircle');
const FilterIcon = getIcon('Filter');
const LoadingSpinner = getIcon('Loader');

function TaskList({ tasks, onTasksChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter tasks based on search query and status filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.Name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    const isCompleted = task.Status === 'Completed';
    return matchesSearch && (
      (filterStatus === 'completed' && isCompleted) ||
      (filterStatus === 'active' && !isCompleted)
    );
  });

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setSelectedTask(null);
    setShowAddForm(false);
  };

  const handleFormSubmit = () => {
    setSelectedTask(null);
    setShowAddForm(false);
    onTasksChange();
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {showAddForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TaskForm 
              task={selectedTask}
              onClose={handleFormClose}
              onSubmit={handleFormSubmit}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="input-field pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FilterIcon className="text-surface-500" size={16} />
                  <select
                    className="input-field py-1 text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn btn-primary flex items-center"
                  onClick={() => setShowAddForm(true)}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  <span>Add Task</span>
                </motion.button>
              </div>
            </div>

            {isProcessing && (
              <div className="flex justify-center items-center py-4">
                <LoadingSpinner className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-2 text-surface-600 dark:text-surface-400">Processing...</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <TaskCard key={task.Id} task={task} onEdit={handleTaskEdit} onTasksChange={onTasksChange} />
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                  <p className="text-surface-500 dark:text-surface-400 mb-4">
                    {searchQuery ? "No tasks match your search" : "No tasks found"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TaskList;