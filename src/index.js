const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const app = express();

app.listen(3000);
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method);
  console.log('Time:', Date.now());
  next();
})
app.use(routes);