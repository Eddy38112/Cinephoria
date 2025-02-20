import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:10000/auth/login", {
        email,
        mot_de_passe: motDePasse,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        alert("Connexion réussie ✅");
      })
      .catch(() => alert("Erreur lors de la connexion ❌"));
  };

  return (
    <div>
      <h2>Connexion 🔐</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
