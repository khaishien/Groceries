var mongoose = require("mongoose");

function connectDB() {
	return new Promise(function(resolve, reject) {
		mongoose.connect("mongodb://127.0.0.1:27017/grocery-app");
		mongoose.Promise = Promise;
		var db = mongoose.connection;

		db.on("error", function(err) {
			reject(err);
		});

		db.once("open", function() {
			resolve();
		});
	});
}

module.exports = connectDB;
