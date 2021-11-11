
class Product {
  constructor(id, name, description, price, quantity, size, brand, category, image) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.size = size;
    this.brand = brand;
    this.category = category;
    this.image = image;
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
      image: product.image
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Product(data.id, data.name, data.description, data.price, data.quantity, data.size, data.brand, data.category, data.image);
  }
}

module.exports = {
  productConverter,
  Product
}