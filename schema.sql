-- Création de la base de données
CREATE DATABASE IF NOT EXISTS Cinephoria;
USE Cinephoria;

-- Table Utilisateur
CREATE TABLE IF NOT EXISTS Utilisateur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('Client', 'Employe', 'Admin') NOT NULL
);

-- Table Cinema
CREATE TABLE IF NOT EXISTS Cinema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    adresse TEXT NOT NULL
);

-- Table Salle
CREATE TABLE IF NOT EXISTS Salle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT NOT NULL,
    capacite INT NOT NULL,
    cinema_id INT NOT NULL,
    FOREIGN KEY (cinema_id) REFERENCES Cinema(id) ON DELETE CASCADE
);

-- Table Film
CREATE TABLE IF NOT EXISTS Film (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    duree INT NOT NULL,
    affiche VARCHAR(255)
);

-- Table Seance
CREATE TABLE IF NOT EXISTS Seance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    heure TIME NOT NULL,
    salle_id INT NOT NULL,
    film_id INT NOT NULL,
    FOREIGN KEY (salle_id) REFERENCES Salle(id) ON DELETE CASCADE,
    FOREIGN KEY (film_id) REFERENCES Film(id) ON DELETE CASCADE
);

-- Table Reservation
CREATE TABLE IF NOT EXISTS Reservation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT NOT NULL,
    seance_id INT NOT NULL,
    nb_places INT NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (seance_id) REFERENCES Seance(id) ON DELETE CASCADE
);

-- Table Avis (Commentaires sur les films)
CREATE TABLE IF NOT EXISTS Avis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    film_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    note DECIMAL(2,1) CHECK (note >= 0 AND note <= 5),
    commentaire TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (film_id) REFERENCES Film(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id) ON DELETE CASCADE
);
