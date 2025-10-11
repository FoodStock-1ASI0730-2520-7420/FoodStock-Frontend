// src/inventory/domain/model/product.entity.js

class Product {
  constructor({ idProduct, name, unitPrice, totalPrice, quantity, expirationDate, category }) {
    this.idProduct = idProduct;
    this.name = name;
    this.unitPrice = unitPrice;
    this.totalPrice = totalPrice;
    this.quantity = quantity;
    this.expirationDate = expirationDate;
    this.category = category;
    this.deleted = false;
  }

  static createProduct(data) {
    return new Product(data);
  }

  editProduct(updates) {
    Object.assign(this, updates);
  }

  deleteProduct() {
    this.deleted = true;
  }
}

export default Product;