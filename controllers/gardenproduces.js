const GardenProduce = require('../models/gardenproduce');

module.exports.renderIndex = async (req, res) => {
	const gardenproduces = await GardenProduce.find({});
	res.render('newGardenProduce/index', { gardenproduces });
};
module.exports.renderNew = (req, res) => {
	res.render('newGardenProduce/new');
};

module.exports.postNewGardenProduce = async (req, res) => {
	const gardenProduce = new GardenProduce(req.body.gardenProduce);
	gardenProduce.submittedBy = req.user._id;
	await gardenProduce.save();
	req.flash('success', 'New Garden Produce was successfully added!');
	res.redirect(`/newGardenProduce/${gardenProduce.id}`);
};

module.exports.renderShow = async (req, res, next) => {
	const { id } = req.params;
	const gardenProduce = await GardenProduce.findById(id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author',
			},
		})
		.populate('submittedBy');
	if (!gardenProduce) {
		req.flash('error', 'Garden Produce does not exist!');
		res.redirect('/newGardenProduce');
	}
	res.render('newGardenProduce/show', { gardenProduce });
};

module.exports.renderEdit = async (req, res) => {
	const { id } = req.params;
	const gardenProduce = await GardenProduce.findById(id);
	if (!gardenProduce) {
		req.flash('error', 'Garden Produce does not exist!');
		res.redirect('/newGardenProduce');
	}
	res.render('newGardenProduce/edit', { gardenProduce });
};

module.exports.updateGardenProduce = async (req, res) => {
	const { id } = req.params;
	const gardenProduce = await GardenProduce.findByIdAndUpdate(id, {
		...req.body.gardenProduce,
	});
	req.flash('success', 'Garden Produce was successfully updated!');
	res.redirect(`/newGardenProduce/${gardenProduce.id}`);
};

module.exports.deleteGardenProduce = async (req, res) => {
	const { id } = req.params;
	await GardenProduce.findByIdAndDelete(id);
	req.flash('success', 'Garden Produce was successfully deleted!');
	res.redirect('/newGardenProduce');
};