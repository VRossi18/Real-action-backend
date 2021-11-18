class Sale {
  constructor(id, userId, productId, saleDate) {
    this.id = id;
    this.userId = userId;
    this.productId = productId;
    this.saleDate = saleDate;
  }
}

const salesConverter = {
  toFirestore: (sale) => {
    return {
      id: sale.id,
      userId: sale.userId,
      productId: sale.productId,
      saleDate: sale.saleDate
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Sale(data.id, data.userId, data.productId, data.saleDate); 
  }
}

module.exports = {
  Sale,
  salesConverter
}