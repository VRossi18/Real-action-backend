class Events {
  constructor(id, name, image, description, price, location, date) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.price = price;
    this.location = location;
    this.date = date;
  }
}

const eventsConverter = {
  toFirestore: (events) => {
    return {
      id: events.id,
      name: events.name,
      image: events.image,
      description: events.description,
      price: events.price,
      location: events.location,
      date: events.date
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Events(data.id, data.name, data.image, data.description, data.price, data.location, data.date);
  }
}

module.exports = {
  Events,
  eventsConverter
}