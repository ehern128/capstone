const AppError = require('../utilities/AppError');
const GardenProduce = require('../models/gardenproduce');
const { gardenProduceSchema, reviewSchema } = require('../joiSchemas');
// Require our reviews model
const Review = require('../models/review');
//const isAuthenticated = require('../middleware/isAuthenticated');

// Create a new middleware that checks if the review author is the same as the user that is logged in
module.exports.isReviewCreator = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/newGardenProduce/${id}`);
	}
	next();
};

module.exports.isAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'You must be signed in to do that');
		return res.redirect('/login');
	}
	next();
};

module.exports.validateGardenProduce = (req, res, next) => {
	const { error } = gardenProduceSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((e) => e.message).join(',');
		throw new AppError(msg, 400);
	} else {
		next();
	}
};

module.exports.isCreator = async (req, res, next) => {
	const { id } = req.params;
	const gardenProduce = await Restaurant.findById(id);
	if (!gardenProduce.submittedBy.equals(req.user._id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/newGardenProduce/${id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((e) => e.message).join(',');
		throw new AppError(msg, 400);
	} else {
		next();
	}
};