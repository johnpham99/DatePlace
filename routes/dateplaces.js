const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Dateplace = require("../models/dateplace");
const { isLoggedIn, isAuthor, validateDateplace } = require("../middleware");
const dateplaces = require("../controllers/dateplaces");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(dateplaces.index))
    //.post(isLoggedIn, validateDateplace, catchAsync(dateplaces.createDateplace));
    .post(upload.array("image"), (req, res) => {
        console.log(req.body, req.files);
        res.send("It worked!");
    })

router.get("/new", isLoggedIn, dateplaces.renderNewForm);

router.route("/:id")
    .get(catchAsync(dateplaces.showDateplace))
    .put(isLoggedIn, isAuthor, validateDateplace, catchAsync(dateplaces.updateDateplace))
    .delete(isLoggedIn, isAuthor, catchAsync(dateplaces.deleteDateplace));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(dateplaces.renderEditForm));

module.exports = router;    