import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icons
const Home = getIcon('Home');
const Search = getIcon('Search');

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h1 className="text-6xl sm:text-8xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/"
            className="btn btn-primary flex items-center justify-center w-full sm:w-auto"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <button 
            className="btn bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 flex items-center justify-center w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;