import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure toast styles are loaded
import CodeCollab from "./pages/CodeCollab";
import Test from "./pages/Test";
import Home from "./pages/Home";
import Forums from "./pages/Forums";
import Auth from "./pages/Auth";
import NavBar from "./pages/NavBar";
import Sidebar from "./pages/SideBar";
import ChatBot from "./pages/ChatBot";
import NotFound from "./pages/NotFound";
// import Room from "./pages/Room";
// import QuizCreate from "./pages/QuizCreate";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VideoCall from "./pages/VideoCall";
import Dashboard from "./pages/Dashboard";
function App() {
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
    <Router>
      <ToastContainer position="top-right" autoClose={2000} />
      <Sidebar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
        {/* <Route
          path="/admin/quiz"
          element={
            <ProtectedRoute>
              <QuizCreate />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/room"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/collab"
          element={
            <ProtectedRoute>
              <CodeCollab />
            </ProtectedRoute>
          }
        />
        <Route path="/videoCall" element={<VideoCall />} />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forums"
          element={
            <ProtectedRoute>
              <Forums />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatBot/>
    </Router>
  );
}

export default App;
