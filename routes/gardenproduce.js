const express = require('express');
const router = express.Router();
const { restaurantSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
const asyncCatcher = require('../utilities/asyncCatcher');
const gardenProduce = require('../controllers/gardenproduces');
const {
	isAuthenticated,
	validateGardenProduce,
	isCreator,
} = require('../middleware/middleware');

const GardenProduce = require('../models/gardenproduce');

router
	.route('/')
	// Restaurant Index Page
	.get(asyncCatcher(gardenProduce.renderIndex))
	// Create New Restaurant Endpoint
	.post(
		isAuthenticated,
		validateGardenProduce,
		asyncCatcher(gardenProduce.postNewGardenProduce)
	);

// Render New Restaurant Page
router.get('/new', isAuthenticated, gardenProduce.renderNew);

router
	.route('/:id')
	// Show Individual Restaurant Details
	.get(asyncCatcher(gardenProduce.renderShow))
	// Update Restaurant Endpoint
	.put(
		isAuthenticated,
		isCreator,
		validateGardenProduce,
		asyncCatcher(gardenProduce.updateGardenProduce)
	);

// Render Edit Restaurant Page
router.get(
	'/:id/edit',
	isAuthenticated,
	isCreator,
	asyncCatcher(gardenProduce.renderEdit)
);

// Delete Restaurant Endpoint
router.delete(
	'/:id/delete',
	isAuthenticated,
	isCreator,
	asyncCatcher(gardenProduce.deleteGardenProduce)
);

module.exports = router;