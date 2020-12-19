const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const dotENV = require('dotenv')
// const cookieParser = require("cookie-parser"); // use for client-side

// TODO: Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// TODO: Controller
const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;

// TODO: Initial MongoDB contain session
const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: "sessions",
});

const csrfProtection = csrf();

// TODO: Assign path view ejs
app.set("view engine", "ejs");
app.set("views", "views");

// app.use(cookieParser());
// // set a cookie
// app.use(function (req, res, next) {
// 	// check if client sent cookie
// 	var cookie = req.cookies.cookieName;
// 	if (cookie === undefined) {
// 		// no: set a new cookie
// 		var randomNumber = Math.random().toString();
// 		randomNumber = randomNumber.substring(2, randomNumber.length);
// 		res.cookie("cookieName", randomNumber, { maxAge: 900000, httpOnly: true });
// 		console.log("cookie created successfully");
// 	} else {
// 		// yes, cookie was already present
// 		console.log("cookie exists", cookie);
// 	}
// 	next(); // <-- important!
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({
		secret: "my secret",
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}

	User.findById(req.session.user._id)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(MONGODB_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
	})
	.then((result) => {
		dotENV.config()
		app.listen(3000);
	})
	.catch((err) => console.log(err));
