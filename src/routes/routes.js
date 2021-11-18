const { Router } = require("express");
const products = require("../products");
const payment = require("../mercado-pago/payment");
const login = require("../users");
const events = require("../events");

const routes = Router();

//Products
routes.get("/products/:page/:maxProducts", login.verifyJWT, products.getProducts);
routes.post("/products", login.verifyJWT, products.createProduct);
routes.put("/products", login.verifyJWT, products.updateProduct);
routes.delete("/products", login.verifyJWT, products.deleteProduct);

//Payment
routes.get("/payment", login.verifyJWT, payment.makePayment);

//Users
routes.post("/login", login.login);
routes.post("/createUser", login.createUser);

//Events
routes.get("/events/:page/:maxresults", login.verifyJWT, events.getEvents);
routes.post("/events", login.verifyJWT, events.createEvent);
routes.put("/events", login.verifyJWT, events.updateEvent);
routes.delete("/events", login.verifyJWT, events.deleteEvent);

module.exports = routes;