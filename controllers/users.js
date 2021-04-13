const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
	res.render('users/register');
};

module.exports.postRegister = async (req, res) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const newUser = await User.register(user, password);
		req.login(newUser, (err) => {
			if (err) return next(e);
			req.flash('success', 'Welcome to the Garden Produce Hub! ');
			res.redirect('/newGardenProduce');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
};

module.exports.postLogin = (req, res) => {
	req.flash('success', 'Welcome back to the Garden Produce Hub');
	res.redirect('/newGardenProduce');
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Come back soon!');
	res.redirect('/login');
};