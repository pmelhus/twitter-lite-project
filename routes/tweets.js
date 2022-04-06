const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { Tweet } = db;
const { check, validationResult } = require("express-validator");

const asyncHandler = (handler) => {
  return (req, res, next) => {
    return handler(req, res, next).catch(next);
  };
};

const tweetNotFoundError = () => {
  const err = Error("Tweet of given ID could not be found");
  err.title = "Tweet not found";
  err.status = 404;
  return err;
};

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    return next(err);
  }
  next();
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tweets = await Tweet.findAll();
    res.json({ tweets });
  })
);

router.get(
  "/:id(\\d+)",
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const tweet = await Tweet.findByPk(id);
    if (tweet) {
      res.json({ tweet });
    } else {
      next(tweetNotFoundError());
    }
  })
);

router.post("/");

module.exports = router;
