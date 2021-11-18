const { Events, eventsConverter } = require("./events");
const { 
  doc,
  setDoc,
  getDoc,
  query,
  getDocs,
  deleteDoc,
  collection,
  limit
} = require("firebase/firestore");
const { db } = require("../firebase");
const { v4: uuidv4 } = require("uuid");


const getEvents = async (req, res) => {
  try {
    const { page, maxResults } = req.params;
    const docs = [];

    const first = query(collection(db, "events"), limit(maxResults * page));
    const snapshot = await getDocs(first);

    new Promise((resolve, reject) => {
      snapshot.forEach((value) => {
        docs.push(value.data());
      });
    });

    res.status(200).send({ success: true, docs });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}` });
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
    const { id } = req.body;
    const existent = await doc(db, "events", id);
    const docEvent = await getDoc(existent);
    
    if (docEvent.exists()) {
      await deleteDoc(docEvent);
      res.status(200).send({ success: true, msg: `Event deleted` });
    }
    res.status(200).send({ success: true, msg: `Event non existent` });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}` });
  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
}