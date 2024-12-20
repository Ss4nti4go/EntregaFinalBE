import express from 'express';
import ProductManager from '../manager/productManager.js';
import productModel from '../models/product.model.js';
const productManagerInstance = new ProductManager();
const router = express.Router();
import ErrorManager from '../manager/ErrorManager.js';
// Ruta para renderizar todos los productos
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManagerInstance.getProducts();
    if (!products) {
      throw new Error('No se encontraron productos');
    }
   
    res.render('realtimeproducts');
  } catch (error) {
    res.status(500).send(`<h1>Error al obtener los productos: ${error.message}</h1>`);
     throw new ErrorManager(error.message, 500);
  }
});
router.get('/', async (req, res) => {
  try {
    // Obtén los parámetros de paginación de la query (page y limit)
    const { page = 1, limit = 5 } = req.query;

    // Realiza la consulta paginada
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      lean: true, // Retorna objetos JS simples en lugar de documentos de Mongoose
    };

    const products = await productModel.paginate({}, options);

    // Renderiza la vista y pasa los datos de productos y paginación
    res.status(200).render('home', {
      products: products.docs, // Los productos de la página actual
      totalPages: products.totalPages, // Total de páginas
      currentPage: products.page, // Página actual
      hasPrevPage: products.hasPrevPage, // Si hay una página anterior
      hasNextPage: products.hasNextPage, // Si hay una página siguiente
      prevPage: products.prevPage, // Página anterior
      nextPage: products.nextPage, // Página siguiente
    });
  } catch (error) {
    res.status(500).send(`<h1>Error al obtener los productos: ${error.message}</h1>`);
    throw new ErrorManager(error.message, 500);
  }
});
// Ruta para renderizar un producto por id
router.get('/product/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManagerInstance.getProductById(pid);
    // Verifica si las propiedades existen y son propias
    const cleanProduct = {
      title: product.title,
      price: product.price,
      description: product.description,
      code: product.code,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails
    };
    
    res.status(200).render('product', { product: cleanProduct });
  } catch (error) {

    res.status(500).send(`<h1>Error al obtener el producto: ${error.message}</h1>`);
    throw new ErrorManager(error.message, 500);
  }
});

export default router;
