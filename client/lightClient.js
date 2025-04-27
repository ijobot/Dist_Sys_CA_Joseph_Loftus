const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const readline = require("readline-sync");

const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const definition = protoLoader.loadSync(LIGHT_PROTO_PATH);
const lightProto = grpc.loadPackageDefinition(definition).light;

// Creating the client and loading the proto.
const client = new lightProto.LightService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

// Client functionality for the Light Service.
const getLight = (inputId) => {
  // Prompt user to enter a light ID for lookup.
  const lightId = readline.question(
    "Please enter a Light ID to see its details: \n"
  );
  client.getLight({ id: inputId || lightId }, (error, response) => {
    if (error) {
      console.log("Error :: getLight function :: lightClient file", error);
    } else {
      // Display light details for the user.
      console.log(
        `
          DETAILS FOR LIGHT ${response.id}
          location:      ${response.location}
          brightness:    ${response.brightness}
          color:         ${response.color}
          `
      );
      // Return light details object for use/display in the ejs file.
      return response;
    }
  });
};

const setLight = () => {
  // Prompt user to enter a light ID to update.
  const lightToSet = parseInt(
    readline.question("Which light would you like to update? \n")
  );
  // Prompt user to enter a brightness setting.
  const setBrightness = parseInt(
    readline.question("Please enter a brightness setting from 1-100: \n")
  );
  // Prompt user to enter a color setting.
  const setColor = readline.question("Please enter the color setting: \n");
  client.setLight(
    {
      id: lightToSet,
      brightness: setBrightness,
      color: setColor,
    },
    (error, response) => {
      if (error) {
        console.log("Error :: setLight function :: lightClient file", error);
      } else {
        // Send user confirmation message with new settings.
        console.log(
          `
          ${response.confirmationMessage}
          `
        );
      }
    }
  );
};

const getLocationLights = () => {
  // Prompt user to enter a location to check which lights are located within.
  const locationResponse = readline.question(
    "Enter a location to see which lights are available: \n"
  );
  const call = client.getLocationLights({ location: locationResponse });
  // Initial printout to begin the sequence.
  console.log(`\nThe following lights are in location "${locationResponse}":`);
  // Each light is printed in succession as the stream of emissions is recieved.
  call.on("data", (light) => {
    console.log(`${light.id}`);
  });
  call.on("end", () => {});
};

const setMultipleLights = (inputId, inputBrightness, inputColor, fromGUI) => {
  const call = client.setMultipleLights((error, response) => {
    if (error) {
      console.log(
        "Error :: setMultipleLights function :: lightClient file",
        error
      );
    } else {
      // "fromGUI" is an additional argument sent through the function depending on whether the user is using the browser or the terminal.
      if (fromGUI) {
        // Response object if in browser.
        return response;
      } else {
        // Printout if in terminal.
        console.log(response.confirmationMessage);
      }
    }
  });
  // Prompt user to set a brightness for all lights to be updated.
  const brightness = parseInt(
    readline.question(
      "Please enter a brightness setting from 1-100 for multiple lights: \n"
    )
  );
  // Prompt user to set a color for all lights to be updated.
  const color = readline.question(
    "Please enter a color setting for multiple lights: \n"
  );

  let addMore = true;
  if (!fromGUI) {
    // If using terminal, prompt user to enter a single light ID.
    // Then user types "y" to continue adding more, thus Client-Streaming values to the server.
    while (addMore) {
      const id = parseInt(
        readline.question("Please enter a light ID to add to the list. \n")
      );
      call.write({ id, brightness, color });
      // While loop continues until "addMore" becauses false by user typing "n".
      addMore = readline.keyInYNStrict("Add another? \n");
    }
    call.end();
  } else {
    // If in browser, user is asked to enter all desired IDs in comma-separated fashion.
    // These IDs are split and Client-Streamed as individual emissions.
    const ids = inputId.split(",");
    for (i = 0; i < ids.length; i++) {
      call.write({
        id: ids[i],
        brightness: inputBrightness,
        color: inputColor,
      });
    }
    call.end();
  }
};

// Main menu functionality for terminal users.
function mainMenu() {
  console.log(
    `
      1. Get a single light by its ID.
      2. Get all the light IDs in a particular location.
      3. Adjust a single light's settings.
      4. Adjust all lights in a particular location.
      5. Exit the Light Service.
      `
  );
  const choice = parseInt(readline.question("Choose a function: \n"));

  // Switch statement to allow user to select any of the 4 functions, or to exit the program.
  switch (choice) {
    case 1:
      getLight();
      break;
    case 2:
      getLocationLights();
      break;
    case 3:
      setLight();
      break;
    case 4:
      setMultipleLights();
      break;
    case 5:
      return;
    default:
      console.log("Please choose a function from 1 to 5.");
  }
}

// Function call to trigger opening menu.
mainMenu();

module.exports = {
  getLight,
  getLocationLights,
  setLight,
  setMultipleLights,
};
