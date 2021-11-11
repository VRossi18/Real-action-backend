const { initializeApp } = require("firebase/app");
const { getAuth, onAuthStateChanged } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBbwYxus7fuVrPuLfueqjGEtb_j4GLY4W4",
  authDomain: "real-action-dd3f4.firebaseapp.com",
  projectId: "real-action-dd3f4",
  storageBucket: "real-action-dd3f4.appspot.com",
  messagingSenderId: "324838737248",
  appId: "1:324838737248:web:be7aef941b5ce039a0ca05"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = {
  app,
  db,
  auth
}