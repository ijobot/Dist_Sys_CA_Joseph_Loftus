const express = require("express");
const path = require("path");
const client = require("./mainClient");

// Importing the routers for each page within the system.
const getLightRouter = require("./routes/getLight");
const setMultipleLightsRouter = require("./routes/setMultipleLights");
const initiateClimateReadingsRouter = require("./routes/initiateClimateReadings");
const securityClearanceRouter = require("./routes/securityClearance");

// Creating the app and assigning a port.
const app = express();
const PORT = 3000;

// Allowing for the use of JSON and URL params in functions and responses.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Telling the application where to look for files.
app.use(express.static("public"));

// Adding the "views" to "public" for simplicity (everything in one location).
app.set("views", path.join(__dirname, "../client/public"));

// Setting the view engine to read, execute, and properly display EJS files.
app.set("view engine", "ejs");

// Telling the application to use certain routers depending on which URL we visit.
app.use("/getLight", getLightRouter);
app.use("/setMultipleLights", setMultipleLightsRouter);
app.use("/initiateClimateReadings", initiateClimateReadingsRouter);
app.use("/securityClearance", securityClearanceRouter);

// Rendering the main index file on the home route.
app.get("/", (req, res) => {
  res.render("index");
});

// Listening to the assigned port for functionality.
app.listen(PORT, () => {
  console.log(`Client GUI is running at http://localhost:${PORT}`);
});
