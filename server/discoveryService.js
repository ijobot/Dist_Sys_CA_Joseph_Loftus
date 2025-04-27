const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const DISCOVERY_PROTO_PATH = path.join(__dirname, "../protos/discovery.proto");
const definition = protoLoader.loadSync(DISCOVERY_PROTO_PATH);
const discoveryProto = grpc.loadPackageDefinition(definition).discovery;

// Emulating a database of available services within the overall system (would be hosted in Mongo or SQL in a real world scenario).
const services = {
  climateService: "localhost:50051",
  lightService: "localhost:50052",
  securityService: "localhost:50053",
};

// --------------------------
// Main Light System function
// Unary Service
// --------------------------

const loadService = (call, callback) => {
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

// Creating the server and adding the Discovery Service via the proto file.
const server = new grpc.Server();
server.addService(discoveryProto.DiscoveryService.service, {
  LoadService: loadService,
});

// Choosing and assigning a port for the service.
const PORT = "50050";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`
      Discovery Service is running on localhost:${PORT}.
      `);
  }
);
