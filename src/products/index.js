const { db } = require("../firebase");
const { 
  getDocs,
  collection,
  doc,
  query,
  where,
  setDoc,
  limit,
  deleteDoc
} = require("firebase/firestore");
const { productConverter, Product } = require("./products");
const { v4: uuidv4 } = require("uuid");

const createProduct = async (req, res) => {
  try {
    const { product } = req.body;

    const id = uuidv4();
    const ref = doc(db, "products", id).withConverter(productConverter);
    await setDoc(ref, new Product(id, product.name, product.description, product.price, product.quantity, product.size, product.brand, product.category, product.image));

    return res.status(200).send({ success: true, msg: `Produto ${product.name} cadastrado com sucesso`});
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `Erro: ${ex}` });
  }
}

const getProducts = async (req, res) => {
  try {
    const { page, maxProducts } = req.params;

    const docs = [];
    const q = query(collection(db, "products"), limit(maxProducts));
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

const updateProduct = async (req, res) => {
  try {
    const { product } = req.body;
    await createProduct(product);
    res.status(200).send({ success: true, msg: `Produto ${product.name} editado com sucesso` });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `Erro: ${ex}` });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { product } = req.body;

    const delDoc = doc(db, product.category, product.id);
    await deleteDoc(delDoc);

    res.status(200).send({ success: true, msg: `Produto deletado` })
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `Erro: ${ex}` });
  }
}

const getProductsByCategory = async (req, res) => {
  try {
    const { category, maxResults } = req.body;
    const docs = [];
    
    const q = query(collection(db, "products"), where("category", "==", category), limit(maxResults));
    const docs = await getDocs(q);
    
    new Promise((resolve, reject) => {
      docs.forEach(value => {
        docs.push(value.data());
      });
    });

    res.status(200).send({ success: true, docs });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} = ${ex.message}`})
  }
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};