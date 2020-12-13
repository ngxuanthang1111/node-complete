const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// const cookieParser = require("cookie-parser"); // use for client-side

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
	"mongodb+srv://admin:admin@cluster0.utt8a.mongodb.net/node-complete";

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

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

app.use((req, res, next) => {
	User.findById("5fcb63b6629c641ee43933f8")
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
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
		User.findOne()
			.then((user) => {
				if (!user) {
					const user = new User({
						name: "Thang",
						email: "thang@gmail.com",
						cart: {
							items: [],
						},
					});

					user.save();
				}
			})
			.catch((error) => console.log(error));
		app.listen(3000);
	})
	.catch((err) => console.log(err));
