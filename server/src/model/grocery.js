var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Grocery = new Schema({
	seq: { type: Number, required: true, unique: true },
	upc12: { type: String, required: true },
	brand: { type: String, required: true },
	name: { type: String, required: true }
});

module.exports = mongoose.model("Grocery", Grocery);
