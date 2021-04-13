const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const asyncCatcher = require('../utilities/asyncCatcher');
const users = require('../controllers/users');

router
	.route('/register')
	.get(users.renderRegister)
	.post(asyncCatcher(users.postRegister));

router
	.route('/login')
	.get(users.renderLogin)
	.post(
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
		}),
		users.postLogin
	);

router.get('/logout', users.logout);

module.exports = router;