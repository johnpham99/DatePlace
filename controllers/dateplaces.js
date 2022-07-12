const Dateplace = require("../models/dateplace");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
    const dateplaces = await Dateplace.find({});
    res.render("dateplaces/index", { dateplaces });
}

module.exports.renderNewForm = (req, res) => {
    res.render("dateplaces/new");
}

module.exports.createDateplace = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.dateplace.location,
        limit: 1
    }).send();
    const dateplace = new Dateplace(req.body.dateplace);
    dateplace.geometry = geoData.body.features[0].geometry;
    dateplace.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    dateplace.author = req.user._id;
    await dateplace.save();
    req.flash("success", "Sucessfully made a new dateplace!");
    res.redirect(`/dateplaces/${dateplace._id}`);
}

module.exports.showDateplace = async (req, res,) => {
    const dateplace = await Dateplace.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!dateplace) {
        req.flash("error", "Dateplace not found.");
        res.redirect("/dateplaces");
    }
    res.render("dateplaces/show", { dateplace });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const dateplace = await Dateplace.findById(id);
    if (!dateplace) {
        req.flash("error", "Dateplace not found.");
        res.redirect("/dateplaces");
    }
    res.render("dateplaces/edit", { dateplace });
}

module.exports.updateDateplace = async (req, res, next) => {
    const { id } = req.params;
    const dateplace = await Dateplace.findByIdAndUpdate(id, { ...req.body.dateplace })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    dateplace.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await dateplace.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await dateplace.save();
    req.flash("success", "Successfully updated dateplace!")
    res.redirect(`/dateplaces/${dateplace._id}`);
}

module.exports.deleteDateplace = async (req, res, next) => {
    const { id } = req.params;
    await Dateplace.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted dateplace!")
    res.redirect("/dateplaces");
}