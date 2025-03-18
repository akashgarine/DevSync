import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CodeIcon from "@mui/icons-material/Code";
import QuizIcon from "@mui/icons-material/Quiz";
import ForumIcon from "@mui/icons-material/Forum";

const NavBar = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/signup", "/login"];
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return !hideNavbarPaths.includes(location.pathname) ? (
    <nav className=" text-center flex justify-evenly my-3">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="navigation tabs"
        centered
        textColor="inherit"
        indicatorColor="secondary"
      >
        <Tab icon={<HomeIcon />} label="Home" component={Link} to="/" />
        <Tab icon={<CodeIcon />} label="Collab" component={Link} to="/collab" />
        <Tab icon={<QuizIcon />} label="Test" component={Link} to="/test" />
        <Tab
          icon={<ForumIcon />}
          label="Forums"
          component={Link}
          to="/forums"
        />
      </Tabs>
    </nav>
  ) : null;
};

export default NavBar;
