const express = require('express');
const app = express();
port = 8080;
const MethodOverride = require("method-override");
// ejs mate------------
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

// -----------------------------
const Listing = require("./models/listings");
const mongoose = require('mongoose');
const listingSchema = require('./SchemaValidation.js');
const path = require('path');
app.set('views engine', "views")
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(MethodOverride("_method"));
const wrapAsync = require('./utils/wrapAsync.js');
const expressError = require('./utils/ExpressError.js');


// -------------------------------Connecting to Database

main()
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



// ------------------------------------


app.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});


app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})

//  New route
app.get("/listings/new", (req, res) => {
    res.render('listings/new.ejs');
})
// ------------------------------------------------

// Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing })
}));

function validateListing() {
    let error = listingSchema.validate(req.body) //JOI package validation
    console.log(result);
    if (error) {
        throw new expressError(400,error);
    }
}

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    // let {title,description,image,price,location,country} = req.body;   another method of doing same thing
    // listing object has been created inside the name attribute in new.ejs
    // if (!req.body.listing) {
    //     throw new expressError(404, "please send a valid data for listing");
    // }
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));

// --------------------------------------------
// Edit route 
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))

// Update route---------------------------------
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);

}));


// -------------------------
// Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");

}))
app.all("*", (req, res, next) => {
    next(new expressError(404, "Page not found"));
})

// Error handling middleware
app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Unknown error occured" } = err;
    res.status(statuscode).render('error.ejs', { message });
})


app.listen(port, () => {
    console.log('App is listening to port 8080');
}
);