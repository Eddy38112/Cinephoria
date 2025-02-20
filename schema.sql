-- 📁 Création de la base de données
DROP DATABASE IF EXISTS Cinephoria;
CREATE DATABASE Cinephoria;
USE Cinephoria;

-- 👤 Table Utilisateur
CREATE TABLE IF NOT EXISTS Utilisateur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('Client', 'Employe', 'Admin') DEFAULT 'Client',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🎬 Table Film
CREATE TABLE IF NOT EXISTS Film (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(100) NOT NULL,
    description TEXT,
    duree INT NOT NULL, -- durée en minutes
    affiche VARCHAR(255), -- URL ou chemin vers l'affiche du film
    date_sortie DATE
);

-- 🏛️ Table Cinema
CREATE TABLE IF NOT EXISTS Cinema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(10) NOT NULL
);

-- 🏟️ Table Salle
CREATE TABLE IF NOT EXISTS Salle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT NOT NULL,
    capacite INT NOT NULL,
    cinema_id INT NOT NULL,
    FOREIGN KEY (cinema_id) REFERENCES Cinema(id) ON DELETE CASCADE
);

-- 🎞️ Table Seance
CREATE TABLE IF NOT EXISTS Seance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    heure TIME NOT NULL,
    film_id INT NOT NULL,
    salle_id INT NOT NULL,
    FOREIGN KEY (film_id) REFERENCES Film(id) ON DELETE CASCADE,
    FOREIGN KEY (salle_id) REFERENCES Salle(id) ON DELETE CASCADE
);

-- 🎟️ Table Reservation
CREATE TABLE IF NOT EXISTS Reservation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT NOT NULL,
    seance_id INT NOT NULL,
    nb_places INT NOT NULL,
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (seance_id) REFERENCES Seance(id) ON DELETE CASCADE
);

-- 💬 Table Avis
CREATE TABLE IF NOT EXISTS Avis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT NOT NULL,
    film_id INT NOT NULL,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    date_avis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (film_id) REFERENCES Film(id) ON DELETE CASCADE
);

-- 🔄 Exemple de Transaction SQL : Création d'une réservation
START TRANSACTION;

INSERT INTO Utilisateur (nom, email, mot_de_passe, role)
VALUES ('Jean Dupont', 'jean.dupont@example.com', 'hashed_password', 'Client');

INSERT INTO Film (titre, description, duree, affiche, date_sortie)
VALUES ('Inception', 'Un film de science-fiction sur les rêves', 148, 'inception.jpg', '2010-07-21');

INSERT INTO Cinema (nom, adresse, ville, code_postal)
VALUES ('Cinephoria Central', '123 Rue Principale', 'Paris', '75001');

INSERT INTO Salle (numero, capacite, cinema_id)
VALUES (1, 150, 1);

INSERT INTO Seance (date, heure, film_id, salle_id)
VALUES ('2025-03-01', '20:00:00', 1, 1);

INSERT INTO Reservation (utilisateur_id, seance_id, nb_places)
VALUES (1, 1, 2);

COMMIT;

-- ✅ Fin du script SQL complet
