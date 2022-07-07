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

app.get("/makedateplace", async (req, res) => {
    const place = new Dateplace({ title: "Library", description: "books" });
    await place.save();
    res.send(place);
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})

