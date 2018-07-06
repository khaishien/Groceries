var express = require("express");
var router = express.Router();
var Grocery = require("../model/grocery");

/* GET home page. */
router.get("/", function(req, res, next) {
	res.send("halo world from express!");
});

router.get("/grocery/:id", function(req, res) {
	const seq = req.params.id;

	function getItem() {
		return new Promise(function(resolve, reject) {
			Grocery.findOne(
				{
					seq: seq
				},
				"seq upc12 brand name",
				function(error, grocery) {
					if (error) {
						reject(error);
					} else {
						resolve(grocery);
					}
				}
			);
		});
	}

	getItem()
		.then(function(grocery) {
			res.send({
				error: undefined,
				grocery: grocery
			});
		})
		.catch(function(err) {
			res.send({
				error: err
			});
		});
});

router.put("/grocery/:id", function(req, res) {
	const seq = req.params.id;
	const body = req.body;

	function getItemAndUpdate() {
		return new Promise(function(resolve, reject) {
			Grocery.findOneAndUpdate(
				{
					seq: seq
				},
				{
					brand: body.brand,
					name: body.name,
					upc12: body.upc12
				},
				function(error, grocery) {
					if (error) {
						reject(error);
					} else {
						grocery.brand = body.brand;
						grocery.name = body.name;
						grocery.upc12 = body.upc12;
						resolve(grocery);
					}
				}
			);
		});
	}

	getItemAndUpdate()
		.then(function(grocery) {
			res.send({
				error: undefined,
				grocery: grocery
			});
		})
		.catch(function(err) {
			res.send({
				error: err
			});
		});
});

router.get("/groceries/:page", function(req, res) {
	const prePage = req.params.page;

	//query
	const sort = req.query.sort === "ASC" ? 1 : -1;
	const filterBrand = req.query.brand || "";
	const filterName = req.query.name || "";

	function getPageItems(totalPage) {
		const limit = 20;
		let skip = (prePage - 1) * 20;
		if (totalPage < skip) {
			skip = totalPage;
		}

		return new Promise(function(resolve, reject) {
			Grocery.find(
				{
					brand: { $regex: ".*" + filterBrand + ".*" },
					name: { $regex: ".*" + filterName + ".*" }
				},
				"seq upc12 brand name",
				function(error, groceries) {
					if (error) {
						reject(error);
					} else {
						resolve({ groceries, totalPage });
					}
				}
			)
				.skip(skip)
				.limit(limit)
				.sort({ name: sort });
		});
	}

	function getTotalPage() {
		return new Promise(function(resolve, reject) {
			Grocery.find(
				{
					brand: { $regex: ".*" + filterBrand + ".*" },
					name: { $regex: ".*" + filterName + ".*" }
				},
				function(error, groceries) {
					if (error) {
						reject(error);
					} else {
						const totalPage =
							Math.floor(groceries.length / 20) > 0
								? Math.floor(groceries.length / 20)
								: 1;
						resolve(totalPage);
					}
				}
			);
		});
	}

	getTotalPage()
		.then(function(totalPage) {
			return getPageItems(totalPage);
		})
		.then(function({ groceries, totalPage }) {
			res.send({
				error: undefined,
				groceries: groceries,
				currentPage: prePage,
				totalPage: totalPage
			});
		})
		.catch(function(err) {
			res.send({
				error: err
			});
		});
});

module.exports = router;
