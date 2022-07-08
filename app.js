const express = require("express");
const path = require("path");
const Dateplace = require("./models/dateplace");
const methodOverride = require("method-override");



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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/dateplaces", async (req, res) => {
    const dateplaces = await Dateplace.find({});
    res.render("dateplaces/index", { dateplaces });
})

app.get("/dateplaces/new", (req, res) => {
    res.render("dateplaces/new");
})

app.post("/dateplaces", async (req, res) => {
    const dateplace = new Dateplace(req.body.dateplace);
    await dateplace.save();
    res.redirect(`/dateplaces/${dateplace._id}`);
})

app.get("/dateplaces/:id", async (req, res) => {
    const dateplace = await Dateplace.findById(req.params.id);
    res.render("dateplaces/show", { dateplace });
})

app.get("/dateplaces/:id/edit", async (req, res) => {
    const dateplace = await Dateplace.findById(req.params.id);
    res.render("dateplaces/edit", { dateplace });
})

app.put("/dateplaces/:id", async (req, res) => {
    const { id } = req.params;
    const dateplace = await Dateplace.findByIdAndUpdate(id, { ...req.body.dateplace })
    res.redirect(`/dateplaces/${dateplace._id}`);
})

app.delete("/dateplaces/:id", async (req, res) => {
    const { id } = req.params;
    await Dateplace.findByIdAndDelete(id);
    res.redirect("/dateplaces");
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})

