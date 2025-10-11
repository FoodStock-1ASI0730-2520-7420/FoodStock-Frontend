// src/inventory/infrastructure/product.assembler.js
import Product from '../domain/model/product.entity.js';


/**
 * Assembler para convertir recursos API a entidades Product.
 * @class
 */
export class ProductAssembler {
    /**
     * Convierte un DTO de la API a una entidad Product.
     * @param {Object} resource - El objeto recurso que representa un producto.
     * @returns {Product} La entidad Product correspondiente.
     */
    static toDomain(resource) {
        const domainData = {
            idProduct: resource.idProduct || resource.id,
            name: resource.name,
            unitPrice: resource.unitPrice,
            totalPrice: resource.totalPrice,
            quantity: resource.quantity,
            expirationDate: resource.expirationDate,
            category: resource.category,
        };
        return new Product(domainData);
    }

    /**
     * Convierte una respuesta de la API en un array de entidades Product.
     * @param {import('axios').AxiosResponse} response - La respuesta de la API con datos de productos.
     * @returns {Product[]} Array de entidades Product.
     */
    static toDomainList(response) {
        if (response.status !== 200) {
            console.error(`Error ${response.status}: ${response.statusText} al obtener la lista de productos.`);
            return [];
        }

        let resources = Array.isArray(response.data) ? response.data : response.data.products;

        if (!resources) {
            console.warn("La estructura de datos de la respuesta API no contiene 'products' o no es un array.");
            return [];
        }

        return resources.map(resource => ProductAssembler.toDomain(resource));
    }

    /**
     * Convierte una entidad Product a un DTO listo para enviar a la API.
     * @param {Product} productEntity - La entidad de dominio.
     * @returns {object} El objeto DTO.
     */
    static toResource(productEntity) {
        const resource = {
            name: productEntity.name,
            unitPrice: productEntity.unitPrice,
            totalPrice: productEntity.totalPrice,
            quantity: productEntity.quantity,
            expirationDate: productEntity.expirationDate,
            category: productEntity.category,
        };

        if (productEntity.idProduct !== null) {
            resource.idProduct = productEntity.idProduct;
        }

        return resource;
    }
}
