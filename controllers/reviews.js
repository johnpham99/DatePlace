const Dateplace = require("../models/dateplace");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const dateplace = await Dateplace.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    dateplace.reviews.push(review);
    await review.save();
    await dateplace.save();
    req.flash("success", "Created new review!")
    res.redirect(`/dateplaces/${dateplace._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Dateplace.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!!")
    res.redirect(`/dateplaces/${id}`);
}