const express = require("express");
const path = require("path");
const Dateplace = require("./models/dateplace");




const mongoose = require("mongoose");
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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
    res.render("home");
})

app.get("/dateplaces", async (req, res) => {
    const dateplaces = await Dateplace.find({});
    res.render("dateplaces/index", { dateplaces });
})

app.get("/dateplaces/:id", async (req, res) => {
    const dateplace = await Dateplace.findById(req.params.id);
    res.render("dateplaces/show", { dateplace });
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})

