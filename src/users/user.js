class User {
  constructor(id, name, cpf, address, isAdmin) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.address = address;
    this.isAdmin = isAdmin
  }
}

const userConverter = {
  toFirestore: (user) => {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      address: user.address,
      isAdmin: user.isAdmin
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new User(data.id, data.name, data.cpf, data.address, data.isAdmin); 
  }
}

module.exports = {
  User,
  userConverter
}