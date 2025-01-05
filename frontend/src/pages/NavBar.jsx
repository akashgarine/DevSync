import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/signup", "/login"];

  return !hideNavbarPaths.includes(location.pathname) ? (
    <nav>
      <ul className="text-center flex justify-evenly my-10">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/collab">Collab</Link>
        </li>
        <li>
          <Link to="/test">Test</Link>
        </li>
        <li>
          <Link to="/forums">Forums</Link>
        </li>
      </ul>
    </nav>
  ) : null;
};

export default NavBar;
