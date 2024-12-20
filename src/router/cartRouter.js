import express from 'express';
import CartManager from '../manager/cartManager.js';
import ErrorManager from '../manager/ErrorManager.js';
const router = express.Router();
const cartManager = new CartManager();

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carritos = await cartManager.getCarts();
      
        res.status(200).json(carritos);
    } catch (error) {
       
        res.status(500).send('Error interno del servidor al obtener los carritos');
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para obtener un carrito por id con "populate"
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const carrito = await cartManager.getCartById(cid);
        if (!carrito) {
            return res.status(404).send(`Carrito con ID ${cid} no encontrado`);
        }
        res.status(200).json(carrito);
    } catch (error) {
        
        res.status(500).send('Error interno del servidor al obtener el carrito');
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        if (!newCart) {
            return res.status(400).send('Error al crear el carrito');
        }
        res.status(201).json(newCart);
    } catch (error) {
       
        res.status(500).send('Error interno del servidor al crear el carrito');
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    try {
        if (quantity <= 0) {
            return res.status(400).send('La cantidad debe ser un número positivo');
        }

        const carrito = await cartManager.addProductToCart(cid, pid, quantity);
        if (!carrito) {
            return res.status(404).send(`Carrito con ID ${cid} o producto con ID ${pid} no encontrado`);
        }
        res.status(200).json(carrito);
    } catch (error) {
        console.error(`Error al agregar el producto con ID ${pid} al carrito con ID ${cid}:`, error);
        res.status(500).send('Error interno del servidor al agregar el producto al carrito');
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const result = await cartManager.removeProductFromCart(cid, pid);
        if (!result) {
            return res.status(404).send(`Carrito con ID ${cid} o producto con ID ${pid} no encontrado`);
        }
        res.status(200).send('Producto eliminado del carrito con éxito');
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${pid} del carrito con ID ${cid}:`, error);
        res.status(500).send('Error interno del servidor al eliminar el producto del carrito');
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cid, products);
        if (!updatedCart) {
            return res.status(404).send(`Carrito con ID ${cid} no encontrado`);
        }
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(`Error al actualizar el carrito con ID ${cid}:`, error);
        res.status(500).send('Error interno del servidor al actualizar el carrito');
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        if (quantity <= 0) {
            return res.status(400).send('La cantidad debe ser un número positivo');
        }

        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        if (!updatedCart) {
            return res.status(404).send(`Carrito con ID ${cid} o producto con ID ${pid} no encontrado`);
        }
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).send('Error interno del servidor al actualizar la cantidad del producto');
        throw new ErrorManager(error.message, 500);
    }
});

// Ruta para eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const result = await cartManager.clearCart(cid);
        if (!result) {
            return res.status(404).send(`Carrito con ID ${cid} no encontrado`);
        }
        res.status(200).send('Todos los productos han sido eliminados del carrito');
    } catch (error) {
       
        res.status(500).send('Error interno del servidor al eliminar los productos del carrito');
        throw new ErrorManager(error.message, 500);
    }
});

export default router;
