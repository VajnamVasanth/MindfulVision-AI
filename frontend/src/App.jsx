import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Practice from './pages/Practice';
import PoseLibrary from './pages/PoseLibrary';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PageTransition from './components/layout/PageTransition';
import LoadingSpinner from './components/ui/LoadingSpinner';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/practice" element={<PageTransition><Practice /></PageTransition>} />
        <Route path="/poses" element={<PageTransition><PoseLibrary /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

export default App
