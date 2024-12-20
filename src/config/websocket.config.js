import { Server } from "socket.io";
import productManager from '../manager/productManager.js';

export const config = (httpServer) => {
  const io = new Server(httpServer);
  const productManagerInstance = new productManager(io); 

  io.on("connection",async (socket) => {
    console.log("Cliente conectado");

    // Enviar productos al cliente cuando se conecta
    socket.emit('updateProducts', await productManagerInstance.getProducts());
  
    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });

    // Evento para agregar un producto
    socket.on("newProduct", async (data) => {
      console.log(`Nuevo producto recibido: ${JSON.stringify(data)}`);
      try {
        await productManagerInstance.addProduct(data);
        
        socket.emit('updateProducts', await productManagerInstance.getProducts());
      } catch (err) {
        console.error("Error al agregar el producto: ", err);
      }
    });

    // Evento para eliminar un producto
    socket.on("deleteProduct", async (data) => {
        console.log(`Producto eliminado: ${data.id}`);
        try {
          // Usar data.id en lugar de id
          await productManagerInstance.deleteProduct(data.id);
          socket.emit('updateProducts', await productManagerInstance.getProducts());
        } catch (err) {
          console.error("Error al eliminar el producto: ", err);
        }
      });
  });

  return io;
};
