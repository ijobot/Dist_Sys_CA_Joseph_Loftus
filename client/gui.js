const express = require("express");
const path = require("path");
const client = require("./client");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (request, response) => {
  const productID = 1;

  client.discoveryService("lightService", (lightService) => {
    client.getProductInfo(productID, (product) => {
      if (!product) {
        response.send("Product not found!");
        return;
      }
      87;
    });
  });
});

app.listen(port, () => {
  console.log("Client is running!");
});
