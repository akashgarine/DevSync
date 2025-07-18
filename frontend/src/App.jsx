// App.js

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

// --- Import your components and pages ---
import Sidebar from "./pages/Sidebar"; // Adjust path as needed

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import CodeCollab from "./pages/CodeCollab";
import VideoCall from "./pages/VideoCall";
import Test from "./pages/Test";
import Forums from "./pages/Forums";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ChatBot from "./pages/ChatBot";

// This new component will manage the entire page layout
const AppLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Define paths where the sidebar should not be displayed
  const hideSidebarPaths = ["/", "/signup", "/login"];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  // Calculate the sidebar's width to use as a margin
  const sidebarWidth = isSidebarOpen ? "200px" : "60px";
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );

  // Sync state with localStorage when it changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogin(localStorage.getItem("isLogin") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const ProtectedRoute = ({ children }) => {
    return localStorage.getItem("isLogin") === "true" ? (
      children
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <div className="relative flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      {/* This <main> tag wraps all your page content */}
      <main className="flex-1 w-full transition-all duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/collab"
            element={
              <ProtectedRoute>
                {" "}
                <CodeCollab />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/videoCall" element={<VideoCall />} />
          <Route
            path="/test"
            element={
              <ProtectedRoute>
                {" "}
                <Test />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/forums"
            element={
              <ProtectedRoute>
                {" "}
                <Forums />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {" "}
                <Dashboard />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </main>
    </div>
  );
};

// Your App component now just sets up the Router
const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={2000} />
      <AppLayout />
    </Router>
  );
};

export default App;
