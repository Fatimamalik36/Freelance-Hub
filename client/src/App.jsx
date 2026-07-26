import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import BrowseFreelancersPage from "./pages/BrowseFreelancersPage";
import BrowseJobsPage from "./pages/BrowseJobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import FreelancerProfilePage from "./pages/FreelancerProfilePage";

import DashboardPage from "./pages/DashboardPage";
import MyJobsPage from "./pages/MyJobsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import AdminManageJobsPage from "./pages/AdminManageJobsPage";

import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import PostJobPage from "./pages/PostJobPage";
import ApplyJobPage from "./pages/ApplyJobPage";
import PaymentPage from "./pages/PaymentPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.9)",
            color: "#3D2B1F",
            borderRadius: "16px",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/freelancers" element={<BrowseFreelancersPage />} />
        <Route path="/freelancers/:id" element={<FreelancerProfilePage />} />
        <Route path="/jobs" element={<BrowseJobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected: any authenticated user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:jobId"
          element={
            <ProtectedRoute roles={["client"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: client only */}
        <Route
          path="/post-job"
          element={
            <ProtectedRoute roles={["client"]}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jobs"
          element={
            <ProtectedRoute roles={["client"]}>
              <MyJobsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: freelancer only */}
        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute roles={["freelancer"]}>
              <ApplyJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/applications"
          element={
            <ProtectedRoute roles={["freelancer"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/saved-jobs"
          element={
            <ProtectedRoute roles={["freelancer"]}>
              <SavedJobsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected: admin only */}
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manage-jobs"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminManageJobsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
