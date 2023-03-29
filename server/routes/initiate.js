const express = require("express");
const crypto = require("crypto");
const qrcode = require("qrcode");
const router = express.Router();
const { addOTP } = require("../storage");

function makeOTP() {
  return crypto.randomBytes(20).toString("hex");
}

router.post("/:id", async (req, res, next) => {
  const cycleCountId = req.params["id"];
  var otp = makeOTP();

  addOTP(otp, cycleCountId);

  const qrCode = await qrcode.toDataURL(JSON.stringify({ secret: otp, cycleCountId}, null, 2));

  const html = `
<html>
  <head><head/>
  <body>
    <img alt="QRCode for ${otp}" src="${qrCode}"/>
  </body>
</html>
`

  res.send(html);
})

module.exports = router;
