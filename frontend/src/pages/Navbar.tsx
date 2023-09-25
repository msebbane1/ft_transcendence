import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/chat">Chat</Link>
        </li>
	<li>
	  <Link to="/profile">Profile</Link>
	</li>
	<li>
	 <Link to="/Game">Game</Link>
	</li>
      </ul>
    </nav>
  );
}

export default Navbar;
