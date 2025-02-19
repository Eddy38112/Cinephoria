const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const QRCode = require("qrcode"); // 📌 QR Code pour les billets

const app = express();
const PORT = process.env.PORT || 10000;
const SECRET_KEY = "supersecretkey";

// 🌐 Middleware
app.use(cors());
app.use(bodyParser.json());

// 🌐 Connexion MySQL (Railway + Render - Frankfurt)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "frankfurt-mysql-production.up.railway.app",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "p4ssw0rdSuperSecret",
  database: process.env.DB_NAME || "Cinephoria",
  port: process.env.DB_PORT || 3306,
});

// 📡 Connexion MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à MySQL :", err);
  } else {
    console.log("✅ Connecté à la base de données MySQL");
  }
});

// 🔒 Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Accès refusé" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = user;
    next();
  });
};

// 🎯 Vérification du rôle utilisateur
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ error: "Accès interdit" });
  next();
};

// 🔑 Inscription d'un utilisateur
app.post("/auth/register", async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  const roleAttribue = ["Client", "Employe", "Admin"].includes(role)
    ? role
    : "Client";

  db.query(
    "SELECT * FROM Utilisateur WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length > 0)
        return res.status(400).json({ error: "Cet email est déjà utilisé !" });

      db.query(
        "INSERT INTO Utilisateur (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)",
        [nom, email, hashedPassword, roleAttribue],
        (err) => {
          if (err) return res.status(500).json({ error: err });
          res.status(201).json({ message: "Utilisateur inscrit avec succès" });
        }
      );
    }
  );
});

// 🔐 Connexion d'un utilisateur
app.post("/auth/login", (req, res) => {
  const { email, mot_de_passe } = req.body;
  db.query(
    "SELECT * FROM Utilisateur WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ error: "Utilisateur non trouvé" });

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(
        mot_de_passe,
        user.mot_de_passe
      );
      if (!isPasswordValid)
        return res.status(401).json({ error: "Mot de passe incorrect" });

      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
        expiresIn: "24h",
      });
      res.json({ token });
    }
  );
});

// 🎬 Récupérer tous les films
app.get("/films", (req, res) => {
  db.query("SELECT * FROM Film", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 🎬 Ajouter un film (Admin uniquement)
app.post("/films", authenticateToken, authorizeRole("Admin"), (req, res) => {
  const { titre, description, duree, affiche } = req.body;
  db.query(
    "INSERT INTO Film (titre, description, duree, affiche) VALUES (?, ?, ?, ?)",
    [titre, description, duree, affiche],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({
        message: "Film ajouté avec succès",
        filmId: result.insertId,
      });
    }
  );
});

// 💬 Ajouter un avis
app.post("/avis", authenticateToken, (req, res) => {
  const { film_id, note, commentaire } = req.body;
  const utilisateur_id = req.user.id;

  db.query(
    "INSERT INTO Avis (utilisateur_id, film_id, note, commentaire) VALUES (?, ?, ?, ?)",
    [utilisateur_id, film_id, note, commentaire],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Avis ajouté avec succès" });
    }
  );
});

// 🎟️ Créer une réservation avec QR Code
app.post("/reservations", authenticateToken, async (req, res) => {
  const { seance_id, nb_places } = req.body;
  const utilisateur_id = req.user.id;

  db.query(
    "INSERT INTO Reservation (utilisateur_id, seance_id, nb_places) VALUES (?, ?, ?)",
    [utilisateur_id, seance_id, nb_places],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const reservationId = result.insertId;
      const qrData = `ReservationID:${reservationId}-UserID:${utilisateur_id}-SeanceID:${seance_id}`;
      const qrCode = await QRCode.toDataURL(qrData);

      res.status(201).json({
        message: "Réservation créée avec succès",
        reservationId: reservationId,
        qrCode: qrCode,
      });
    }
  );
});

// 📅 Récupérer toutes les séances
app.get("/seances", (req, res) => {
  db.query(
    `SELECT Seanc
