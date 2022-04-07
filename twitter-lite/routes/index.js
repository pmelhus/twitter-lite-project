const express = require('express')
const router = express.Router()
const cors = require("cors");


router.get("/", cors(), (req, res) => {
    res.json({message: "test root index"})
});

module.exports = router
