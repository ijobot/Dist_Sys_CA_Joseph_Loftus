const express = require("express");
const path = require("path");
const client = require("./mainClient");
const getLightRouter = require("./routes/getLight");
const setMultipleLightsRouter = require("./routes/setMultipleLights");
const initiateClimateReadingsRouter = require("./routes/initiateClimateReadings");
const securityClearanceRouter = require("./routes/securityClearance");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client/public"));

app.use("/getLight", getLightRouter);
app.use("/setMultipleLights", setMultipleLightsRouter);
app.use("/initiateClimateReadings", initiateClimateReadingsRouter);
app.use("/securityClearance", securityClearanceRouter);

app.get("/", (req, res) => {
  console.log("HEY JOE FROM MAIN PAGE");
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Client GUI is running at http://localhost:${PORT}`);
});
