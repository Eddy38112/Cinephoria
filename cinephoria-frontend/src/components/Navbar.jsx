import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <h1>Cinéphoria 🎬</h1>
      <ul>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li>
          <Link to="/films">Films</Link>
        </li>
        <li>
          <Link to="/login">Connexion</Link>
        </li>
        <li>
          <Link to="/register">Inscription</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
