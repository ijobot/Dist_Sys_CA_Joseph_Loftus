const express = require("express");
const router = express.Router();
const client = require("../mainClient");
const lightService = "lightService";

// Establish the router for the setMultipleLights function and its display page.
router.get("/", (req, res) => {
  client.loadService(lightService, (lightService) => {
    console.log(lightService.address);
    if (!lightService) {
      res.send("Light Service not found.");
      return;
    }
    res.render("lightSystem/setMultipleLights", {
      inputId: "1,4,8,9",
      inputBrightness: 90,
      inputColor: "soft white",
      keepGoing: "y",
      response: {},
      address: lightService.address,
    });
  });
});

router.post("/", (req, res) => {
  const inputId = req.body.inputId;
  const inputBrightness = req.body.inputBrightness;
  const inputColor = req.body.inputColor;
  const fromGUI = true;

  // Use the DiscoveryService to find and load the LightService for use in the UI.
  client.loadService(lightService, (lightService) => {
    console.log(lightService.address);
    if (!lightService) {
      res.send("Light Service not found.");
      return;
    }
    client.setMultipleLights(
      { inputId, inputBrightness, inputColor, fromGUI },
      (response) => {
        if (!response) {
          res.send("Light not found.");
          return;
        }
        res.render("lightSystem/setMultipleLights", {
          inputId,
          inputBrightness,
          inputColor,
          fromGUI,
          response,
          address: lightService.address,
        });
      }
    );
  });
});

module.exports = router;
