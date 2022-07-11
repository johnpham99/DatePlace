const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Dateplace = require("../models/dateplace");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const dateplace = await Dateplace.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    dateplace.reviews.push(review);
    await review.save();
    await dateplace.save();
    req.flash("success", "Created new review!")
    res.redirect(`/dateplaces/${dateplace._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Dateplace.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!!")
    res.redirect(`/dateplaces/${id}`);
}))

module.exports = router;