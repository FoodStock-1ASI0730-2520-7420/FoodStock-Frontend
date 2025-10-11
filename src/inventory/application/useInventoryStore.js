// src/Inventory/application/useInventoryStore.js

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ItemService } from "./item.service.js";
import { ProductService } from "./product.service.js";
import { Item } from "../domain/model/item.entity.js";
import Product from '../domain/model/product.entity.js';

const itemService = new ItemService();
const productService = new ProductService();

export const useInventoryStore = defineStore('inventory', () => {
    // --- STATE ---
    const items = ref([]);
    const products = ref([]);
    const errors = ref([]);
    const itemsLoaded = ref(false);
    const productsLoaded = ref(false);

    // --- GETTERS ---
    const itemsCount = computed(() => items.value.length);
    const productsCount = computed(() => products.value.length);

    // --- ACTIONS (Item) ---
    async function fetchItems() {
        if (itemsLoaded.value) return;
        try {
            const fetchedItems = await itemService.getItems();
            items.value = fetchedItems;
            itemsLoaded.value = true;
        } catch (error) {
            console.error("Store Error in fetchItems:", error);
            errors.value.push(error);
        }
    }
    async function addItem(itemEntity) {
        try {
            const newEntity = await itemService.createItem(itemEntity);
            items.value.push(newEntity);
        } catch (error) {
            console.error("Store Error in addItem:", error);
            errors.value.push(error);
            throw error;
        }
    }
    async function deleteItem(id) {
        try {
            await itemService.deleteItem(id);
            const index = items.value.findIndex(i => i.id === id);
            if (index !== -1) items.value.splice(index, 1);
        } catch (error) {
            console.error("Store Error in deleteItem:", error);
            errors.value.push(error);
        }
    }
    async function updateItem(itemEntity) {
        try {
            const updatedEntity = await itemService.updateItem(itemEntity);
            const index = items.value.findIndex(i => i.id === updatedEntity.id);
            if (index !== -1) items.value[index] = updatedEntity;
        } catch (error) {
            console.error("Store Error in updateItem:", error);
            errors.value.push(error);
            throw error;
        }
    }

    // --- ACTIONS (Product) ---
    async function fetchProducts() {
        if (productsLoaded.value) return;
        try {
            const fetchedProducts = await productService.getProducts();
            products.value = fetchedProducts;
            productsLoaded.value = true;
        } catch (error) {
            console.error("Store Error in fetchProducts:", error);
            errors.value.push(error);
        }
    }
    async function addProduct(productEntity) {
        try {
            const newEntity = await productService.createProduct(productEntity);
            products.value.push(newEntity);
        } catch (error) {
            console.error("Store Error in addProduct:", error);
            errors.value.push(error);
            throw error;
        }
    }
    async function deleteProduct(id) {
        try {
            await productService.deleteProduct(id);
            const index = products.value.findIndex(p => p.idProduct === id);
            if (index !== -1) products.value.splice(index, 1);
        } catch (error) {
            console.error("Store Error in deleteProduct:", error);
            errors.value.push(error);
        }
    }
    async function updateProduct(productEntity) {
        try {
            const updatedEntity = await productService.updateProduct(productEntity);
            const index = products.value.findIndex(p => p.idProduct === updatedEntity.idProduct);
            if (index !== -1) products.value[index] = updatedEntity;
        } catch (error) {
            console.error("Store Error in updateProduct:", error);
            errors.value.push(error);
            throw error;
        }
    }

    // --- RETURN ---
    return {
        // State
        items,
        products,
        errors,
        itemsLoaded,
        productsLoaded,

        // Getters
        itemsCount,
        productsCount,

        // Actions
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct
    }
});
