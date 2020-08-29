require("dotenv").config();
const express = require("express");
const bodayParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(bodayParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = mongoose.model("User", userSchema);

app.route("/")

  .get(function(req, res) {
    res.render("home");
  });

app.route("/login")

  .get(function(req, res) {
    res.render("login");
  })

  .post(function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        email: req.body.username
      },
      function(err, foundUser) {
        if (!err) {
          if (foundUser) {
            bcrypt.compare(password,foundUser.password).then(function(result) {
              if (result) {
                res.render("secrets");
              } else {
                console.log(err);
              }
            });
          }
        }
      });
  });

app.route("/register")

  .get(function(req, res) {
    res.render("register");
  })

  .post(function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = User({
        email: req.body.username,
        password: hash
      });
      newUser.save(function(err) {
        if (!err) {
          res.render("secrets");
        } else {
          console.log(err);
        }
      });
    });
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
})
