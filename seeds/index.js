const Dateplace = require("../models/dateplace");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
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

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Dateplace.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const place = new Dateplace({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await place.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});