import { Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import React, { Component } from "react";
import Layout from "@/components/organisms/Layout";
import Leaderboard from "@/components/pages/Leaderboard";
import Calendar from "@/components/pages/Calendar";
import Analytics from "@/components/pages/Analytics";
import Pipeline from "@/components/pages/Pipeline";
import Dashboard from "@/components/pages/Dashboard";
import Leads from "@/components/pages/Leads";

// Error boundary to handle external script errors (like canvas viewport capture)
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log canvas and viewport errors from external scripts
    if (error.message?.includes('canvas') || error.message?.includes('viewport')) {
      console.warn('External script canvas error caught:', error.message);
      return;
    }
    console.error('App error:', error, errorInfo);
  }

render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Let's get you back on track!</h2>
              <p className="text-gray-600 mb-6">
                Something unexpected happened, but we can fix this together.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Refresh & Continue
              </button>
            </div>
          </div>
        </Layout>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </motion.div>
          } />
          <Route path="/leads" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Leads />
            </motion.div>
          } />
          <Route path="/pipeline" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Pipeline />
            </motion.div>
          } />
          <Route path="/calendar" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Calendar />
            </motion.div>
          } />
          <Route path="/analytics" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Analytics />
            </motion.div>
          } />
          <Route path="/leaderboard" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard />
            </motion.div>
          } />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;