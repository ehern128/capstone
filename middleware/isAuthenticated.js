module.exports.isAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'You must be signed in to do that');
		return res.redirect('/login');
	}
	next();
};

// Then we can require and use this in our routes. Go ahead and cut out the authenticated logic from the new restaurant render route and add the middleware to all the routes that we want the user to be logged in for.

const express = require('express');
const router = express.Router();
const { restaurantSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
//const asyncCatcher = require('../utilities/asyncCatcher');
const { isAuthenticated } = require('../middleware/isAuthenticated');

function asyncCatcher(func) {
	return function (req, res, next) {
		func(req, res, next).catch((e) => next(e));
	};
}

const GardenProduce = require('../models/gardenproduce');

const validateGardenProduce = (req, res, next) => {
	const { error } = GardenProduceSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((e) => e.message).join(',');
		throw new AppError(msg, 400);
	} else {
		next();
	}
};

// Restaurant Index Page
router.get(
	'/',
	asyncCatcher(async (req, res) => {
		const gardenProduce = await GardenProduce.find({});
		res.render('newGardenProduce/index', { gardenProduce });
	})
);

// Render New Restaurant Page
router.get('/new', isAuthenticated, (req, res) => {
	res.render('newGardenProduce/new');
});

// Create New Restaurant Endpoint
router.post(
	'/',
	isAuthenticated,
	validateGardenProduce,
	asyncCatcher(async (req, res) => {
		const gardenProduce = new GardenProduce(req.body.gardenProduce);
		await gardenProduce.save();
		req.flash('success', 'New gardenProduce was successfully added!');
		res.redirect(`/newGardenProduce/${gardenProduce.id}`);
	})
);

// Show Individual Restaurant Details
router.get(
	'/:id',
	asyncCatcher(async (req, res, next) => {
		const { id } = req.params;
		const gardenProduce = await GardenProduce.findById(id).populate('reviews');
		if (!restaurant) {
			req.flash('error', 'Restaurant does not exist!');
			res.redirect('/newGardenProduce');
		}
		res.render('newGardenProduce/show', { gardenProduce });
	})
);

// Render Edit Restaurant Page
router.get(
	'/:id/edit',
	isAuthenticated,
	asyncCatcher(async (req, res) => {
		const { id } = req.params;
		const gardenProduce = await GardenProduce.findById(id);
		if (!gardenProduce) {
			req.flash('error', 'Restaurant does not exist!');
			res.redirect('/newGardenProduce');
		}
		res.render('newGardenProduce/edit', { gardenProduce });
	})
);

// Update Restaurant Endpoint
router.put(
	'/:id',
	isAuthenticated,
	validateGardenProduce,
	asyncCatcher(async (req, res) => {
		const { id } = req.params;
		const gardenProduce = await GardenProduce.findByIdAndUpdate(id, {
			...req.body.gardenProduce,
		});
		req.flash('success', 'GardenProduce was successfully updated!');
		res.redirect(`/newGardenProduce/${gardenProduce.id}`);
	})
);

// Delete Restaurant Endpoint
router.delete(
	'/:id/delete',
	isAuthenticated,
	asyncCatcher(async (req, res) => {
		const { id } = req.params;
		await GardenProduce.findByIdAndDelete(id);
		req.flash('success', 'GardenProduce was successfully deleted!');
		res.redirect('/newGardenProduce');
	})
);

module.exports = router;