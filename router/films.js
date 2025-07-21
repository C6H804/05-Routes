const express = require('express');
const fs = require("fs");
const path = require('path');

const router = express.Router();

const filmsPath = path.join(__dirname, "../data/films.json");
films = JSON.parse(fs.readFileSync(filmsPath, "utf-8"));



isIdInFilms = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (!films.some(film => film.id === id)) {
        return res.status(404).json({ message: "film non trouvé." });
    }
    return next();
};


router.get("/", (req, res) => {
    console.log("get request received");
    res.json(films);
});

router.get("/:id", isIdInFilms, (req, res) => {
    console.log("get request received");
    const id = parseInt(req.params.id);
    const film = films.find(e => e.id === id);
    res.json(film);
});


isNewTitleValid = (req, res, next) => {
    const title = req.body.title;
    if (title.trim() === "" || !title) {
        return res.status(400).json({ message: "le titre est obligatoire" });
    }
    next();
};

router.post("/", isNewTitleValid, (req, res) => {
    const newFilm = req.body;
    newFilm.id = films[films.length - 1].id +1 || 0;
    films.push(newFilm);
    try {
        fs.writeFileSync(filmsPath, JSON.stringify(films, null, 2));
        res.status(201).json(newFilm);
    } catch (err) {
        console.error("erreur d'écriture :", err);
        res.status(500).json({ message: "erreur lors de l'ajout du film." });
    }
});

router.patch("/:id", isIdInFilms, isNewTitleValid, (req, res, next) => {
    const id = parseInt(req.params.id);
    films.find(e => e.id === id).title = req.body.title;
    try {
        fs.writeFileSync(filmsPath, JSON.stringify(films, null, 2));
        res.status(200).json({ message: "titre mis à jour avec succées" });
    } catch (err) {
        console.error("Erreur d'écriture :", err);
        res.status(500).json({ message: "erreur lors de la mise à jour." });
    }
});

router.delete("/:id", isIdInFilms, (req, res) => {
    const id = parseInt(req.params.id);
    const index = films.findIndex(e => e.id === id);
    films.splice(index, 1);
    try {
        fs.writeFileSync(filmsPath, JSON.stringify(films, null, 2));
        res.status(204).end("film supprimé avec succés");
    } catch (err) {
        console.error("erreur d'écriture :", err);
        res.status(500).json({ message: "erreur lors de la suppression." });
    }
});






module.exports = router;