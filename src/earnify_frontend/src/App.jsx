import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import CreateJob from './pages/CreateJob';
import Profile from './pages/Profile';
import Bounties from './pages/Bounties';
import BountyDetail from './pages/BountyDetail';
import CreateBounty from './pages/CreateBounty';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
        <Route path="/jobs/:id" element={<Layout><JobDetail /></Layout>} />
        <Route path="/jobs/create" element={
          <PrivateRoute>
            <Layout><CreateJob /></Layout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Layout><Profile /></Layout>
          </PrivateRoute>
        } />
        <Route path="/bounties" element={<Layout><Bounties /></Layout>} />
        <Route path="/bounties/:id" element={<Layout><BountyDetail /></Layout>} />
        <Route path="/bounties/create" element={
          <PrivateRoute>
            <Layout><CreateBounty /></Layout>
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        } />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </div>
  );
}

export default App;
