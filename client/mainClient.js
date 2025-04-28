const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Discovery proto load and client creation
const DISCOVERY_PROTO_PATH = path.join(__dirname, "../protos/discovery.proto");
const discoveryProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(DISCOVERY_PROTO_PATH)
).discovery;
const discoveryClient = new discoveryProto.DiscoveryService(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

// Climate proto load and client creation
const CLIMATE_PROTO_PATH = path.join(__dirname, "../protos/climate.proto");
const climateProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(CLIMATE_PROTO_PATH)
).climate;
const climateClient = new climateProto.ClimateService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Light proto load and client creation
const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const lightProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(LIGHT_PROTO_PATH)
).light;
const lightClient = new lightProto.LightService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

// Security proto load and client creation
const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
const securityProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(SECURITY_PROTO_PATH)
).security;
const securityClient = new securityProto.SecurityService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

// Main service discovery function
const loadService = (serviceName, callback) => {
  discoveryClient.loadService(
    { serviceName: serviceName },
    (error, response) => {
      if (error) {
        console.log("Error :: loadService function :: mainClient file", error);
        callback(null);
      } else {
        callback(response);
      }
    }
  );
};

// Climate functionality
const initiateClimateReadings = () => {
  climateClient.initiateClimateReadings((error, response) => {
    if (error) {
      console.log(
        "Error :: initiateClimateReadings function :: mainClient file ",
        error
      );
      callback(null);
    } else {
      callback(response);
    }
  });
};

// Light functionality
const getLight = (lightId, callback) => {
  lightClient.getLight({ id: lightId }, (error, response) => {
    if (error) {
      console.log("Error :: getLight function :: mainClient file", error);
      callback(null);
    } else {
      callback(response);
    }
  });
};

const setMultipleLights = (inputId, inputBrightness, inputColor, fromGUI) => {
  lightClient.setMultipleLights(
    { inputId, inputBrightness, inputColor, fromGUI },
    (error, response) => {
      if (error) {
        console.log(
          "Error :: setMultipleLights function :: mainClient file",
          error
        );
        callback(null);
      } else {
        callback(response);
      }
    }
  );
};

// Security functionality
const securityClearance = () => {
  securityClient.securityClearance((error, response) => {
    if (error) {
      console.log(
        "Error :: securityClearance function :: mainClient file ",
        error
      );
      callback(null);
    } else {
      callback(response);
    }
  });
};

module.exports = {
  loadService,
  getLight,
  setMultipleLights,
  initiateClimateReadings,
  securityClearance,
};
