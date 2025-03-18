import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CodeCollab from "./pages/CodeCollab";
import Test from "./pages/Test";
import Home from "./pages/Home";
import Forums from "./pages/Forums";
import Auth from "./pages/Auth";
import { useState } from "react";
import NavBar from "./pages/NavBar";
import NotFound from "./pages/NotFound";
import Room from "./pages/Room";
import QuizCreate from "./pages/QuizCreate";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
function App() {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );

  const ProtectedRoute = ({ children }) => {
    return isLogin ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
        <Route
          path="/admin/quiz"
          element={
            <ProtectedRoute>
              <QuizCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collab"
          element={
            <ProtectedRoute>
              <CodeCollab />
            </ProtectedRoute>
          }
        />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
