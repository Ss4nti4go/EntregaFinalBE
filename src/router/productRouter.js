import express from 'express';
import ProductManager from '../manager/productManager.js';
import productModel from '../models/product.model.js';
const productManagerInstance = new ProductManager();
const router = express.Router();
import ErrorManager from '../manager/ErrorManager.js';
/*
router.get('/explain', async (req, res) => {
    try {
   
        const explain = await productModel.find().explain();
        res.status(200).json({ status: 'success', payload: explain.executionStats });
    } catch (error) {

        res.status(error.code).send({
            status: 'error',
             message: error.message
        });
    }
})*/
// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    const params = req.query;
    try {
        console.log(params);
        const productos = await productManagerInstance.getProducts(params);
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(error.code).send('Error interno del servidor al obtener los productos');
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para obtener un producto por id
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const producto = await productManagerInstance.getProductById(pid);

        res.status(200).json(producto);
    } catch (error) {
        console.error(`Error al obtener el producto con ID ${pid}:`, error);
        res.status(error.code).send(error.message);
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
    const productData = req.body;
    try {
        const nuevoProducto = await productManagerInstance.addProduct(productData);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(error.code).send(error.message);
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para actualizar un producto existente
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;

    try {
        const productoActualizado = await productManagerInstance.updateProductById(pid, updatedData);
        res.status(200).json(productoActualizado);
    } catch (error) {
        console.error(`Error al actualizar el producto con ID ${pid}:`, error);
        res.status(error.code).send(error.message);
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await productManagerInstance.deleteProduct(pid);
        res.status(200).send(`Producto con ID ${pid} (${product.title}) eliminado exitosamente`);
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${pid}:`, error);
        res.status(error.code).send(error.message);
        throw new ErrorManager(error.message, 500);
    }
});

export default router;
