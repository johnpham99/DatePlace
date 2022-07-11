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
        const price = Math.floor(Math.random() * 20) + 10;
        const place = new Dateplace({
            author: "62cc5c43d9b9bf4f1abd9882",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/1691566",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda reprehenderit repellendus impedit dolore. Placeat hic est iste, soluta, numquam consectetur non facilis nihil, voluptatum ullam vero nam ratione nesciunt exercitationem.",
            price
        })
        await place.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});