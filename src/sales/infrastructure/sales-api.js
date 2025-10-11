import {BaseApi3} from "../../shared/infrastructure/base-api-3.js";
import {BaseEndpoint3} from "../../shared/infrastructure/base-endpoint-3.js";

const salesEndpointPath    = import.meta.env.VITE_SALES_ENDPOINT_PATH;
const saleItemsEndpointPath    = import.meta.env.VITE_SALEITEMS_ENDPOINT_PATH;

export class SalesApi extends BaseApi3 {
    #salesEndpoint;
    #saleItemsEndpoint;

    constructor() {
        super();
        this.#salesEndpoint = new BaseEndpoint3(this, salesEndpointPath);
        this.#saleItemsEndpoint = new BaseEndpoint3(this, saleItemsEndpointPath);
    }

    getSales() {
        return this.#salesEndpoint.getAll();
    }

    getSaleById(id) {
        return this.#salesEndpoint.getById(id);
    }

    createSale(resource) {
        return this.#salesEndpoint.create(resource);
    }

    updateSale(resource) {
        return this.#salesEndpoint.update(resource.id, resource);
    }

    deleteSale(id) {
        return this.#salesEndpoint.delete(id);
    }

    getSaleItems(saleId) {
        return this.#salesEndpoint.getById(saleId).then(sale => sale.saleItems);
    }

    getSaleItemBySaleId(id) {
        return this.#saleItemsEndpoint.getAll({id});
    }

    createSaleItem(resource) {
        return this.#saleItemsEndpoint.create(resource);
    }

    updateSaleItem(resource) {
        return this.#saleItemsEndpoint.update(resource.id, resource);
    }

    deleteSaleItem(id) {
        return this.#saleItemsEndpoint.delete(id);
    }
}