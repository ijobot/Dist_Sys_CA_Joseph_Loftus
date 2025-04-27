const express = require("express");
const router = express.Router();
const client = require("../mainClient");

// Establish the router for the securityClearance function and its display page.
router.get("/", (req, res) => {
  const securityService = "securityService";

  // Use the DiscoveryService to find and load the SecurityService for use in the UI.
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
