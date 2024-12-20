import cartModel from '../models/cart.model.js';
import ErrorManager from './ErrorManager.js';
import { isValidId } from '../config/mongoose.config.js';

export default class CartManager {
    #cart;

    constructor() {
        this.#cart = cartModel;
    }

    // Obtener todos los carritos
    async getCarts() {
        try {
            return await this.#cart.find().populate('products.productId').lean();
        } catch (err) {
            console.error('Error al obtener los carritos:', err);
            throw ErrorManager.handleError(err);
        }
    }

    // Obtener un carrito por ID
    async getCartById(id) {
        if (!isValidId(id)) {
            throw new Error('ID de carrito no válido', 400);
        }
        try {
            const cart = await this.#cart.findById(id).populate('products.productId').lean();
            if (!cart) {
                throw new Error('Carrito no encontrado', 404);
            }
            return cart;
        } catch (err) {
            console.error(`Error al obtener el carrito con ID ${id}:`, err);
            throw ErrorManager.handleError(err);
        }
    }

    // Crear un nuevo carrito
    async createCart() {
        try {
            const newCart = await this.#cart.create({ products: [] });
            return newCart;
        } catch (err) {
            console.error('Error al crear el carrito:', err);
            throw ErrorManager.handleError(err);
        }
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productId, quantity = 1) {
        if (!isValidId(cartId) || !isValidId(productId)) {
            throw new Error('ID de carrito o producto no válido', 400);
        }

        try {
            const cart = await this.#cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado', 404);
            }

            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity });
            } else {
                cart.products[productIndex].quantity += quantity;
            }

            await cart.save();
            return await this.getCartById(cartId); // Devuelve el carrito actualizado
        } catch (err) {
            console.error(`Error al agregar el producto ${productId} al carrito ${cartId}:`, err);
            throw ErrorManager.handleError(err);
        }
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        if (!isValidId(cartId) || !isValidId(productId)) {
            throw new Error('ID de carrito o producto no válido', 400);
        }

        try {
            const cart = await this.#cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado', 404);
            }

            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
            await cart.save();

            return await this.getCartById(cartId); // Devuelve el carrito actualizado
        } catch (err) {
            console.error(`Error al eliminar el producto ${productId} del carrito ${cartId}:`, err);
            throw ErrorManager.handleError(err);
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        if (!isValidId(cartId) || !isValidId(productId)) {
            throw new Error('ID de carrito o producto no válido', 400);
        }

        if (quantity <= 0) {
            throw new Error('La cantidad debe ser un número positivo', 400);
        }

        try {
            const cart = await this.#cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado', 404);
            }

            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito', 404);
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();

            return await this.getCartById(cartId); // Devuelve el carrito actualizado
        } catch (err) {
            console.error(`Error al actualizar la cantidad del producto ${productId} en el carrito ${cartId}:`, err);
            throw ErrorManager.handleError(err);
        }
    }

    // Actualizar el carrito completo
    async updateCart(cartId, products) {
        if (!isValidId(cartId)) {
            throw new Error('ID de carrito no válido', 400);
        }

        try {
            const cart = await this.#cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado', 404);
            }

            cart.products = products;
            await cart.save();

            return await this.getCartById(cartId); // Devuelve el carrito actualizado
        } catch (err) {
            console.error(`Error al actualizar el carrito ${cartId}:`, err);
            throw ErrorManager.handleError(err);
        }
    }

    // Eliminar todos los productos del carrito
    async clearCart(cartId) {
        if (!isValidId(cartId)) {
            throw new Error('ID de carrito no válido', 400);
        }

        try {
            const cart = await this.#cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado', 404);
            }

            cart.products = [];
            await cart.save();

            return await this.getCartById(cartId); // Devuelve el carrito vacío
        } catch (err) {
            console.error(`Error al vaciar el carrito ${cartId}:`, err);
            throw ErrorManager.handleError(err);
        }
    }
}
