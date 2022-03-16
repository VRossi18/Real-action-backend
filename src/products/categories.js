class Category {
  constructor(id, name) {
    this.id = id;
    this.category = name;
  }
}

const categoryConverter = {
  toFirestore: (category) =>{
    return {
      id: category.id,
      category: category.name
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Category(data.id, data.name);
  }
}

module.exports = {
  categoryConverter,
  Category
}