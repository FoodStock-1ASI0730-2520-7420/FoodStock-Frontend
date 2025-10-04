import {Item} from "../domain/model/item.entity.js";

/**
 * Assembler for converting API resources to Item entities.
 * @class
 */
export class ItemAssembler {
    /**
     * Converts a Data Transfer Object (DTO) from the API to an ItemEntity.
     * @param {Object} resource - The resource object representing an item (dish).
     * @returns {Item}  The corresponding Item entity.
     */
    static toDomain(resource) {
        const domainData = {
            id: resource.id || resource.id,
            name: resource.name,
            price: resource.price,
        };
        return new Item(domainData);
    }

    /**
     * Converts an API response to an array of Item entities.
     * Logs an error and returns an empty array if the response status is not 200.
     *
     * @param {import('axios').AxiosResponse} response - The API response containing item data.
     * @returns {Item[]} Array of Item entities.
     */
    static toDomainList(response) {
        if (response.status !== 200) {
            console.error(`Error ${response.status}: ${response.statusText} during item list fetching.`);
            return [];
        }

        let resources = response.data instanceof Array ? response.data : response.data.items;

        if (!resources) {
            console.warn("API response data structure is missing 'items' property or is not an array.");
            return [];
        }

        return resources.map(resource => ItemAssembler.toDomain(resource));
    }
    /**
     * Converts an ItemEntity to a DTO ready to be sent to the API.
     * * @param {Item} item - The domain entity.
     * @returns {object} The DTO object.
     */
    static toResource(itemEntity) {

        const resource = {
            name: itemEntity.name,
            price: itemEntity.price,
        };

        if (itemEntity.id !== null) {
            resource.id = itemEntity.id;
        }

        return resource;
    }
}