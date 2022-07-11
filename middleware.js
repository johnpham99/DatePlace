const { dateplaceSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Dateplace = require("./models/dateplace");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in.");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateDateplace = (req, res, next) => {
    const { error } = dateplaceSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const dateplace = await Dateplace.findById(id);
    if (!dateplace.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/dateplaces/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}