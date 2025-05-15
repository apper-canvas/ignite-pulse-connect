import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Get icons
const Sun = getIcon('Sun');
const Moon = getIcon('Moon');

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <header className="fixed top-0 right-0 p-4 z-50">
        <motion.button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-300 dark:hover:bg-surface-700 transition-all duration-300"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="!bg-surface-100 dark:!bg-surface-800 !text-surface-700 dark:!text-surface-200 !rounded-xl !shadow-card"
      />
    </div>
  );
}

export default App;