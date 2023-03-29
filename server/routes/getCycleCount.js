const express = require("express");
const { getCycleCount, testAccessKey } = require("../storage");

const router = express.Router();

const cycleCounts = {
  "CC123": {
    id: "CC123",
    skus: {
      1: { sku: 1, expected: 10 },
      2: { sku: 2, expected: 1 },
      3: { sku: 3, expected: 55 }
    }
  }
}

router.get("/:id", (req, res, next) => {
  const cycleCountId = req.params["id"];
  const accessKey = req.get("x-access-key");

  if (testAccessKey(cycleCountId, accessKey)) {
    const cycleCount = getCycleCount(cycleCountId); //cycleCounts[cycleCountId];

    if (cycleCount !== undefined) {
      res.send(JSON.stringify(cycleCount, null, 2));
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
