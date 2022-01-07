class Ticket {
  constructor(id, name, email, cpf, event, code) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.event = event;
    this.code = code;
  }
}

const ticketConverter = {
  toFirestore: (ticket) => {
    return {
      id: ticket.id,
      name: ticket.name,
      email: ticket.email,
      cpf: ticket.cpf,
      event: ticket.event,
      code: ticket.code
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Events(data.id, data.name, data.email, data.cpf, data.event, data.code);
  }
}

module.exports = {
  Ticket,
  ticketConverter
}