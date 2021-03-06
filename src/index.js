const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const bodyParser = require('body-parser')
const app = express();

app.listen(3000);
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy-Only',
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  )
  console.log(req.method);
  console.log('Time:', Date.now());
  next();
})
app.use(routes);