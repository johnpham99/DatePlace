const express = require("express");
const path = require("path");
const Dateplace = require("./models/dateplace");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const { dateplaceSchema, reviewSchema } = require("./schemas.js");
const Review = require("./models/review");


const mongoose = require("mongoose");
const dateplace = require("./models/dateplace");
mongoose.connect("mongodb://localhost:27017/date-place", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});



const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateDateplace = (req, res, next) => {
    const { error } = dateplaceSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/dateplaces", catchAsync(async (req, res, next) => {
    const dateplaces = await Dateplace.find({});
    res.render("dateplaces/index", { dateplaces });
}))

app.post("/dateplaces", validateDateplace, catchAsync(async (req, res, next) => {
    const dateplace = new Dateplace(req.body.dateplace);
    await dateplace.save();
    res.redirect(`/dateplaces/${dateplace._id}`);
}))

app.get("/dateplaces/new", (req, res) => {
    res.render("dateplaces/new");
})

app.get("/dateplaces/:id", catchAsync(async (req, res, next) => {
    const dateplace = await Dateplace.findById(req.params.id).populate("reviews");
    console.log(dateplace);
    res.render("dateplaces/show", { dateplace });
}))

app.get("/dateplaces/:id/edit", catchAsync(async (req, res, next) => {
    const dateplace = await Dateplace.findById(req.params.id);
    res.render("dateplaces/edit", { dateplace });
}))

app.put("/dateplaces/:id", validateDateplace, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const dateplace = await Dateplace.findByIdAndUpdate(id, { ...req.body.dateplace })
    res.redirect(`/dateplaces/${dateplace._id}`);
}))

app.delete("/dateplaces/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Dateplace.findByIdAndDelete(id);
    res.redirect("/dateplaces");
}))

app.post("/dateplaces/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const dateplace = await Dateplace.findById(req.params.id);
    const review = new Review(req.body.review);
    dateplace.reviews.push(review);
    await review.save();
    await dateplace.save();
    res.redirect(`/dateplaces/${dateplace._id}`);
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render("error", { err })
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})
