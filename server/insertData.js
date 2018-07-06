var fs = require("fs");
var Grocery = require("./src/model/grocery");
var connectDB = require("./src/dbConnector");

// First I want to read the file
fs.readFile("./sample-data.txt", "utf8", function read(err, data) {
	if (err) {
		throw err;
	}

	var arrData = data
		.trim()
		.split(/\((.*?)\)/)
		.filter(item => item !== "" && item !== ",\n");

	//data format
	//id , upc12, brand, name
	// console.log(arrData.length);

	connectDB()
		.then(function() {
			console.log("Connection to DB successful");
			return processData(arrData);
		})
		.then(function() {
			console.log("Done insert data!");
			process.exit();
		})
		.catch(function(err) {
			console.log("error", err.message);
			process.exit();
		});
});

function processData(arrData) {
	var arrGrocery = [];
	arrData.forEach(data => {
		var packed = packData(data);
		packed && arrGrocery.push(packed);
	});

	return new Promise(function(resolve, reject) {
		Grocery.insertMany(arrGrocery, function(err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

function packData(data) {
	var columnData = data.split(",");

	var columnData2 = columnData[2] ? columnData[2].replace(/'/g, "") : undefined;
	var columnData3 = columnData[3] ? columnData[3].replace(/'/g, "") : undefined;
	if (columnData && columnData2 && columnData3) {
		var newGrocery = new Grocery({
			seq: columnData[0],
			upc12: columnData[1],
			brand: columnData2,
			name: columnData3
		});
		return newGrocery;
	} else {
		return undefined;
	}
}
