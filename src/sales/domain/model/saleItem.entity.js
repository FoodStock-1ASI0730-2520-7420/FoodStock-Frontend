export class SaleItem {
    constructor({ id = null, name = '', priceUnit = 0, quantity = 0, saleId = null}) {
        this.id = id;
        this.name = name;
        this.priceUnit = priceUnit;
        this.quantity = quantity;
        this.saleId = saleId
    }

    get subtotal(){
        return this.priceUnit * this.quantity;
    }
}