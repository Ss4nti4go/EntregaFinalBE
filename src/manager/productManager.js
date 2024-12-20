
import productModel from '../models/product.model.js';
import ErrorManager from './ErrorManager.js';
import { isValidId } from '../config/mongoose.config.js';
export default class ProductManager {
    #product;

    constructor() {
        this.#product = productModel;
    }



    async getProducts(params) {
        try {
            const sort ={
                asc: { price: 1 },
                desc: { price: -1 }
            }
            const paginationOptions = {
                limit : params?.limit || 10,
                page : params?.page || 1,
                sort : sort[params?.sort] || {},
                lean : true
            }
            const $and = [];
            
            if (params?.title) $and.push({ title: { $regex: params.title, $options: "i"} });
            if (params?.code) $and.push({ code: params.code.toString() });
            // Filtros para precio
            if (params?.price) $and.push({ price: Number(params.price) });
            if (params?.priceMin) $and.push({ price: { $gte: Number(params.priceMin) } });
            if (params?.priceMax) $and.push({ price: { $lte: Number(params.priceMax) } });
            // Filtros para stock
            if (params?.stock) $and.push({ stock: Number(params.stock) });
            if (params?.stockMin) $and.push({ stock: { $gte: Number(params.stockMin) } });
            if (params?.stockMax) $and.push({ stock: { $lte: Number(params.stockMax) } });
            // Filtros adicionales
            if (params?.category) $and.push({ category: params.category.toString() });
            if (params?.status) $and.push({ status: params.status.toString() });
    
            // Construcción de los filtros
            const filters = $and.length > 0 ? { $and } : {};
          
            return await this.#product.paginate(filters, paginationOptions);  
        } catch (err) {
            console.error('Error en getProducts:', err);
            throw ErrorManager.handleError(err);
        }
    }
    async addProduct(productData) {
        try {
            const product = await this.#product.create(productData);
            return product;
        } catch (err) {
            throw ErrorManager.handleError(err);
        }



    }
    async getProductById(id) {
        if(!isValidId(id)){
            throw new Error('Producto no existe',400);
        }
        try {
            const product = await this.#product.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado',404);
            }
            return product;
        } catch (err) {
            
            throw ErrorManager.handleError(err);
        }
    }
    async deleteProduct(id) {
        try {
            const product = await this.#product.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            await product.deleteOne();
            return product;
        } catch (err) {
            throw ErrorManager.handleError(err);
        }
    }
    async updateProductById(id, productData) {
        if(!isValidId(id)){
            throw new Error('Producto no existe',400);
        }
        try {
            const product = await this.#product.findById(id);
            const newValues = { ...product, ...productData };
            if (!product) {
                throw Error('Producto no encontrado', 400);
            }
            product.set(newValues);
            await product.save();
            return product;
        } catch (err) {
            throw ErrorManager.handleError(err);
        }
    }
}
