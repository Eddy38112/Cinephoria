-- 🎟️ Transaction SQL : Création d'une réservation avec vérification des places disponibles
-- But : S'assurer qu'une réservation ne soit validée que si toutes les conditions sont réunies.

START TRANSACTION;

-- 🔍 1. Vérifier la disponibilité des places pour la séance
SELECT capacite - IFNULL((SELECT SUM(nb_places) FROM Reservation WHERE seance_id = 1), 0) AS places_disponibles
FROM Salle
JOIN Seance ON Salle.id = Seance.salle_id
WHERE Seance.id = 1
FOR UPDATE;

-- 📝 2. Si suffisamment de places, insérer la réservation
INSERT INTO Reservation (utilisateur_id, seance_id, nb_places)
VALUES (2, 1, 3);

-- ✅ 3. Générer un QR Code (simulé ici comme texte pour test)
UPDATE Reservation
SET qr_code = CONCAT('QR-', UUID())
WHERE id = LAST_INSERT_ID();

-- 💡 4. Vérification finale avant validation
SELECT * FROM Reservation WHERE id = LAST_INSERT_ID();

-- 🎯 Valider la transaction si tout est correct
COMMIT;

-- 🔥 Si une erreur se produit, rollback
-- ROLLBACK; -- (À activer si besoin en cas d'erreur pour annuler l'ensemble)
