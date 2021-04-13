const mongoose = require('mongoose');
const GardenProduce = require('../models/gardenproduce.js');

mongoose.connect('mongodb://localhost:27017/gardenProduceCapstone', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,

});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

// Random Sample data. We will add onto this later.
const sampleGardenProduces = [
	{ 
		name: 'Tomatoes', location: 'Sprouts Farmers Market',
		image: 'https://source.unsplash.com/collection/1343727/1600x900',
		description:
			'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque commodi harum unde nesciunt minima! Culpa velit omnis dolore vitae, in ut repellendus fuga cupiditate totam excepturi ullam ab saepe similique.',
		price: '$$',
		dateOpened: 2015, 
		submittedBy: '6057d7a07a644b19ad1e0f6e',
	},
	{ 
		name: 'Chinese Evergreen', location: 'Home Depot',
		image: 'https://source.unsplash.com/collection/1343727/1600x900',
		description:
			'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque commodi harum unde nesciunt minima! Culpa velit omnis dolore vitae, in ut repellendus fuga cupiditate totam excepturi ullam ab saepe similique.',
		price: '$$',
		dateOpened: 2015, 
		submittedBy: '6057d7a07a644b19ad1e0f6e',
	},
	{ 
		name: 'Spider Plant Chlorophytum comosum', location: 'Home Depot',
		image: 'https://source.unsplash.com/collection/1343727/1600x900',
		description:
			'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque commodi harum unde nesciunt minima! Culpa velit omnis dolore vitae, in ut repellendus fuga cupiditate totam excepturi ullam ab saepe similique.',
		price: '$$',
		dateOpened: 2015, 
		submittedBy: '6057d7a07a644b19ad1e0f6e',
	},
	{ 
		name: 'Aloe Vera', location:'Home Depot',
		image: 'https://source.unsplash.com/collection/1343727/1600x900',
		description:
			'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque commodi harum unde nesciunt minima! Culpa velit omnis dolore vitae, in ut repellendus fuga cupiditate totam excepturi ullam ab saepe similique.',
		price: '$$',
		dateOpened: 2015,
		submittedBy: '6057d7a07a644b19ad1e0f6e',
	},
	{ 
		name: 'Bamboo', location: 'Home Depot',
		image: 'https://source.unsplash.com/collection/1343727/1600x900',
		description:
			'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque commodi harum unde nesciunt minima! Culpa velit omnis dolore vitae, in ut repellendus fuga cupiditate totam excepturi ullam ab saepe similique.',
		price: '$$',
		dateOpened: 2015,
		submittedBy: '6057d7a07a644b19ad1e0f6e',
	},
	
];

const seedDB = async () => {
	await GardenProduce.deleteMany({});
	const res = await GardenProduce.insertMany(sampleGardenProduces)
		.then((data) => console.log('Data inserted'))
		.catch((e) => console.log(e));
};

// We run our seeder function then close the database after.
seedDB().then(() => {
	mongoose.connection.close();
});