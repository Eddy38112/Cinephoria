// ✅ api.js
const API_BASE_URL = "https://cinephoria-api.onrender.com";

// 🔥 Fonction pour récupérer les films
export async function fetchFilms() {
  try {
    const response = await fetch(`${API_BASE_URL}/films`);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des films");
    return await response.json();
  } catch (error) {
    console.error("❌ Erreur API (fetchFilms) :", error);
    return [];
  }
}
