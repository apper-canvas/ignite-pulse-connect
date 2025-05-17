import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';
import { createTask, updateTask } from '../../services/taskService';

// Icons
const XCircle = getIcon('XCircle');
const Clipboard = getIcon('Clipboard');
const Tag = getIcon('Tag');
const Clock = getIcon('Clock');
const Calendar = getIcon('Calendar');
const User = getIcon('User');

function TaskForm({ task, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    Name: task?.Name || '',
    Description: task?.Description || '',
    DueDate: task?.DueDate || '',
    Priority: task?.Priority || 'Medium',
    Status: task?.Status || 'Not Started',
    Tags: task?.Tags || ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Task name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...formData
      };
      
      if (task) {
        // Update existing task
        taskData.Id = task.Id;
        await updateTask(taskData);
        toast.success("Task updated successfully!");
      } else {
        // Create new task
        await createTask(taskData);
        toast.success("Task created successfully!");
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {task ? "Edit Task" : "Add New Task"}
        </h3>
        <button
          onClick={onClose}
          className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
          aria-label="Close form"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="form-label">Task Name *</label>
          <div className="relative">
            <Clipboard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              className={`input-field pl-10 ${errors.Name ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="Enter task name"
            />
          </div>
          {errors.Name && <p className="form-error">{errors.Name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleInputChange}
            className="input-field min-h-[100px]"
            placeholder="Task description (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
              <input
                type="date"
                name="DueDate"
                value={formData.DueDate}
                onChange={handleInputChange}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="Priority"
              value={formData.Priority}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="Status"
              value={formData.Status}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
              <input
                type="text"
                name="Tags"
                value={formData.Tags}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Tags (comma-separated)"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;