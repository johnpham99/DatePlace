const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Dateplace = require("../models/dateplace");
const { dateplaceSchema } = require("../schemas.js");

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

router.post("/", validateDateplace, catchAsync(async (req, res, next) => {
    const dateplace = new Dateplace(req.body.dateplace);
    await dateplace.save();
    res.redirect(`/dateplaces/${dateplace._id}`);
}));

router.get("/new", (req, res) => {
    res.render("dateplaces/new");
});

router.get("/:id", catchAsync(async (req, res, next) => {
    const dateplace = await Dateplace.findById(req.params.id).populate("reviews");
    res.render("dateplaces/show", { dateplace });
}));

router.get("/:id/edit", catchAsync(async (req, res, next) => {
    const dateplace = await Dateplace.findById(req.params.id);
    res.render("dateplaces/edit", { dateplace });
}));

router.put("/:id", validateDateplace, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const dateplace = await Dateplace.findByIdAndUpdate(id, { ...req.body.dateplace })
    res.redirect(`/dateplaces/${dateplace._id}`);
}));

router.delete("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Dateplace.findByIdAndDelete(id);
    res.redirect("/dateplaces");
}));

module.exports = router;