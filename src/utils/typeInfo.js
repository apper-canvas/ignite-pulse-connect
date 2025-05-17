/**
 * Type information for application entities
 * Provides metadata about different types used throughout the application
 */

// Import any needed dependencies
import getIcon from './iconUtils';

// Define TypeInfo object with metadata for each entity type
const TypeInfo = {
  contact: {
    name: 'contact',
    label: 'Contact',
    pluralLabel: 'Contacts',
    icon: getIcon('User'),
    route: '/contacts',
    color: 'primary'
  },
  client: {
    name: 'client',
    label: 'Client',
    pluralLabel: 'Clients',
    icon: getIcon('UserPlus'),
    route: '/clients',
    color: 'secondary'
  },
  deal: {
    name: 'deal',
    label: 'Deal',
    pluralLabel: 'Deals',
    icon: getIcon('BarChart'),
    route: '/deals',
    color: 'accent'
  },
  tasks: {
    name: 'task', 
    label: 'Task',
    pluralLabel: 'Tasks',
    icon: getIcon('ListTodo'),
    route: '/tasks',
    color: 'primary'
  }
};

export default TypeInfo;