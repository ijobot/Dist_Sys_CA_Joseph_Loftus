const express = require("express");
const router = express.Router();
const client = require("../mainClient");

router.get("/", (req, res) => {
  res.render("lightSystem/getLight", { lightEntered: 1, response: {} });
});

router.post("/", (req, res) => {
  const lightService = "lightService";
  const lightId = req.body.lightEntered;

  console.log(req.body.lightEntered);
  client.loadService(lightService, (lightService) => {
    console.log(lightService);
    if (!lightService) {
      res.send("Climate Service not found.");
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
      });
    });
  });
});

module.exports = router;
