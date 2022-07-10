const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Dateplace = require("../models/dateplace");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req, res) => {
    const dateplace = await Dateplace.findById(req.params.id);
    const review = new Review(req.body.review);
    dateplace.reviews.push(review);
    await review.save();
    await dateplace.save();
    res.redirect(`/dateplaces/${dateplace._id}`);
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Dateplace.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/dateplaces/${id}`);
}))

module.exports = router;