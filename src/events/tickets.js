class Ticket {
  constructor(id, name, email, cpf, event, code, isValidated) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.event = event;
    this.code = code;
    this.isValidated = isValidated
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
      code: ticket.code,
      isValidated: ticket.isValidated
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Events(data.id, data.name, data.email, data.cpf, data.event, data.code, data.isValidated);
  }
}

module.exports = {
  Ticket,
  ticketConverter
}