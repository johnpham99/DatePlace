const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Dateplace = require("../models/dateplace");
const { dateplaceSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");

const validateDateplace = (req, res, next) => {
    const { error } = dateplaceSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get("/", catchAsync(async (req, res, next) => {
    const dateplaces = await Dateplace.find({});
    res.render("dateplaces/index", { dateplaces });
}));

router.post("/", isLoggedIn, validateDateplace, catchAsync(async (req, res, next) => {
    const dateplace = new Dateplace(req.body.dateplace);
    await dateplace.save();
    req.flash("success", "Sucessfully made a new dateplace!");
    res.redirect(`/dateplaces/${dateplace._id}`);
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("dateplaces/new");
});

router.get("/:id", catchAsync(async (req, res, next) => {
    const dateplace = await Dateplace.findById(req.params.id).populate("reviews");
    if (!dateplace) {
        req.flash("error", "Dateplace not found.");
        res.redirect("/dateplaces");
    }
    res.render("dateplaces/show", { dateplace });
}));

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res, next) => {
    const dateplace = await Dateplace.findById(req.params.id);
    if (!dateplace) {
        req.flash("error", "Dateplace not found.");
        res.redirect("/dateplaces");
    }
    res.render("dateplaces/edit", { dateplace });
}));

router.put("/:id", isLoggedIn, validateDateplace, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const dateplace = await Dateplace.findByIdAndUpdate(id, { ...req.body.dateplace })
    req.flash("success", "Successfully updated dateplace!")
    res.redirect(`/dateplaces/${dateplace._id}`);
}));

router.delete("/:id", isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Dateplace.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted dateplace!")
    res.redirect("/dateplaces");
}));

module.exports = router;