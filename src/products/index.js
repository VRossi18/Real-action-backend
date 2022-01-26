const { db } = require("../firebase");
const { 
  getDocs,
  collection,
  doc,
  query,
  where,
  setDoc,
  limit,
  deleteDoc,
  startAt,
  endAt,
  orderBy,
  startAfter,
  getDoc
} = require("firebase/firestore");
const { productConverter, Product } = require("./products");
const { v4: uuidv4 } = require("uuid");
const { ProviderId } = require("firebase/auth");

const createProduct = async (req, res) => {
  try {
    const { product } = req.body;

    const id = uuidv4();
    const ref = doc(db, "products", id).withConverter(productConverter);
    await setDoc(ref, new Product(id, product.name, product.description, product.price, product.quantity, product.size, product.brand, product.category, product.banner, product.images));

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
    const q = query(collection(db, "products"), limit(maxProducts), orderBy("quantity"),  startAt(page * maxProducts));
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
    const ref = doc(db, "products", product.id).withConverter(productConverter);
    await setDoc(ref, new Product(product.id, product.name, product.description, product.price, product.quantity, product.size, product.brand, product.category, product.banner, product.images));
    res.status(200).send({ success: true, msg: `Produto ${product.name} editado com sucesso` });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `Erro: ${ex}` });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { product } = req.body;

    const delDoc = doc(db, "products", product.id);
    await deleteDoc(delDoc);

    res.status(200).send({ success: true, msg: `Produto deletado` })
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `Erro: ${ex}` });
  }
}

const getProductsByCategory = async (req, res) => {
  try {
    const { category, maxResults } = req.params;
    const docs = [];
    
    const q = query(collection(db, "products"), where("category", "==", category), limit(maxResults));
    const docsFirebase = await getDocs(q);
    
    new Promise((resolve, reject) => {
      docsFirebase.forEach(value => {
        docs.push(value.data());
      });
    });

    res.status(200).send({ success: true, docs });
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}`})
  }
}

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const ref = doc(db, "products", id);
    const product = await getDoc(ref);
    
    if (product.exists()) {
      res.status(200).send({ success: true, product: product.data() });
    }
    else {
      res.status(200).send({ success: true, product: "Produto não existente" });
    }
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}`})
  }
}

const getByName = async (req, res) => {
    try {
      const { search } = req.params;
      const q = query(collection(db, "products"), where("name", ">=", search), where("name", "<=", search + "\uf8ff"));
      const docs = [];
      const snapShot = await getDocs(q);
      new Promise((resolve, reject) => {
        snapShot.forEach(values => {
          docs.push(values.data());
        });
      });

      res.status(200).send({ success: true, docs });
    }
    catch (ex) {
      res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}`});
    }
}


const inStoreSale = async (req, res) => {
    try {
      const { product, quantitySold } = req.body;
      product.quantity -= quantitySold;

      const ref = doc(db, "products", product.id).withConverter(productConverter);
      await setDoc(ref, new Product(product.id, product.name, product.description, product.price, product.quantity, product.size, product.brand, product.category, product.banner, product.images));

      res.status(200).send({ success: true, msg: "Product updated" });
    }
    catch (ex) {
      res.status(500).send({ success: false, msg: `${ex.code} - ${ex.message}`});
    }
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductById,
  inStoreSale,
  getByName
};