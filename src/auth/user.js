class User {
  constructor(id, name, cpf, address) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.address = address;
  }
}

const userConverter = {
  toFirestore: (user) => {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      address: user.address
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new User(data.id, data.name, data.cpf, data.address); 
  }
}

module.exports = {
  User,
  userConverter
}