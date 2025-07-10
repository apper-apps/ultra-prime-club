import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Leads from "@/components/pages/Leads";
import Contacts from "@/components/pages/Contacts";
import Pipeline from "@/components/pages/Pipeline";
import Calendar from "@/components/pages/Calendar";
import Leaderboard from "@/components/pages/Leaderboard";

function App() {
  return (
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
        <Route path="/contacts" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Contacts />
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
  );
}

export default App;