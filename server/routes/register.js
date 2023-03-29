const express = require("express");
const crypto = require("crypto");
const { addAccessKey, disableOTP, testOTP } = require("../storage");

const router = express.Router();

function makeAccessKey() {
  return crypto.randomBytes(20).toString("hex");
}

router.post('/:id', (req, res, next) => {
  const otp = req.get("x-secret");
  const cycleCountId = req.params["id"];

  console.log("OTP: " + otp)
  console.log("cycleCountId: " + cycleCountId);

  const validOTP = testOTP(otp, cycleCountId);

  if (validOTP) {
    const accessKey = makeAccessKey();

    disableOTP(cycleCountId);
    addAccessKey(cycleCountId, accessKey);

    res.set("Content-Type", "application/json")
    res.send({accessKey});
  } else {
    res.sendStatus(400);
  }
})

module.exports = router;
