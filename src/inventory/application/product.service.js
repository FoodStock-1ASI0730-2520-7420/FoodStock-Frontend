// src/inventory/application/product.service.js

import { InventoryApi } from '../infrastructure/inventory-api';

/**
 * ProductService: Orquesta operaciones de negocio para la entidad Product.
 * Depende de InventoryApi para persistencia.
 */
export class ProductService {
    #inventoryApi;

    /**
     * Inicializa el servicio con la API.
     * @param {InventoryApi} [inventoryApi=new InventoryApi()]
     */
    constructor(inventoryApi = new InventoryApi()) {
        this.#inventoryApi = inventoryApi;
    }

    /**
     * Obtiene todos los productos.
     * @returns {Promise<Product[]>}
     */
    async getProducts() {
        console.log("ProductService: Ejecutando caso de uso 'getProducts'...");
        return this.#inventoryApi.getProducts();
    }

    /**
     * Crea un nuevo producto.
     * @param {Product} productEntity
     * @returns {Promise<Product>}
     */
    async createProduct(productEntity) {
        console.log("ProductService: Ejecutando caso de uso 'createProduct'...");
        if (!productEntity.name) {
            throw new Error("ProductServiceError: El nombre del producto no puede estar vacío.");
        }
        return this.#inventoryApi.createProduct(productEntity);
    }

    /**
     * Actualiza un producto existente.
     * @param {Product} productEntity
     * @returns {Promise<Product>}
     */
    async updateProduct(productEntity) {
        if (!productEntity.idProduct) {
            throw new Error("ProductServiceError: El ID del producto es requerido para actualizar.");
        }
        console.log("ProductService: Ejecutando caso de uso 'updateProduct'...");
        return this.#inventoryApi.updateProduct(productEntity);
    }

    /**
     * Elimina un producto por ID.
     * @param {number|string} id
     * @returns {Promise<any>}
     */
    deleteProduct(id) {
        console.log(`ProductService: Ejecutando caso de uso 'deleteProduct' con ID: ${id}`);
        return this.#inventoryApi.deleteProduct(id);
    }
}
