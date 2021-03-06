var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var path = require("path");
var User = require("./models/user");
var Web = require("./models/web");

mongoose.connect("mongodb+srv://Karthik:IIdkw31ETaH8YqxN@cluster0.n0d7n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({
    extended: true,
    useUnifiedTopology: true,
})); 

app.use(express.static(path.join(__dirname + "/public")));
app.set('view engine', 'ejs');

// AUTHENTICATION PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "AgentX is the best Penetration Testing Service",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


//ROUTES
app.get("/", function(req, res) {
    res.render('landing');
});

app.get("/signup", function(req, res) {
    res.render('signup');
});

app.post("/signup", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            alert("Invalid credentials");
            return res.render('signup');
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/");
        });
    })
});

app.get("/login", function(req, res) {
    res.render('login');
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/web",
        failureRedirect: "/login"
    }), function(req, res) {}
);

app.get("/web", isLoggedIn, function(req, res) {
    res.render("web");
});

app.post("/web", isLoggedIn, function(req, res) {
    var email = req.body.email;
    var website = req.body.website;
    var user = {
        id: req.user._id,
        username: req.user.username
    };
    var newWeb = {email: email, websiteUrl: website, user: user};
    Web.create(newWeb, function(err, newlyAddedWeb) {
        if(err) {
            console.error(err);
        }
        else {
            res.redirect("/success");
        }
    });
});

app.get("/success", function(req, res) {
    res.render("success");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// PORT
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('The server has started');
});