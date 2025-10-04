// src/Inventory/application/useInventoryStore.js

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ItemService } from "./item.service.js";
import { Item } from "../domain/model/item.entity.js";
// import { Product } from "../domain/model/product.entity.js"; aun no usado :v
// Instantiate the Service. This is the store's dependency from the Application Layer.
const itemService = new ItemService();

/**
 * Inventory Store: Manages all state and CRUD operations for the Inventory context.
 * It serves as the single entry point for Vue components to access data and perform actions.
 */
export const useInventoryStore = defineStore('inventory', () => {

    // --- STATE (Reactive Data) ---

    /**
     * List of Item entities (Dishes/Finished Products).
     * @type {import('vue').Ref<Item[]>}
     */
    const items = ref([]);

    /**
     * Placeholder for Product entities (Raw Materials).
     * @type {import('vue').Ref<Product[]>}
     */
    const products = ref([]);

    /**
     * List of errors encountered during operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Flag to indicate if Item entities have been loaded.
     * @type {import('vue').Ref<boolean>}
     */
    const itemsLoaded = ref(false);

    /**
     * Flag to indicate if Product entities have been loaded.
     * @type {import('vue').Ref<boolean>}
     */
    const productsLoaded = ref(false);


    // --- GETTERS (Computed Properties) ---

    /**
     * Returns the number of loaded Item entities.
     * @type {import('vue').ComputedRef<number>}
     */
    const itemsCount = computed(() => items.value.length);


    // --- ACTIONS (Item CRUD Operations) ---

    /**
     * Action: Fetches Item entities via the ItemService and updates state.
     * @function
     * @returns {void}
     */
    async function fetchItems() {
        if (itemsLoaded.value) return;

        try {
            // Call the Application Layer (ItemService)
            const fetchedItems = await itemService.getItems();

            // Mutate the reactive state
            items.value = fetchedItems;
            itemsLoaded.value = true;
        } catch (error) {
            console.error("Store Error in fetchItems:", error);
            errors.value.push(error);
        }
    }

    /**
     * Action: Adds a new Item via the ItemService and updates state.
     * @function
     * @param {Item} itemEntity - The Item entity to add.
     * @returns {void}
     */
    async function addItem(itemEntity) {
        try {
            // Call the Application Layer (ItemService)
            const newEntity = await itemService.createItem(itemEntity);

            // Mutate the state optimistically
            items.value.push(newEntity);
        } catch (error) {
            console.error("Store Error in addItem:", error);
            errors.value.push(error);
            throw error;
        }
    }

    /**
     * Action: Deletes an Item via the ItemService and updates state.
     * @function
     * @param {number|string} id - The ID of the Item to delete.
     * @returns {void}
     */
    async function deleteItem(id) {
        try {
            // Call the Application Layer (ItemService)
            await itemService.deleteItem(id);

            // Mutate the state optimistically
            const index = items.value.findIndex(i => i.id === id);
            if (index !== -1) items.value.splice(index, 1);
        } catch (error) {
            console.error("Store Error in deleteItem:", error);
            errors.value.push(error);
        }
    }

    /**
     * Action: Updates an existing Item via the ItemService and updates state.
     * @function
     * @param {Item} itemEntity - The Item entity with updated data (must include ID).
     * @returns {void}
     */
    async function updateItem(itemEntity) {
        try {
            const updatedEntity = await itemService.updateItem(itemEntity);

            // Find and replace the updated item in the local array
            const index = items.value.findIndex(i => i.id === updatedEntity.id);
            if (index !== -1) items.value[index] = updatedEntity;
        } catch (error) {
            console.error("Store Error in updateItem:", error);
            errors.value.push(error);
            throw error;
        }
    }


    // --- RETURN (Exposed Store Methods/State) ---

    return {
        // State
        items,
        products,
        errors,
        itemsLoaded,
        productsLoaded,

        // Getters
        itemsCount,

        // Actions
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
    }
});