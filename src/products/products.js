
class Product {
  constructor(id, name, description, price, quantity, size, brand, category, banner, images) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.size = size;
    this.brand = brand;
    this.category = category;
    this.banner = banner;
  }
}

const productConverter = {
  toFirestore: (product) => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      size: product.size,
      brand: product.brand,
      category: product.category,
      banner: product.banner,
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Product(data.id, data.name, data.description, data.price, data.quantity, data.size, data.brand, data.category, data.banner);
  }
}

module.exports = {
  productConverter,
  Product
}