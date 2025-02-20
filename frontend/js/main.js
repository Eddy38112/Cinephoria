// ✅ main.js
import { fetchFilms } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const films = await fetchFilms();
  const filmSection = document.getElementById("latest-films");

  if (films && films.length > 0) {
    filmSection.innerHTML = films
      .map(
        (film) => `
      <div class="film-card">
        <img src="${film.affiche}" alt="Affiche ${film.titre}" />
        <h3>${film.titre}</h3>
        <p>${film.description}</p>
      </div>`
      )
      .join("");
  } else {
    filmSection.innerHTML = "<p>Aucun film disponible pour le moment.</p>";
  }
});
