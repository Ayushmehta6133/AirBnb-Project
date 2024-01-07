const mongoose = require('mongoose');
const initdata = require('./data');
const Listing = require('../models/listings');

main()
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initDb = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data)
    console.log('Data has been initialized');
};

initDb();