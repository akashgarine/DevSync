import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CodeCollab from "./pages/CodeCollab";
import Test from "./pages/Test";
import Home from "./pages/Home";
import Forums from "./pages/Forums";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useState } from "react";
import NavBar from "./pages/NavBar";
function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === "true");

  const ProtectedRoute = ({children}) => {
    return isLogin ? children : <Navigate to="/login" replace />
  }
  
  return (
    <Router>
      <NavBar  />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
        <Route
          path="/home"
          element={ 
            <ProtectedRoute>
              <Home />
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
