if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path')
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const GardenProduce = require("./models/gardenproduce.js")
const AppError = require("./utilities/AppError")
const asyncCatcher = require('./utilities/asyncCatcher');
const reviewRoutes = require('./routes/reviews');
const gardenProducesRoutes = require('./routes/gardenproduce');
const session = require('express-session');

const MongoStore = require('connect-mongo');


// We need to first require passport and the user model
const passport = require("passport");
const PassportLocal = require("passport-local");
const User = require('./models/user');

const flash = require("connect-flash");



// Then we can implement the passport options and configuration. It is important that this goes after our session app.use 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});


const authRoutes = require('./routes/users');

app.use("/", authRoutes)


const url =
process.env.DB_STRING || 'mongodb://localhost:27017/gardenProduceCapstone'
//Mongoose connecting to Mongo
mongoose.connect(process.env.DB_STRING, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
})		
.then(() => {
	console.log('Mongo Connection Open');
})
.catch((error) => console.log(error));

	//setting up ejs, ejs mate, path fix - views directory
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set ('views', path.join(__dirname, 'views'));


//Method Overide - let's us make more requests from our form (delete, patch, etc)
app.use(methodOverride('_method'));

// Parse Body Data - incoming requests
app.use(express.urlencoded({extended: true}));

const secret = process.env.SECRET || 'drake'


/*const secret = (req, res, next) => {
	console.log(req.query.secret);
	if (req.query.secret === 'coral') {
		next();
	} else {
		res.send('Not authorized');
	}
};*/

const store = MongoStore.create({
	mongoUrl: url,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret,
	},
});

// This checks for any errors that may occur.
store.on('error', (e) => {
	console.log('Store Error', e);
});
const sessionConfig = {
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());
// Parse Body Data
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
	res.render('home');
});

/*app.get('/', (req, res) => {
	res.render('home');
});*/

app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	console.log(res.locals.success);
	next();
});


app.get('/newGardenProduce', async (req, res) => {
	const gardenproduces = await GardenProduce.find({});
	console.log(gardenproduces);
	res.render('gardenproduce/index', { gardenproduces });
});

app.get("/newGardenProduce/new", (req, res) => {
	res.render('gardenproduce/new')
});

app.get('/newGardenProduce/:id', asyncCatcher(async (req, res) => {
	const { id } = req.params;
	const gardenproduce = await GardenProduce.findById(id).populate('reviews');
	if (!gardenproduce) {
		throw new AppError('Product not found!', 404);
	}
	res.render('gardenproduce/show', { gardenproduce });
	})
);


app.delete(
	'/newGardenProduce/:id/reviews/:reviewId',
	asyncCatcher(async (req, res) => {
		const { id, reviewId } = req.params;
		await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/gardenproduce/${id}`);
	})
);

app.post('/newGardenProduce', asyncCatcher(async (req, res) => {
	const gardenproduce = new GardenProduce(req.body.gardenproduce);
	await gardenproduce.save();
	res.redirect(`/newGardenProduce/${gardenproduce.id}`);
	})
);

app.get('/newGardenProduce/:id/edit', asyncCatcher(async (req, res) => {
	const { id } = req.params;
	const gardenproduce = await GardenProduce.findById(id);
	res.render('gardenproduce/edit', { gardenproduce });
	})
);

app.put("/newGardenProduce/:id", asyncCatcher(async (req, res, next) => {
	const { id } = req.params
	// Let's start off by just testing our route
	const gardenproduce = await GardenProduce.findByIdAndUpdate(id);
	res.redirect(`/newGardenProduce/${id}`);
	if (!gardenproduce) {
		return next(new AppError('Product not found!', 404));
	}
	res.render('gardenproduce/show', { restaurant });

	})
);

app.delete('/newGardenProduce/:id/delete', asyncCatcher(async (req, res) => {
	const { id } = req.params;
	await GardenProduce.findByIdAndDelete(id);
	res.redirect('/newGardenProduce');
	})
);

app.use((req, res) => {
	res.status(404).send("Page not found.")
});





app.get('/error', (req, res) => {
	// blah;
	res.status(500);
	throw new AppError("I am from AppError", 500)
});


app.use((err, req, res, next) => {
	const {status = 500} = err
	const {message = "I am in danger"} = err
	res.status(status).send(message)
});


app.use('*', (req, res, next) => {
	next(new AppError('Page Not Found'), 404);
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	const { message = 'I am in danger' } = err;
	res.status(status).render('error', { err });
});

app.use('/newGardenProduce', gardenProducesRoutes);
app.use('/', reviewRoutes);


const port = process.env.PORT || 3000;


app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
