// src/inventory/infrastructure/inventory-api.js

import { BaseApi2 } from "../../shared/infrastructure/base-api-2.js";

import { BaseEndpoint2 } from "../../shared/infrastructure/base-endpoint-2.js";
import { ItemAssembler } from './item.assembler';
import { ProductAssembler } from './product.assembler';

const itemsEndpointPath = import.meta.env.VITE_ITEMS_ENDPOINT_PATH || 'items';
const productsEndpointPath = import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH || 'products';

export class InventoryApi extends BaseApi2 {
    #itemsEndpoint;
    #productsEndpoint;

    constructor() {
        super();
        this.#itemsEndpoint = new BaseEndpoint2(this, itemsEndpointPath);
        this.#productsEndpoint = new BaseEndpoint2(this, productsEndpointPath);
    }

    // --- Métodos para Item ---

    /**
     * Obtiene todos los ítems.
     * @returns {Promise<Item[]>}
     */
    async getItems() {
        const response = await this.#itemsEndpoint.getAll();
        return ItemAssembler.toDomainList(response);
    }

    /**
     * Obtiene un ítem por su ID.
     * @param {number|string} id
     * @returns {Promise<Item>}
     */
    async getItemById(id) {
        const response = await this.#itemsEndpoint.getById(id);
        return ItemAssembler.toDomain(response.data);
    }

    /**
     * Crea un nuevo ítem.
     * @param {Item} itemEntity
     * @returns {Promise<Item>}
     */
    async createItem(itemEntity) {
        const resource = ItemAssembler.toResource(itemEntity);
        const response = await this.#itemsEndpoint.create(resource);
        return ItemAssembler.toDomain(response.data);
    }

    /**
     * Actualiza un ítem existente.
     * @param {Item} itemEntity
     * @returns {Promise<Item>}
     */
    async updateItem(itemEntity) {
        if (!itemEntity.idItem) throw new Error("Item ID is required for update.");
        const resource = ItemAssembler.toResource(itemEntity);
        const response = await this.#itemsEndpoint.update(itemEntity.idItem, resource);
        return ItemAssembler.toDomain(response.data);
    }

    /**
     * Elimina un ítem por su ID.
     * @param {number|string} id
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    deleteItem(id) {
        return this.#itemsEndpoint.delete(id);
    }

    // --- Métodos para Product ---

    /**
     * Obtiene todos los productos.
     * @returns {Promise<Product[]>}
     */
    async getProducts() {
        const response = await this.#productsEndpoint.getAll();
        return ProductAssembler.toDomainList(response);
    }

    /**
     * Obtiene un producto por su ID.
     * @param {number|string} id
     * @returns {Promise<Product>}
     */
    async getProductById(id) {
        const response = await this.#productsEndpoint.getById(id);
        return ProductAssembler.toDomain(response.data);
    }

    /**
     * Crea un nuevo producto.
     * @param {Product} productEntity
     * @returns {Promise<Product>}
     */
    async createProduct(productEntity) {
        const resource = ProductAssembler.toResource(productEntity);
        const response = await this.#productsEndpoint.create(resource);
        return ProductAssembler.toDomain(response.data);
    }

    /**
     * Actualiza un producto existente.
     * @param {Product} productEntity
     * @returns {Promise<Product>}
     */
    async updateProduct(productEntity) {
        if (!productEntity.idProduct) throw new Error("Product ID is required for update.");
        const resource = ProductAssembler.toResource(productEntity);
        const response = await this.#productsEndpoint.update(productEntity.idProduct, resource);
        return ProductAssembler.toDomain(response.data);
    }

    /**
     * Elimina un producto por su ID.
     * @param {number|string} id
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    deleteProduct(id) {
        return this.#productsEndpoint.delete(id);
    }
}
