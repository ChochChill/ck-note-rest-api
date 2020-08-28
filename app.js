const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");
require('dotenv/config');

const port = process.env.PORT || 5000;
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

//import routes
const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute);

const db_url =  `mongodb+srv://${process.env.Mongo_user}:${process.env.Mongo_password}@cluster0.fomdd.mongodb.net/${process.env.Mongo_DB}?retryWrites=true&w=majority`;
mongoose.connect(
  db_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongoDB ..");
  }
);

if (process.env.NODE_ENV === "production") {
  console.log("heloooooo");
  app.use(express.static(__dirname + "/front_end/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "front_end", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("Server running at port", port);
});