
class Category {
  constructor(id, name, docs) {
    this.id = id;
    this.name = name;
    this.docs = docs;
  }
}

const categoryConverter = {
  toFirestore: (product) => {
    return {
      id: product.id,
      name: product.name,
      docs: product.docs,
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Product(data.id, data.name, data.docs);
  }
}

module.exports = {
  categoryConverter,
  Category
}