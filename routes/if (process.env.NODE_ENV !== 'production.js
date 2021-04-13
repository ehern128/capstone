if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const AppError = require('./utilities/AppError');
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');
const PassportLocal = require('passport-local');
const User = require('./models/user');

const gardenProduceRoutes = require('./routes/gardenproduce');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/users');

const MongoStore = require('connect-mongo');

const url =
	process.env.DB_STRING || 'mongodb://localhost:27017/gardenProduceCapstone';

// Database Config
mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

// Set EJS View Engine, EJS mate, and Path Fix
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));

// Add Public Folder and fix our path
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));

// Parse Body Data
app.use(express.urlencoded({ extended: true }));

// Method Override for Forms
app.use(methodOverride('_method'));

// Connect Mongo Store
const secret = process.env.SECRET || 'drake';

const store = MongoStore.create({
	mongoUrl: url,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret,
	},
});

store.on('error', (e) => {
	console.log('Store Error', e);
});

// Express Session
const sessionConfig = {
	store,
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

// Connect Flash
app.use(flash());

// Passport Configuration/Settings

app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ------- Middleware -------

// Local Variables
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// ------- Index Route -------

app.get('/', (req, res) => {
	res.render('home');
});

// ------- Garden Produce Routes -------
app.use('/newGardenProduce', gardenProduceRoutes);

// ------- Review Routes -------
app.use('/newGardenProduce/:id/reviews', reviewRoutes);

// ------- Auth Routes -------
app.use('/', authRoutes);

// ------- 404 -------

app.all('*', (req, res, next) => {
	next(new AppError('Page Not Found'), 404);
});

// ------- ERROR MIDDLEWARE -------
app.use((err, req, res, next) => {
	const { status = 500 } = err;
	const { message = 'I am in danger' } = err;
	res.status(status).render('error', { err });
});

// ------- APP Listener -------

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Running on port ${port}`);
});