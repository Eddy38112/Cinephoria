import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    role: "Client",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:10000/auth/register", formData)
      .then(() => alert("Inscription réussie 🎉"))
      .catch(() => alert("Erreur lors de l'inscription ❌"));
  };

  return (
    <div>
      <h2>Inscription ✍️</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nom"
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) =>
            setFormData({ ...formData, mot_de_passe: e.target.value })
          }
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
