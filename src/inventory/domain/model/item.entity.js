// src/Inventory/domain/model/item.entity.js

/**
 * Represents an Item entity (Finished Dish/Sold Product) based on the class diagram (idItem, name, price).
 * @class
 */
export class Item {
    /**
     * Creates a new ItemEntity instance.
     * @param {Object} params - The parameters for the item.
     * @param {?number} [params.id=null] - The unique identifier for the item (int).
     * @param {string} [params.name=''] - The name of the dish/product.
     * @param {number} [params.price=0.0] - The unit sale price (float).
     */
    constructor({ id = null, name = '', price = 0 }) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}