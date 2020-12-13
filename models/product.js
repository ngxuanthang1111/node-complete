const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

module.exports = mongoose.model("Product", productSchema);

// const ObjectId = require("mongodb").ObjectId;
// const { getDB } = require("../util/database");

// class Product {
// 	constructor(title, price, description, imageUrl, id, userId) {
// 		this.title = title;
// 		this.price = price;
// 		this.description = description;
// 		this.imageUrl = imageUrl;
// 		this._id = id ? new ObjectId(id) : null;
// 		this.userId = userId;
// 	}

// 	save() {
// 		const db = getDB();
// 		let dbOp;
// 		if (this._id) {
// 			dbOp = db
// 				.collection("products")
// 				.updateOne({ _id: new ObjectId(this._id) }, { $set: this });
// 		} else {
// 			dbOp = db.collection("products").insertOne(this);
// 		}
// 		return dbOp
// 			.then((result) => {
// 				console.log(result);
// 			})
// 			.catch((err) => console.log(err));
// 	}

// 	static fetchAll() {
// 		const db = getDB();
// 		return db
// 			.collection("products")
// 			.find()
// 			.toArray()
// 			.then((products) => {
// 				console.log(products);
// 				return products;
// 			})
// 			.catch((err) => console.log(err));
// 	}

// 	static findById(prodId) {
// 		const db = getDB();

// 		return db
// 			.collection("products")
// 			.find({ _id: new ObjectId(prodId) })
// 			.next()
// 			.then((product) => product)
// 			.catch((err) => console.log(err));
// 	}

// 	static deleteById(prodId) {
// 		const db = getDB();
// 		return db
// 			.collection("products")
// 			.deleteOne({ _id: new ObjectId(prodId) })
// 			.then((result) => {
// 				console.log(result);
// 			})
// 			.catch((err) => console.log(err));
// 	}
// }

// module.exports = Product;
