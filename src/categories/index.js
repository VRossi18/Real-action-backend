const { db } = require("../firebase");
const { 
  getDocs,
  collection,
  doc,
  query,
  setDoc,
  limit,
  deleteDoc,
  startAt,
  orderBy,
} = require("firebase/firestore");
const { categoryConverter, Category } = require("./categories");
const { v4: uuidv4 } = require("uuid");

const createCategory = async (req, res) => {
  try {
    const { name, docs } = req.body;

    const id = uuidv4();
    const ref = doc(db, "categories", id).withConverter(categoryConverter);
    await setDoc(ref, new Category(id, name, docs));

    return res.status(200).send({ success: true, msg: `Categoria ${name} criada com sucesso`});
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `Erro: ${ex}` });
  }
}

const getCategories = async (req, res) => {
  try {
    const docs = [];
    const q = query(collection(db, "categories"), limit(1000), orderBy("name"),  startAt(0 * 1000));
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

const deleteCategory = async (req, res) => {
  try {
    const { category } = req.body;

    const delDoc = doc(db, "categories", category.id);
    await deleteDoc(delDoc);

    res.status(200).send({ success: true, msg: `Categoria deletada` })
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `Erro: ${ex}` });
  }
}

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};