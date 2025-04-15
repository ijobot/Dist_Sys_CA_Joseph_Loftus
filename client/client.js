const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Discovery
const DISCOVERY_PROTO_PATH = path.join(__dirname, "../protos/discovery.proto");
const discoveryProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(DISCOVERY_PROTO_PATH)
).discovery;
const discoveryClient = new discoveryProto.DiscoveryService(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

// Climate
const CLIMATE_PROTO_PATH = path.join(__dirname, "../protos/climate.proto");
const climateProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(CLIMATE_PROTO_PATH)
).climate;
const climateClient = new climateProto.ClimateService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Light
const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const lightProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(LIGHT_PROTO_PATH)
).light;
const lightClient = new lightProto.LightService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

// Security
const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
const securityProto = grpc.loadPackageDefinition(
  protoLoader.loadSync(SECURITY_PROTO_PATH)
).security;
const securityClient = new securityProto.SecurityService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

// Main Client Methods
const test = () => {
  console.log("Hi Joe, test is working!");
};

module.export = {
  //   getProductInfo,
  //   getOrderInfo,
  //   sendChatMessage,
  test,
};
