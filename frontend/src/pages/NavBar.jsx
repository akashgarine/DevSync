import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tabs, Tab, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CodeIcon from "@mui/icons-material/Code";
import QuizIcon from "@mui/icons-material/Quiz";
import ForumIcon from "@mui/icons-material/Forum";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import VideoChatRoundedIcon from "@mui/icons-material/VideoChatRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
const NavBar = () => {
  const nav = useNavigate();
  const location = useLocation();
  const hideNavbarPaths = ["/signup", "/login"];
  const [value, setValue] = useState(0);
  const [isLogged, setIsLogged] = useState(
    localStorage.getItem("isLogin") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogged(localStorage.getItem("isLogin") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogIn = () => {
    localStorage.setItem("isLogin", "true");
    window.dispatchEvent(new Event("storage")); // Trigger event to update NavBar
    setIsLogged(true);
    nav("/login");
  };

  const handleLogOut = () => {
    localStorage.removeItem("isLogin");
    localStorage.clear();
    window.dispatchEvent(new Event("storage")); // Trigger event to update NavBar
    setIsLogged(false);
    nav("/");
  };

  return !hideNavbarPaths.includes(location.pathname) ? (
    <>
      <nav className="flex justify-between items-center px-6 py-3 bg-[#171717] text-white shadow-lg">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="navigation tabs"
          centered
          textColor="inherit"
          indicatorColor="secondary"
          className="flex-grow"
        >
          <Tab icon={<HomeIcon />} label="Home" component={Link} to="/" />
          <Tab
            icon={<CodeIcon />}
            label="Collab"
            component={Link}
            to="/collab"
          />
          <Tab icon={<QuizIcon />} label="Test" component={Link} to="/test" />
          <Tab
            icon={<ChatRoundedIcon />}
            label="Forums"
            component={Link}
            to="/forums"
          />
          <Tab
            icon={<VideoChatRoundedIcon />}
            label="Video"
            component={Link}
            to="/videoCall"
          />
        </Tabs>

        {/* Styled Login/Logout Button */}
        {isLogged ? (
          <Button
            variant="contained"
            color="error"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            onClick={handleLogOut}
            startIcon={<LogoutRoundedIcon />}
          >
            Log Out
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            onClick={handleLogIn}
          >
            Login
          </Button>
        )}
      </nav>
    </>
  ) : null;
};

export default NavBar;
