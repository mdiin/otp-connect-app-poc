const express = require("express");
const { debugGetStore } = require("../storage");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send(debugGetStore());
})

module.exports = router;
