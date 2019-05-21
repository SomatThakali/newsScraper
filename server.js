const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8084;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const routes = require("./routes/routes");
app.use(routes);
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
