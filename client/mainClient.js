const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const readlineSync = require("readline-sync");
const readline = require("readline");

// Discovery
const DISCOVERY_PROTO_PATH = path.join(__dirname, "../protos/discovery.proto");
const discoveryProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(DISCOVERY_PROTO_PATH)
).discovery;
const discoveryClient = new discoveryProto.DiscoveryService(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

// // Climate
// const CLIMATE_PROTO_PATH = path.join(__dirname, "../protos/climate.proto");
// const climateProto = grpc.loadPackageDefinition(
//   protoLoader.loadSync(CLIMATE_PROTO_PATH)
// ).climate;
// const climateClient = new climateProto.ClimateService(
//   "localhost:50051",
//   grpc.credentials.createInsecure()
// );

// Light
const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const lightProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(LIGHT_PROTO_PATH)
).light;
const lightClient = new lightProto.LightService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

// // Security
// const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
// const securityProto = grpc.loadPackageDefinition(
//   protoLoader.loadSync(SECURITY_PROTO_PATH)
// ).security;
// const securityClient = new securityProto.SecurityService(
//   "localhost:50053",
//   grpc.credentials.createInsecure()
// );

// Main service discovery function
const loadService = (serviceName, callback) => {
  discoveryClient.loadService(
    { serviceName: serviceName },
    (error, response) => {
      if (error) {
        console.log("Could not discover service.", error);
        callback(null);
      } else {
        callback(response);
      }
    }
  );
};

// Climate client functions
// const initiateClimateReadings = (message, callback) => {
//   climateClient.initiateClimateReadings({ message }, (error, response) => {
//     if (error) {
//       console.log("Error initiating climate readings.", error);
//       callback(null);
//     } else {
//       callback(response);
//     }
//   });
// };

// // Light client functions
const getLight = (lightId, callback) => {
  lightClient.getLight({ id: lightId }, (error, response) => {
    if (error) {
      console.log("Error getting light by ID", error);
      callback(null);
    } else {
      callback(response);
    }
  });
};

// const setLight = () => {
//   const lightToSet = parseInt(
//     readlineSync.question("Which light would you like to update? \n")
//   );
//   const setBrightness = parseInt(
//     readlineSync.question("Please enter a brightness setting from 1-100: \n")
//   );
//   const setColor = readlineSync.question("Please enter the color setting: \n");
//   lightClient.setLight(
//     {
//       id: lightToSet,
//       brightness: setBrightness,
//       color: setColor,
//     },
//     (error, response) => {
//       if (error) {
//         console.error("Error:", error);
//       } else {
//         console.log(
//           `
//           ${response.confirmationMessage}
//           `
//         );
//       }
//     }
//   );
// };

// const getRoomLights = () => {
//   const roomResponse = readlineSync.question(
//     "Enter a room to see which lights are available: \n"
//   );
//   const call = lightClient.getRoomLights({ room: roomResponse });
//   console.log(`\nThe following lights are in room "${roomResponse}":`);
//   call.on("data", (light) => {
//     console.log(`${light.id}`);
//   });
//   call.on("end", () => {});
// };

// const setMultipleLights = () => {
//   const call = lightClient.setMultipleLights((error, response) => {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log(response.confirmationMessage);
//     }
//   });
//   const brightness = parseInt(
//     readlineSync.question(
//       "Please enter a brightness setting from 1-100 for multiple lights: \n"
//     )
//   );
//   const color = readlineSync.question(
//     "Please enter a color setting for multiple lights: \n"
//   );

//   let addMore = true;
//   while (addMore) {
//     const id = parseInt(
//       readlineSync.question("Please enter a light ID to add to the list. \n")
//     );
//     call.write({ id, brightness, color });
//     addMore = readlineSync.keyInYNStrict("Add another? \n");
//   }
//   call.end();
// };

// function mainMenu() {
//   console.log(
//     `
//       1. Get a single light by its ID.
//       2. Get all the light IDs in a particular room.
//       3. Adjust a single light's settings.
//       4. Adjust all lights in a particular room.
//       5. Exit the Light Service.
//       `
//   );
//   const choice = parseInt(readlineSync.question("Choose a function: \n"));

//   switch (choice) {
//     case 1:
//       getLight();
//       break;
//     case 2:
//       getRoomLights();
//       break;
//     case 3:
//       setLight();
//       break;
//     case 4:
//       setMultipleLights();
//       break;
//     case 5:
//       return;
//     default:
//       console.log("Please choose a function from 1 to 4.");
//   }
// }

// mainMenu();

// // Security client functions
// const securityClearance = () => {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   const call = securityClient.securityClearance();
//   call.on("data", (response) => {
//     console.log(`
//     ${response.user} - ${response.action} ${response.message}
//     `);
//     currentAction++;
//   });

//   call.on("end", () => {
//     call.end();
//     rl.close();
//   });

//   call.on("error", (e) => {
//     console.log(e);
//   });

//   let currentAction = 1;

//   console.log(
//     "SECURITY - DESK WELCOME: Please type your full name, or 'Q' to quit. "
//   );

//   rl.on("line", (enteredText) => {
//     if (enteredText.toLowerCase() === "q") {
//       call.end();
//       rl.close();
//     }
//     if (currentAction === 1) {
//       call.write({ action: "sign in", user: enteredText, message: "" });
//     }
//     if (currentAction === 2) {
//       call.write({ action: "verify", user: enteredText, message: "" });
//     }
//     if (currentAction === 3) {
//       call.write({ action: "secret piece", user: enteredText, message: "" });
//     }
//     if (currentAction === 4) {
//       call.end();
//       rl.close();
//     }
//   });
// };

module.exports = {
  loadService,
  getLight,
};
