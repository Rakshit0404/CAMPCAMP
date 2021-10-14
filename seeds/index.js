const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connection setup');
    })
    .catch(err => {
        console.log('error encountered');
        console.log(err);
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const Seeddb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10) + 50;
        const newcampground = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            image: "http://source.unsplash.com/collection/155011",
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique ipsa aperiam rerum quaerat. Velit minima beatae culpa, itaque, iste a quis est, esse magnam possimus nemo? Libero eaque itaque fugit.',
            price
        });
        await newcampground.save();
    }
}

Seeddb().then(() => {
    mongoose.connection.close();
})