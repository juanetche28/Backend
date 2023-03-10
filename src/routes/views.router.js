import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index"); // Solo renderizamos la vista index.handlebars, sin contenido dinámico
});

export default router;
