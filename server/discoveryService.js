const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const DISCOVERY_PROTO_PATH = path.join(__dirname, "../protos/discovery.proto");
const definition = protoLoader.loadSync(DISCOVERY_PROTO_PATH);
const discoveryProto = grpc.loadPackageDefinition(definition).discovery;

const services = {
  climateService: "localhost:50051",
  lightService: "localhost:50052",
  securityService: "localhost:50053",
};

const discover = (call, callback) => {
  const serviceName = call.request.serviceName;
  const address = services[serviceName];

  if (address) {
    callback(null, { address });
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Service not found!",
    });
  }
};

const server = new grpc.Server();
server.addService(discoveryProto.DiscoveryService.service, {
  Discover: discover,
});
server.bindAsync(
  "127.0.0.1:50050",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Discovery Service is running!");
  }
);
