const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Dateplace = require("../models/dateplace");
const { isLoggedIn, isAuthor, validateDateplace } = require("../middleware");
const dateplaces = require("../controllers/dateplaces");

router.get("/", catchAsync(dateplaces.index));

router.post("/", isLoggedIn, validateDateplace, catchAsync(dateplaces.createDateplace));

router.get("/new", isLoggedIn, dateplaces.renderNewForm);

router.get("/:id", catchAsync(dateplaces.showDateplace));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(dateplaces.renderEditForm));

router.put("/:id", isLoggedIn, isAuthor, validateDateplace, catchAsync(dateplaces.updateDateplace));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(dateplaces.deleteDateplace));

module.exports = router;