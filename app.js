
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();
mongoose.set('strictQuery', true);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/MindValleyDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
 
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.route("/profile")
  .get(function (req, res) {
    if(req.isAuthenticated()){
      
      res.render("profile",{user:req.username,NAME:req.user.username});
      
    } else {
      res.redirect("/register");
  }
})
   

app.route("/")
  .get(function (req, res) {
    res.render("home");
  })

app.route("/med")
  .get(function (req, res) {
    if(req.isAuthenticated()){
      res.render("med");
    } else {
      res.redirect("/register");
    }
  })


  app.get("/register",function (req, res) {
    res.render("register");
  })

  app.post("/register",function(req,res){
    User.register({username: req.body.Username_up,email: req.body.Email_up}, req.body.Password_up,function(err,user){
  if(err){
    console.log(err);
    res.redirect('/');
  } else {
    res.redirect('/register');
  }
    })})

  app.post("/login",function(req,res){

    const user = new User({
      username: req.body.Username_in,
      password: req.body.Password_in
    });
  
    req.login(user, function(err){
      if (err){
        console.log(err);
      } else {
          res.redirect("/med");
      }
    })
  });


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
