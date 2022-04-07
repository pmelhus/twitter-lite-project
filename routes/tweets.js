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

router.get( "/",asyncHandler(async (req, res) => {
    const tweets = await Tweet.findAll();
    res.json({ tweets });
  })
);

router.get("/:id(\\d+)",asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id, 10)
    const tweet = await Tweet.findByPk(id);
    if (tweet) {
      res.json({ tweet });
    } else {
      next(tweetNotFoundError());
    }
  })
);


router.post("/", handleValidationErrors, asyncHandler(async(req,res,next) => {
  const { message } = req.body
  
  const tweet = await Tweet.create({
    message
  })
  res.status(201).json({tweet})
  // res.redirect('/')
}));

router.put("/:id(\\d+)", handleValidationErrors, asyncHandler(async (req, res, next) => {
  const { message } = req.body

  const id = parseInt(req.params.id, 10)
  const tweet = await Tweet.findByPk(id);

  if (tweet) {

    await tweet.update({message})
    res.json({ tweet })

  } else {
    next(tweetNotFoundError());
  }

  // res.redirect('/')
}));

router.delete("/:id(\\d+)", asyncHandler(async (req, res, next) => {
  const id = parseInt(req.params.id, 10)
  const tweet = await Tweet.findByPk(id);
  if (tweet) {
    await tweet.destroy()
    res.status(204).end()
  } else {
    next(tweetNotFoundError());
  }
})
);


module.exports = router;
