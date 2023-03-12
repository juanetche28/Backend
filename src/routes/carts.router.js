import { Router, json } from "express";
import CartManager from "../CartManager.js";
const manager = new CartManager("./src/Carts.json");

const carts = await manager.getCarts();
const cartsRouter = Router();
cartsRouter.use(json());

// Muestro todos los carritos

cartsRouter.get("/", (req, res) => {
  res.send(carts);
});

//La ruta raíz POST / deberá crear un nuevo carrito

cartsRouter.post("/", (req, res) => {
  manager.addCart()
  res.send(`Cart created successfully.`);
});


// La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

cartsRouter.get("/:cid", (req, res) => {
  const cid = Number(req.params.cid);
  const cartFind = carts.find((u) => u.idCart === parseInt(cid)); // converti a Numero porque lo lee por defecto como string 
  
  // Si no encontramos el Carrito respondemos con un not found
    if (!cartFind) {
      return res
      .status(404)
      .send({error: `The Cart with id ${cid} does not exist`});
  } else {
      res.send(cartFind.products);
  }
});


//La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  manager.addProduct(cid, pid)
  res.send(`update successfully, cart id ${cid} and product id ${pid}`);
});

export default cartsRouter;
