const { db } = require("../firebase");
const {
  getDocs, collection, getDoc
} = require("firebase/firestore");
const { query } = require("express");

const getBanners = async (req, res) => {
  try {
    const banners = await collection(db, "banners", "banners");
    const obj = await getDoc(banners);

    if (obj.exists()) {
      res.status(200).send({ success: true, banners: banners.data() });
    }
    else {
      res.status(404).send({ success: false, banners: "banners not found" });
    }
  }
  catch (ex) {
    res.status(500).send({ success: false, msg: `${ex.code} = ${ex.message}` });
  }
}

module.exports = {
  getBanners
}