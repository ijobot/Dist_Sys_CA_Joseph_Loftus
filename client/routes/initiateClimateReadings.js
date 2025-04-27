const express = require("express");
const router = express.Router();
const client = require("../mainClient");

// Establish the router for the initiateClimateReadings function and its display page.
router.get("/", (req, res) => {
  const climateService = "climateService";

  // Use the DiscoveryService to find and load the ClimateService for use in the UI.
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
