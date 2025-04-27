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

const setMultipleLights = ({ inputs }, callback) => {
  lightClient.setMultipleLights({ inputs }, (error, response) => {
    if (error) {
      console.error(error);
    } else {
      callback(response.confirmationMessage);
    }
  });
};

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
  setMultipleLights,
};
