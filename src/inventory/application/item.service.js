import { InventoryApi } from '../infrastructure/inventory-api';
/**
 * ItemService: Represents the Application Layer's Use Case class for the Item entity.
 * Its purpose is to orchestrate business operations (Item CRUD), relying on the
 * Infrastructure Layer (InventoryApi) for persistence.
 * @class
 */

export class ItemService {
    /**
     * @private
     * @type {InventoryApi}
     */
    #inventoryApi;

    /**
     * Initializes the service by injecting the API dependency.
     * @param {InventoryApi} [inventoryApi=new InventoryApi()] - Instance of the API to interact with the infrastructure.
     */
    constructor(inventoryApi = new InventoryApi()) {
        this.#inventoryApi = inventoryApi;
    }
    /**
     * Use Case: Fetches all Items (Finished Dishes).
     * @returns {Promise<Item[]>} A promise that resolves with a list of Item entities.
     */
    async getItems() {
        console.log("ItemService: Executing Use Case 'getItems'...");
        // Delegate to the infrastructure layer
        return this.#inventoryApi.getItems();
    }

    /**
     * Use Case: Creates a new Item.
     * @param {Item} itemEntity - The Item entity to be saved.
     * @returns {Promise<Item>} A promise that resolves with the created Item entity.
     */
    async createItem(itemEntity) {
        console.log("ItemService: Executing Use Case 'createItem'...");
        // Business validation example:
        if (!itemEntity.name) {
            throw new Error("ItemServiceError: Item name cannot be empty.");
        }
        return this.#inventoryApi.createItem(itemEntity);
    }

    /**
     * Use Case: Updates an existing Item.
     * @param {Item} itemEntity - The Item entity with updated data (must include ID).
     * @returns {Promise<Item>} A promise that resolves with the updated Item entity.
     */
    async updateItem(itemEntity) {
        if (!itemEntity.id) {
            throw new Error("ItemServiceError: Item ID is required for update.");
        }
        console.log("ItemService: Executing Use Case 'updateItem'...");
        return this.#inventoryApi.updateItem(itemEntity);
    }

    /**
     * Use Case: Deletes an Item by ID.
     * @param {number|string} id - The ID of the Item to delete.
     * @returns {Promise<any>} A promise that resolves with the deletion response.
     */
    deleteItem(id) {
        console.log(`ItemService: Executing Use Case 'deleteItem' with ID: ${id}`);
        return this.#inventoryApi.deleteItem(id);
    }
}