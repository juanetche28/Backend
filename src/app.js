import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";

const app = express();

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
const manager = new ProductManager("./src/Products.json");
const products = await manager.getProducts();

app.use(urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use("/", viewsRouter);
app.use(express.static(__dirname + "/public"));


/**
 * app.listen() retorna una instancia de nuestro servidor http.
 * Esta instancia la vamos a necesitar para crear nuestro servidor de sockets, por lo que la guardamos en una variable.
 * */
const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});


// Crear una vista “index.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento
app.get("/", async (req, res) => {
  res.render("index", {products});
});



// crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.

//Al iniciar el servidor uso Handeblars para que me lo traiga cargado (Aproveche el paso anterior)
app.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts", {products});
});

/** Creamos nuestro servidor de sockets utilizando nuestro servidor http */

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("New Client Connected!");

// Leo el ID que desde el cliente enviaron para eliminar
  socket.on("inputIDdelete", async (data) => {
    await manager.deleteProduct(parseInt(data));
    socket.emit("deletedStatus", `Product with ID ${data} deleted`);
    const productDeleted = await manager.getProducts(); // No esta actualizando correctamente
    socket.emit("updatedProductsDeleted", {productDeleted});
  });
  

//Leo el objeto producto nuevo a agregar a la lista
  socket.on("inputAddproduct", async (data) => {
    const newProduct = JSON.parse(data);
    await manager.addProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.status, newProduct.stock, newProduct.category, newProduct.thumbnail);
    socket.emit("AddedStatus", `Product with CODE ${newProduct.code} succesfully Added`);
    const productAdded = await manager.getProducts();
    socket.emit("updatedProductsAdded", {productAdded});
  });
})

