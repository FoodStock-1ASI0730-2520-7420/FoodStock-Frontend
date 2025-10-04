// src/Inventory/infrastructure/inventory-api.js

import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { ItemAssembler } from './item.assembler';
// import { ProductAssembler } from './product.assembler';


const itemsEndpointPath = import.meta.env.VITE_ITEMS_ENDPOINT_PATH || 'items';
const productsEndpointPath = import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH || 'products';

/**
 * InventoryApi class to handle API operations for Inventory context.
 * Extends BaseApi and provides CRUD operations for Items (Finished Dishes) and Products (Raw Materials).
 * * @class
 * @extends BaseApi
 */
export class InventoryApi extends BaseApi {
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #itemsEndpoint;
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #productsEndpoint;

    /**
     * Initializes endpoints for items and products.
     */
    constructor() {
        super();
        this.#itemsEndpoint = new BaseEndpoint(this, itemsEndpointPath);
        this.#productsEndpoint = new BaseEndpoint(this, productsEndpointPath);
    }

    // --- ITEM (Finished Dish) API Operations ---

    /**
     * Fetches all items (dishes/finished products).
     * The result is assembled into an array of Item entities.
     * @returns {Promise<Item[]>} Promise resolving to an array of Item entities.
     */
    async getItems() {
        const response = await this.#itemsEndpoint.getAll();
        return ItemAssembler.toDomainList(response);
    }

    /**
     * Fetches an item by its ID.
     * @param {number|string} id - The ID of the item (id).
     * @returns {Promise<Item>} Promise resolving to the Item entity.
     */
    async getItemById(id) {
        const response = await this.#itemsEndpoint.getById(id);
        return ItemAssembler.toDomain(response.data);
    }

    /**
     * Implements createItem() logic: Creates a new item.
     * The Item entity is converted to a resource before sending.
     * @param {Item} itemEntity - The Item entity to create.
     * @returns {Promise<Item>} Promise resolving to the created Item entity.
     */
    async createItem(itemEntity) {
        const resource = ItemAssembler.toResource(itemEntity);
        const response = await this.#itemsEndpoint.create(resource);
        return ItemAssembler.toDomain(response.data);
    }

    /**
     * Implements editItem() logic: Updates an existing item.
     * @param {Item} itemEntity - The Item entity to update (must include id).
     * @returns {Promise<Item>} Promise resolving to the updated Item entity.
     */
    async updateItem(itemEntity) {
        if (!itemEntity.id) throw new Error("Item ID is required for update.");
        const resource = ItemAssembler.toResource(itemEntity);
        const response = await this.#itemsEndpoint.update(itemEntity.id, resource);
        return ItemAssembler.toDomain(response.data);
    }

    /**
     * Implements deleteItem() logic: Deletes an item by its ID.
     * @param {number|string} id - The ID of the item to delete.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteItem(id) {
        return this.#itemsEndpoint.delete(id);
    }

    // --- PRODUCT (Raw Material) API Operations (Placeholder) ---

    // Aquí irán los métodos para Product cuando se implemente :v
}
// export const inventoryApi = new InventoryApi();