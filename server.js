const express = require("express");
const server = express();
var bodyParser = require("body-parser");
const url = require("url");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const usersSchema = require("./User_shema");
const sellSchema = require("./sellingdatabase");
const productSchema = require("./products");
const connectDatabase = require("./Connection");
const expbs = require("express-handlebars");
const Handlebars = require("handlebars");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

let loggedin=false;
let itemid = "";

connectDatabase();

var urlcoder = bodyParser.urlencoded({ extended: false });
server.use(express.static("public"));
server.use(cookieParser());

server.use(session({ secret: "Some secret message" }));
server.engine(
  "handlebars",
  expbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
server.set("view engine", "handlebars");

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/welcome.html");
  loggedin=false;
req.session.destroy
});
server.get("/homepage", (req, res) => {
   res.render("index",{name:req.session.ufn});
 });
server.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
server.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

let name, password;
server.post("/check", urlcoder, function (req, res) {
  response = {
    usernam: req.body.kullanici,
    passwor: req.body.sifre,
  };
  name = response.usernam;
  password = response.passwor;

  sess = req.session;

  usersSchema.findOne({ username: name, password: password }, function (
    err,
    user
  ) {
    if (user) {
      sess.ufn = name;
      loggedin=true;
      res.render("index", { name: sess.ufn,loggedin: loggedin});
    } else {
      res.render("login");
      loggedin=false;
    }
  });
});

let adet = 0;
server.post("/addToBasket", urlcoder, function (req, res) {
  adet = parseInt(req.body.many);
    
  
  productSchema.find({ _id: itemid }, function (err, products) {
   
    if (products) {
      sellSchema.create({
        _id: products[0]._id,
        name: products[0].name,
        price: products[0].price,
        url: products[0].url,
        stok: products[0].stok,
        country: products[0].country,
        adet: adet,
      });
    }
  });
    res.render("products",{loggedin:loggedin});
  
});

server.post("/kayit", urlcoder, function (req, res) {
  response = {
    usernam: req.body.kullanici,
    passwor: req.body.sifre,
    passworag: req.body.sifre_again,
  };
  name = response.usernam;
  password = response.passwor;
  password_again = response.passworag;
  if (password === password_again) {
    usersSchema.create({ username: name, password: password });
    res.sendFile(__dirname + "/" + "login.html");
  }
});

server.get("/item", (req, res) => {
  itemid = url.parse(req.url, true).query.id;
  productSchema.find({ _id: itemid }, function (err, products) {
    var html = "";
    if (products) {
      res.render("itemDetail", { product: products ,loggedin: loggedin});
    }
  });
});
let total = 0;
server.get("/sepetim", (req, res) => {
  sellSchema.find({}, function (err, products) {
    for (var i = 0; i < products.length; i++) {
      total += products[i].price;
    }

    res.render("sepetim", { products: products, total: total });
    total = 0;
  });
});
server.get("/products", (req, res) => {
  productSchema.find({}, function (err, products) {
    res.render("products", { product: products ,loggedin: loggedin});
  });
});
server.post("/selled", urlcoder, function (req, res) {
  sellSchema.find({}, function (err, products) {
    for (var i = 0; i < products.length; i++) {
      productSchema.updateOne(
        { name: products[i].name },
        { stok: products[i].stok - products[i].adet },
        function (err, res) {
          if (err) throw err;
        }
      );
    }
    
  });
  
  sellSchema
    .deleteMany({})
    .then(function () {
      console.log("Data deleted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
    loggedin=false;
  res.render("thankyou",{loggedin: loggedin});
});

const port = 4000;

server.listen(port, () => {
  //Listens everything on our port
  console.log(`Server listening at ${port}`);
});
