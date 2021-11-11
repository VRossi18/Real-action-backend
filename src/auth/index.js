const jwt = require("jsonwebtoken");
const { auth, db } = require("../firebase");
const { 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail
} = require("firebase/auth");
const { doc, setDoc } = require("firebase/firestore");
const { v4: uuidv4 } = require("uuid");
const { User, userConverter } = require("./user")
const SECRET = "realaction";

const login = async (req, res) => {
  const { email, password } = req.body;
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
const updateUser = {
  
}

module.exports = {
  login,
  verifyJWT,
  createUser
} 
  