const express = require('express');
const app = express();
port = 8080;
const MethodOverride = require("method-override");

const Listing = require("./models/listings");
const mongoose = require('mongoose');
const path = require('path');
app.set('views engine',"views")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(MethodOverride("_method"));


// -------------------------------Connecting to Database

main()
.then(()=>{
    console.log("Connected to Database");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



// ------------------------------------


app.get("/",(req,res)=>{
    res.send("Hello bhai saab");
})

// app.get("/test",async (req,res)=>{
//     let sample = new Listing({
//         title:"Villa",
//         description:"800",
//         image:"",
//         Country:"India",
//         location:"Near Beach",
//         price:8000
//     })

//     await sample.save()
//     res.send("Saved Successfully");
// })

app.get('/listings', async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

//  New route
app.get("/listings/new", (req, res) => {
    res.render('listings/new.ejs');
})
// ------------------------------------------------

// Show route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
})

app.post("/listings", async (req,res)=>{
    // let {title,description,image,price,location,country} = req.body;   another method of doing same thing
     // listing object has been created inside the name attribute in new.ejs
    const newlisting = new Listing(req.body.listing);
  await  newlisting.save();
  res.redirect("/listings");


})

// --------------------------------------------
// Edit route 
app.get("/listings/:id/edit",async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

// Update route---------------------------------
app.put("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

})


// -------------------------
// Delete route
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");

})



app.listen(port,()=>{
    console.log('App is listening to port 8080');
}
);