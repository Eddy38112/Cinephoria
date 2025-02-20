import React, { useEffect, useState } from "react";
import axios from "axios";

const Films = () => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:10000/films")
      .then((res) => setFilms(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Liste des films 🎥</h2>
      {films.map((film) => (
        <div key={film.id}>
          <h3>{film.titre}</h3>
          <p>{film.description}</p>
          <img
            src={film.affiche}
            alt={`Affiche de ${film.titre}`}
            width="200"
          />
        </div>
      ))}
    </div>
  );
};

export default Films;
