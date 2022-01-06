const jwt = require("jsonwebtoken");
let { auth, db } = require("../firebase");
const { 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  getAuth,
} = require("firebase/auth");
const { doc, setDoc, query, collection, orderBy, where, getDocs, getDoc, limit } = require("firebase/firestore");
const { v4: uuidv4 } = require("uuid");
const { User, userConverter } = require("./user");
const { Sale, salesConverter } = require("./sales");
const SECRET = "realaction";

const login = async (req, res) => {
  const { email, password } = req.body;
  auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
  .then(userCredential => {
    const token = jwt.sign({ user: email }, SECRET, { expiresIn: 7200 });
    return res.json({ success: true, token });
  })
  .catch(err => {
    const errorCode = err.code;
    const errorMessage = err.message;
    res.status(404).send({  success: false ,msg: `${errorCode} - ${errorMessage}` });
  })
}

const verifyJWT = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).end();
    req.user = decoded.user;
    next();
  })
}

const createUser = async (req, res) => {
  const { email, password, name , address, cpf } = req.body;
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      sendEmailVerification(auth.currentUser)
      .then(async () => {
        const userId = uuidv4();
        const user = doc(db, "users", userId).withConverter(userConverter);
        await setDoc(user, new User(userId, name, cpf, address));
        res.status(200).send({ success: true, msg: "Verification mail sent" });
      })
    })
    .catch(err => {
      const errorCode = err.code;
      const errorMessage = err.message;
      res.status(404).send({ success: false, msg: `${errorCode} - ${errorMessage}` });
    })
}

const updateUser = async (req,res) => {
  try {
    const { id, email, name, address, cpf } = req.body;
    const q = await query(collection(db, "users"), where("cpf", "==", cpf), limit(1));
    const user = await getDocs(q);
    let userSnapShot;
    new Promise((resolve, reject) => {
      user.forEach(value => {
        userSnapShot = value.data();
      })
    })

    if (userSnapShot.cpf !== undefined) {
      await auth.onAuthStateChanged(async (user) => {
        if (email === user.email) {
           await updateEmail(user, email);
        }
        const ref = doc(db, "users", id).withConverter(userConverter);
        await setDoc(ref, new User(id, name, cpf, address));
        return res.status(200).send({ success: true, msg: "User updated"});
     }
    )};
    return res.status(200).send({ success: true, msg: "User not found"});
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}` });
  }
}

const createUserHistory = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const id = uuidv4();
    const userSale = doc(db, "history", id).withConverter(salesConverter);
    await setDoc(userSale, new Sale(id, userId, productId, new Date().toLocaleString("pt-BR")));
    res.status(200).send({ success: true, msg: "User history created" });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}` });
  }
}

const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    const docs = [];
    const q = query(collection(db, "history"), where("userId", "==", userId));
    const results = await getDocs(q);
    new Promise((resolve, reject) => {
      results.forEach((value) => {
        docs.push(value.data());
      });
    });
    res.status(200).send({success: true, docs});
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}` });
  }
}

const updateUserPassword = async (req, res) => {
  try {

  }
  catch (ex) {

  }
}



module.exports = {
  login,
  verifyJWT,
  createUser,
  createUserHistory,
  updateEmail,
  getUserHistory,
  updateUser
} 
  