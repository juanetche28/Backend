// mkdir url_params
// cd url_params
// npm init -y
// npm install express
// mkdir src
// cd src
// nodemode app.js

import express from "express";
import ProductManager from "./3er-Desafio.js";
const manager = new ProductManager();

// app.get("/users", async (req, res) => {
    // const products = await manager.getProducts();
//     const {city} = req.query;

const app = express();

const users = [
    {id: "1", name: "Franco", city: "Lima"},
    {id: "2", name: "Martin", city: "Lima"},
    {id: "3", name: "Pedro", city: "Buenos Aires"},
    {id: "4", name: "María", city: "Bariloche"},
];

// Probar en navegador: http://127.0.0.1:8081/users?city=Lima

app.get("/users", (req, res) => {
    const {city} = req.query;
    if (city) {
        return res.send(users.filter((u) => u.city === city));
    } else {
        res.send(users);
    }
});

app.get("/users/:id", (req, res) => {
    // const id = req.params.id;
    const { id } = req.params;
    //res.send(`Cliente pidio id = ${id}`);
    const user = users.find((u) => u.id === id);
    // Si no encontramos el usuario respondemos con un not found
    if (!user) {
        return res
        .status(404)
        .send({error: `No existe el usuario con ID ${id}`});     
    }
    res.send(user);
});

app.listen(8081, () => {
    console.log("Server listening on port 8081");
});
