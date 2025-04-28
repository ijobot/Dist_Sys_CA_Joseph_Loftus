const express = require("express");
const router = express.Router();
const client = require("../mainClient");
const lightService = "lightService";

// Establish the router for the getLight function and its display page.
router.get("/", (req, res) => {
  client.loadService(lightService, (lightService) => {
    console.log("Service address: " + lightService.address);
    if (!lightService) {
      res.send("Light Service not found.");
      return;
    }
    res.render("lightSystem/getLight", {
      lightEntered: 1,
      response: {},
      address: lightService.address,
    });
  });
});

router.post("/", (req, res) => {
  const lightId = req.body.lightEntered;

  // Use the DiscoveryService to find and load the LightService for use in the UI.
  client.loadService(lightService, (lightService) => {
    console.log("Service address: " + lightService.address);
    if (!lightService) {
      res.send("Light Service not found.");
      return;
    }
    client.getLight(lightId, (response) => {
      if (!response) {
        res.send("Light not found.");
        return;
      }
      res.render("lightSystem/getLight", {
        lightEntered: lightId,
        response: response,
        address: lightService.address,
      });
    });
  });
});

module.exports = router;
