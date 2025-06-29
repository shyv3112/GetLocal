import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home"
import ChatPage from "./pages/ChatPage"
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCommunityPage from "./pages/admin/AdminCommunityPage"
import AdminEventPage from "./pages/admin/AdminEventPage"
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerBookings from "./pages/worker/WorkerBookings"
import WorkerServices from "./pages/worker/WorkerServices"


import PrivateRoute from "./utils/PrivateRoute"; 

import ResidentPosts from "./pages/resident/ResidentPosts"
import ResidentDashboard from "./pages/resident/ResidentDashboard";
import ResidentServices from "./pages/resident/ResidentServices"
import ResidentBookings from "./pages/resident/ResidentBookings"
import ResidentEvents from "./pages/resident/ResidentEvents"
import CommunityPage from "./pages/CommunityPage"

import Navbar from "./components/Navbar";
import WDetails from "./pages/worker/WDetails";
import RDetails from "./pages/resident/RDetails";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard"

ReactDOM.createRoot(document.getElementById("root")).render(

  <Router>
   
      <Routes>

      <Route path="/super-admin" element={<SuperAdminDashboard/>} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Home/>} />

      <Route path="/chatpage" element={<ChatPage/>} />

      <Route path="/worker-details" element={<WDetails/>} />

      <Route path="/resident-details" element={<RDetails/>} />

      {/* Role-based routes */}
      <Route path="/resident-dashboard" element={
        <PrivateRoute allowedRoles={["Resident"]}>
          <ResidentDashboard />
        </PrivateRoute>
      } />

      <Route path="/resident-posts" element={
        <PrivateRoute allowedRoles={["Resident"]}>
          <ResidentPosts />
        </PrivateRoute>
      } />

      <Route path="/resident-services" element={
        <PrivateRoute allowedRoles={["Resident"]}>
          <ResidentServices />
        </PrivateRoute>
      } />

      <Route path="/community" element={
        <PrivateRoute allowedRoles={["Resident"]}>
          <CommunityPage/>
        </PrivateRoute>
      } />

      <Route path="/resident-bookings" element={
        <PrivateRoute allowedRoles={["Resident"]}>
          <ResidentBookings />
        </PrivateRoute>
      } />
      
      <Route path="/resident-events" element={
        <PrivateRoute allowedRoles={["Resident"]}>
          <ResidentEvents />
        </PrivateRoute>
      } />

      <Route path="/worker-dashboard" element={
        <PrivateRoute allowedRoles={["Worker"]}>
          <WorkerDashboard />
        </PrivateRoute>
      } />

      <Route path="/worker-services" element={
        <PrivateRoute allowedRoles={["Worker"]}>
          <WorkerServices/>
        </PrivateRoute>
      } />

      <Route path="/worker-bookings" element={
        <PrivateRoute allowedRoles={["Worker"]}>
          <WorkerBookings />
        </PrivateRoute>
      } />

      <Route path="/admin" element={
        <PrivateRoute allowedRoles={["Admin"]}>
          <AdminDashboard />
        </PrivateRoute>
      } />

      <Route path="/admin-users" element={
        <PrivateRoute allowedRoles={["Admin"]}>
          <AdminUsers/>
        </PrivateRoute>
      } />

      <Route path="/admin-communities" element={
        <PrivateRoute allowedRoles={["Admin"]}>
          <AdminCommunityPage/>
        </PrivateRoute>
      } />

      <Route path="/admin-events" element={
        <PrivateRoute allowedRoles={["Admin"]}>
          <AdminEventPage/>
        </PrivateRoute>
      } />

    </Routes>
  </Router>
);
