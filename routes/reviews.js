const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
const asyncCatcher = require('../utilities/asyncCatcher');
const {
	validateReview,
	isAuthenticated,
	isReviewCreator,
} = require('../middleware/middleware');

const GardenProduce = require('../models/gardenproduce');
const Review = require('../models/review');

const reviews = require('../controllers/reviews');

// Create Review Endpoint
router.post(
	'/',
	isAuthenticated,
	validateReview,
	asyncCatcher(reviews.createReview)
);

// Delete Review Endpoint
router.delete(
	'/:reviewId',
	isAuthenticated,
	isReviewCreator,
	asyncCatcher(reviews.deleteReview)
);

module.exports = router;