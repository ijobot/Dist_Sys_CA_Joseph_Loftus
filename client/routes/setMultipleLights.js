const express = require("express");
const router = express.Router();
const client = require("../mainClient");

router.get("/", (req, res) => {
  res.render("lightSystem/setMultipleLights", {
    inputId: 1,
    inputBrightness: 1,
    inputColor: "white",
    keepGoing: "y",
    response: {},
  });
});

router.post("/", (req, res) => {
  const lightService = "lightService";
  const inputId = req.body.inputId;
  const inputBrightness = req.body.inputBrightness;
  const inputColor = req.body.inputColor;
  const fromGUI = true;

  console.log(req.body.inputId);
  console.log(req.body.inputBrightness);
  console.log(req.body.inputColor);
  console.log(fromGUI);
  client.loadService(lightService, (lightService) => {
    console.log(lightService);
    if (!lightService) {
      res.send("Light Service not found.");
      return;
    }
    client.setMultipleLights(
      inputId,
      inputBrightness,
      inputColor,
      fromGUI,
      (response) => {
        if (!response) {
          res.send("Light not found.");
          return;
        }
        res.render(
          "lightSystem/setMultipleLights",
          {
            inputId: inputId,
            inputBrightness: inputBrightness,
            inputColor: inputColor,
            fromGUI: fromGUI,
          },
          { response: response }
        );
      }
    );
  });
});

module.exports = router;
