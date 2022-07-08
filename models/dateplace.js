const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DatePlaceSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model("Dateplace", DatePlaceSchema);