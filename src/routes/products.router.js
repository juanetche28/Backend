import { Router, json } from "express";
import ProductManager from "../ProductManager.js";
const manager = new ProductManager("./src/Products.json");

// Importo de mi base de datos "Products.json" los productos guardados
const products = await manager.getProducts();
const productsRouter = Router();

productsRouter.use(json());

// La ruta raíz GET / deberá listar todos los productos de la base.

productsRouter.get("/", async (req, res) => {
  res.send(products);
});


// La ruta GET /:pid deberá traer sólo el producto con el id proporcionado

productsRouter.get("/:pid", (req, res) => {
  const pid = Number(req.params.pid);
  const productFind = products.find((u) => u.id === parseInt(pid)); // converti a Numero porque lo lee por defecto como string 
    // Si no encontramos el Producto respondemos con un not found
    if (!productFind) {
      return res
      .status(404)
      .send({error: `The product with id ${pid} does not exist`});
  } else {
      res.send(productFind);
  }
});


// La ruta raíz POST / deberá agregar un nuevo producto

productsRouter.post("/", (req, res) => {
  const newProduct = req.body;
  manager.addProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.status, newProduct.stock, newProduct.category, newProduct.thumbnail);
  
  // Muestro error si esta duplicado el CODE
  const productWithSameCode = products.some((p) => {
    return p.code === newProduct.code;
  });
  if (productWithSameCode) {
      throw new Error("Product with the same existing code.");
  } else {
    res.send(`The product with code ${newProduct.code} was successfully added`);
  }
});

// La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. 

productsRouter.put("/:pid", (req, res) => {
  const dataToUpdate = req.body;
  const pid = Number(req.params.pid);
  manager.updateProduct(pid, dataToUpdate);

  const product = products.find((u) => u.id === parseInt(pid));
  // Si no encontramos el Producto respondemos con un not found
    if (!product) {
      return res
      .status(404)
      .send({error: `The product with id ${pid} does not exist`});
  } else {
      res.send(`The product with id ${pid} was successfully updated`);
  }
});

// La ruta DELETE /:pid deberá eliminar el producto con el pid indicado.

productsRouter.delete("/:pid", (req, res) => {
  const pid = Number(req.params.pid);
  manager.deleteProduct(pid)
  res.send(`product with id ${pid} deleted successfully!`);
});

export default productsRouter;
