const express = require("express");
const router = express.Router();
const client = require("../mainClient");

router.get("/", (req, res) => {
  const securityService = "securityService";
  client.loadService(securityService, (securityService) => {
    console.log("Service address: " + securityService.address);
    if (!securityService) {
      res.send("Security Service not found.");
      return;
    }
    res.render("securitySystem/securityClearance", {
      address: securityService.address,
    });
  });
});

module.exports = router;
