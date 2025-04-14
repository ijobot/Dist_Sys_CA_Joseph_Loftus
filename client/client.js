const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const DISCOVERY_PROTO_PATH = path.join(__dirname, "../proto/discovery.proto");

const CLIMATE_PROTO_PATH = path.join(__dirname, "../proto/climate.proto");
const LIGHT_PROTO_PATH = path.join(__dirname, "../proto/light.proto");
const SECURITY_PROTO_PATH = path.join(__dirname, "../proto/security.proto");

const discoveryProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(DISCOVERY_PROTO_PATH)
).discovery;

const climateProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(CLIMATE_PROTO_PATH)
).climate;
const lightProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(LIGHT_PROTO_PATH)
).light;
const securityProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(SECURITY_PROTO_PATH)
).security;

const discoveryClient = new discoveryProto.DiscoveryService(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

const climateClient = new climateProto.ClimateService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
const lightClient = new lightProto.LightService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);
const securityClient = new securityProto.SecurityService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

const discoverService = (serviceName, callback) => {
  discoveryClient.DiscoveryService(
    {
      serviceName: serviceName,
    },
    (error, response) => {
      if (error) {
        console.log("Error initializing service!", error);
        callback(null);
      } else {
        callback(response);
      }
    }
  );
};

module.export = {
  //   getProductInfo,
  //   getOrderInfo,
  //   sendChatMessage,
  discoverService,
};
