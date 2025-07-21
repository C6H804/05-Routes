const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const filmsRouter = require('./router/films');
app.use('/films', filmsRouter);


// Charger les fichiers de données
let films = require('./data/films.json');
const realisateurs = require('./data/realisateurs.json');

// Utilitaire : Chemin vers le fichier
const dataPath = path.join(__dirname, 'data', 'films.json');

// Middleware pour valider un ID
const validateId = (req, res, next) => {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) {
        return res.status(400).json({ message: "ID invalide, un nombre est requis." });
    }
    req.filmId = filmId;
    next();
};

// Middleware de gestion des erreurs centralisée
app.use((err, req, res, next) => {
    console.error("Erreur attrapée :", err.stack);
    res.status(500).json({ message: "Erreur interne du serveur." });
});

// Route d'accueil
app.get('/', (req, res) => {
    res.send('🎬 Bienvenue au CineClub API !');
});

// GET /films — tous les films
app.get('/films', (req, res) => {
    res.json(films);
});

// GET /realisateurs
app.get('/realisateurs', (req, res) => {
    res.json(realisateurs);
});

// GET /films/:id — détail d'un film
// app.get('/films/:id', validateId, (req, res) => {
//     const film = films.find(f => f.id === req.filmId);
//     if (!film) {
//         return res.status(404).json({ message: "Film introuvable." });
//     }
//     res.json(film);
// });

// DELETE /films/:id — suppression d'un film
// app.delete('/films/:id', validateId, (req, res) => {
//     const index = films.findIndex(f => f.id === req.filmId);
//     if (index === -1) {
//         return res.status(404).json({ message: "Film à supprimer introuvable." });
//     }

//     films.splice(index, 1);

//     try {
//         fs.writeFileSync(dataPath, JSON.stringify(films, null, 2));
//         res.status(204).end();
//     } catch (err) {
//         console.error("Erreur d'écriture :", err);
//         res.status(500).json({ message: "Erreur lors de la suppression." });
//     }
// });

// POST /films — ajout d’un film
// app.post('/films', (req, res) => {
//     const nouveauFilm = req.body;

//     if (!nouveauFilm.titre || !nouveauFilm.id) {
//         return res.status(400).json({ message: "Titre et ID sont requis." });
//     }

//     if (films.some(f => f.id === nouveauFilm.id)) {
//         return res.status(400).json({ message: "Un film avec cet ID existe déjà." });
//     }

//     films.push(nouveauFilm);

//     try {
//         fs.writeFileSync(dataPath, JSON.stringify(films, null, 2));
//         res.status(201).json({ message: "Film ajouté avec succès", film: nouveauFilm });
//     } catch (err) {
//         res.status(500).json({ message: "Erreur lors de l'ajout du film." });
//     }
// });

// PATCH /films/:id — modification du titre
// app.patch('/films/:id', validateId, (req, res) => {
//     const { titre } = req.body;

//     if (!titre) {
//         return res.status(400).json({ message: "Le champ 'titre' est requis." });
//     }

//     const film = films.find(f => f.id === req.filmId);
//     if (!film) {
//         return res.status(404).json({ message: "Film à modifier introuvable." });
//     }

//     film.titre = titre;

//     try {
//         fs.writeFileSync(dataPath, JSON.stringify(films, null, 2));
//         res.status(200).json({ message: "Titre du film mis à jour.", film });
//     } catch (err) {
//         res.status(500).json({ message: "Erreur lors de la mise à jour." });
//         // ou next(err);
//     }
// });

// Middleware de rattrapage 404
app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée." });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🎥 Serveur CineClub démarré sur http://localhost:${PORT}`);
});
