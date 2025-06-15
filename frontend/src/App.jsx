import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import ApplyForm from './pages/ApplyForm';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import PostNewJob from './pages/admin/PostNewJob';
import ViewApplications from './pages/admin/ViewApplications';
import ManageUsers from './pages/admin/ManageUsers';
import ScheduleInterview from './pages/admin/ScheduleInterview';
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import RecruiterRoute from './components/recruiter/RecruiterRoute';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/layout/AdminLayout';

// Layout component that includes Navbar and Footer
const Layout = ({ children }) => {
  return (  
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Protected Route Component for regular users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          {/* Admin Login route without layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* All other routes with layout */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/jobs" element={
            <Layout>
              <JobListings />
            </Layout>
          } />
          <Route path="/jobs/:id" element={
            <Layout>
              <JobDetails />
            </Layout>
          } />
          <Route path="/apply/:id" element={
            <Layout>
              <ProtectedRoute>
                <ApplyForm />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/login" element={
            <Layout>
              <Login />
            </Layout>
          } />
          <Route path="/register" element={
            <Layout>
              <Register />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            </Layout>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/profile" element={
            <AdminRoute>
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/post-job" element={
            <AdminRoute>
              <AdminLayout>
                <PostNewJob />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/applications" element={
            <AdminRoute>
              <AdminLayout>
                <ViewApplications />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminLayout>
                <ManageUsers />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/schedule-interview" element={
            <AdminRoute>
              <AdminLayout>
                <ScheduleInterview />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route element={<RecruiterRoute />}>
            <Route path="/recruiter/*" element={<RecruiterDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;