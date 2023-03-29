const express = require("express");
const { setCycleCount, disableAccessKey, testAccessKey } = require("../storage");

const router = express.Router();

router.post("/:id", (req, res, next) => {
  const cycleCountId = req.params["id"];
  const accessKey = req.get("x-access-key");

  if (testAccessKey(cycleCountId, accessKey)) {
    const cycleCount = req.body;

    setCycleCount(cycleCountId, cycleCount);

    res.sendStatus(201);
  } else {
    res.sendStatus(400);
  }

  disableAccessKey(cycleCountId);
});

module.exports = router;
