const express = require("express");
const path = require("path");
const client = require("../mainClient");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  const climateService = "climateService";
  const lightService = "lightService";
  const securityService = "securityService";

  const requestMessage = "Begin streaming today's weather readings.";
  const testLightID = lightInput;

  client.loadService(lightService, (lightService) => {
    console.log(lightService);
    if (!lightService) {
      res.send("Climate Service not found.");
      return;
    }

    client.getLight(testLightID, (response) => {
      if (!response) {
        res.send("Light not found.");
        return;
      }
      res.render(
        "C:/Users/josep/Desktop/NCI/Semester3/Distributed Systems/Dist_Sys_CA_Joseph_Loftus/client/views/index",
        { response }
      );
    });

    // client.initiateClimateReadings(requestMessage, (readings) => {
    //   if (!readings) {
    //     res.send("Climate readings not found.");
    //     return;
    //   }
    //   );
    // });
  });
});

app.listen(PORT, () => {
  console.log(`Client GUI is running at http://localhost:${PORT}`);
});
