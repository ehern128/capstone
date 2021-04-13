const GardenProduce = require('../models/gardenproduce');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
	const { id } = req.params;
	const gardenProduce = await GardenProduce.findById(id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	gardenProduce.reviews.push(review);
	await review.save();
	await gardenProduce.save();
	req.flash('success', 'Review was successfully created!');
	res.redirect(`/gardenProduce/${id}`);
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await GardenProduce.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Review was successfully deleted!');
	res.redirect(`/gardenProduce/${id}`);
};