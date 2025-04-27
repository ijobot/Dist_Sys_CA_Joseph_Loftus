const express = require("express");
const router = express.Router();
const client = require("../mainClient");

router.get("/", (req, res) => {
  const climateService = "climateService";
  client.loadService(climateService, (climateService) => {
    console.log("Service address: " + climateService.address);
    if (!climateService) {
      res.send("Climate Service not found.");
      return;
    }
    res.render("climateSystem/initiateClimateReadings", {
      address: climateService.address,
    });
  });
});

module.exports = router;
