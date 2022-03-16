const { Router } = require("express");
const products = require("../products");
const payment = require("../mercado-pago/payment");
const login = require("../users");
const events = require("../events");
const banners = require("../banners");
const categories = require("../categories");

const routes = Router();

//Products
routes.get("/products/:page/:maxProducts", products.getProducts);
routes.get("/products/category/:category/:maxResults", products.getProductsByCategory);
routes.get("/products/:id", products.getProductById);
routes.get("/productsByName/:search", products.getByName);
routes.post("/products", products.createProduct);
routes.post("/inStoreSale", products.inStoreSale);
routes.put("/products", login.verifyJWT, products.updateProduct);
routes.delete("/products", login.verifyJWT, products.deleteProduct);

//Categories
routes.get("/categories", categories.getCategories);
routes.post("/categories", login.verifyJWT, categories.createCategory);
routes.delete("/categories", login.verifyJWT, categories.deleteCategory);


//Payment
routes.post("/payment", payment.makePayment);

//Users
routes.post("/login", login.login);
routes.post("/createUser", login.createUser);
routes.put("/user", login.updateUser);

//Events
routes.get("/events/:page/:maxresults", events.getEvents);
routes.get("/events/:id", events.getEventById);
routes.get("/ticket/:code", login.verifyJWT, events.getTicket);
routes.post("/events", login.verifyJWT, events.createEvent);
routes.post("/ticket", events.createTicket);
routes.put("/events", login.verifyJWT, events.updateEvent);
routes.delete("/events", login.verifyJWT, events.deleteEvent);

//Banners
routes.get("/banners", banners.getBanners);

module.exports = routes;