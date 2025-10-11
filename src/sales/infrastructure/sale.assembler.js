import {SaleItem} from "../domain/model/saleItem.entity.js";
import {Sale} from "../domain/model/sale.entity.js";

export class SaleAssembler {
    static toEntityFromResource(resource) {
        return new Sale({
            id: resource.id,
            saleType: resource.saleType,
            paymentMethod: resource.paymentMethod,
            creationDate: resource.creationDate,
            creationTime: resource.creationTime,
            waiter: resource.waiter,
            total: resource.total
        })
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['sales'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}