const express = require("express");
const path = require("path");
const Dateplace = require("./models/dateplace");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
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


const dateplaces = require("./routes/dateplaces");
const reviews = require("./routes/reviews");


app.use("/dateplaces", dateplaces);
app.use("/dateplaces/:id/reviews", reviews);

app.get("/", (req, res) => {
    res.render("home");
})

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
