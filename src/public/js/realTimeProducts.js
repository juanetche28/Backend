const socket = io();

// Voy a leer en el cliente el numero de ID de producto que se desea eliminar para luego escucharlo en el servidor y proceder con su eliminacion
const deleteButton = document.getElementById("deleteButton")
deleteButton.addEventListener("click", function (ev) {
  const inputIDdelete =  document.getElementById("inputIDdelete").value;
  socket.emit("inputIDdelete", inputIDdelete);
});


// Voy a leer el objeto producto a ingresar

const addProduct = document.getElementById("addButton")
addProduct.addEventListener("click", function (ev) {
  const inputAddproduct =  document.getElementById("inputAddproduct").value;
  socket.emit("inputAddproduct", inputAddproduct);
});


// Leo la respuesta actualizada del servidor con el producto ya eliminado: 
socket.on("deletedStatus", (data) => {
  const status = document.getElementById("status")
  status.innerText = data;
});

socket.on("updatedProductsDeleted", (data) => {
  const updatedProducts = document.getElementById("updatedProducts")
  // updatedProducts.innerText = "";
  updatedProducts.innerText = JSON.stringify(data);
});


// Leo la respuesta del servidor con el producto ya agregado:
socket.on("AddedStatus", (data) => {
  const status = document.getElementById("status")
  status.innerText = data;
});

socket.on("updatedProductsAdded", (data) => {
  const updatedProducts = document.getElementById("updatedProducts")
  updatedProducts.innerText = "";
  updatedProducts.innerText = JSON.stringify(data);
});

//   for (const el of data) {
//     const li = document.createElement("li");
//     li.innerText = `${el.socketId}: ${el.message}`;
//     chatMessages.appendChild(li);
//   }
// });
