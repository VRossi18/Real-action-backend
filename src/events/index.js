const { Events, eventsConverter } = require("./events");
const { 
  doc,
  setDoc,
  getDoc,
  query,
  getDocs,
  deleteDoc,
  collection,
  limit,
  where
} = require("firebase/firestore");
const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");
const { Ticket, ticketConverter } = require("./tickets");
const randomatic = require("randomatic");


const getEvents = async (req, res) => {
  try {
    const { page, maxResults } = req.params;

    const docs = [];
    const q = query(collection(db, "events"), limit(maxResults), orderBy("date"),  startAt(page * maxResults));
    const firestoreDocs = await getDocs(q);

    new Promise((resolve, reject) => {
      firestoreDocs.forEach((value) => {
        docs.push(value.data());
      });
    });

    res.status(200).send({ success: true, docs});
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `Erro: ${ex}` });
  }
}

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const ref = doc(db, "events", id);
    const event = await getDoc(ref);
    
    if (event.exists()) {
      res.status(200).send({ success: true, event: event.data() });
    }
    else {
      res.status(200).send({ success: true, event: "Evento não existente" });
    }
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}`})
  }
}

const createEvent = async (req, res) => {
  try {
    const { name, description, image, price, location, date } = req.body;

    const id = uuidv4();
    const ref = doc(db, "events", id).withConverter(eventsConverter);
    await setDoc(ref, new Events(id, name, image, description, price, location, date));

    return res.status(200).send({ success: true, msg: `Event created ${name}` });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}` });
  }
}

const updateEvent = async (req, res) => {
  try {
    const { id, name, description, image, price, location, date } = req.body;

    const existEvent = await doc(db, "events", id);
    const docEvent = await getDoc(existEvent);

    if (docEvent.exists()) {
      const ref = doc(db, "events", id).withConverter(eventsConverter);
      await setDoc(ref, new Events(id, name, image, description, price, location, date));
      
      return res.status(200).send({ success: true, msg: `Event updated ${name}` });
    }
    res.status(200).send({ success: true, msg: `Event non existent` });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} = ${ex.message}` });
  }
}

const deleteEvent = async (req, res) => {
  try {
    const { event } = req.body;

    const delDoc = doc(db, "events", event.id);
    await deleteDoc(delDoc);

    res.status(200).send({ success: true, msg: `Evento deletado` })
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `Erro: ${ex}` });
  }
}

const createTicket = async (req, res) => {
  try {
    const { name, email, cpf, event } = req.body;
    const code = await randomatic('A0A0', 6);

    const id = uuidv4();
    const ref = await doc(db, "tickets", id).withConverter(ticketConverter);
    await setDoc(ref, new Ticket(id, name, email, cpf, event, code));

    //send email
    res.status(200).send({ success: true, msg: `Event confirmation send`, code });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}` });
  }
}

const getTicket = async (req, res) => {
  try {
    const { code } = req.params;
    let validation = {};
    const ticket = query(collection(db, "tickets"), where("code", "==", code));
    const snapshot = await getDocs(ticket);

    new Promise((resolve, reject) => {
      snapshot.forEach(value => validation = value.data());
    })

    res.status(200).send({ success: true, validation })
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}` });
  }
}

const validateTicket = async (req, res) => {
  try {
    const { id, name, email, cpf, event, code } = req.body;
    const ref = ref(db, "tickets", id).withConverter(ticketConverter);
    await setDoc(ref, new Ticket(id, name, email, cpf, event, code, true));
    res.status(200).send({ success: true, msg: "Ticket validado"});
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}` });
  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  createTicket,
  getTicket,
  validateTicket,
  getEventById
}