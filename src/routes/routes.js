const { Router } = require("express");
const products = require("../products");
const payment = require("../mercado-pago/payment");
const login = require("../auth");

const routes = Router();

//Products
routes.get("/products/:page/:maxProducts", products.getProducts);
routes.post("/products", products.createProduct);
routes.put("/products", products.updateProduct);
routes.delete("/products", products.deleteProduct);

//Payment
routes.get("/payment", login.verifyJWT, payment.makePayment);

//Login
routes.post("/login", login.login);
routes.post("/createUser", login.createUser);

module.exports = routes;