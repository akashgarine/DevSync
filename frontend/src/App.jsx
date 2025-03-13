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

function App() {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );
  
  const ProtectedRoute = ({ children }) => {
    return isLogin ? children : <Navigate to="/auth" replace />;
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/auth" element={<Auth setIsLogin={setIsLogin} />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/quiz" element={<QuizCreate />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
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
      </Routes>
    </Router>
  );
}

export default App;
