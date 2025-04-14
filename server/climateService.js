const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const CLIMATE_PROTO_PATH = path.join(__dirname, "../protos/climate.proto");
const definition = protoLoader.loadSync(CLIMATE_PROTO_PATH);
const climateProto = grpc.loadPackageDefinition(definition).climate;

const discoverService = (call, callback) => {
  console.log(
    `Received message from ${call.request.user}: ${call.request.message}`
  );

  callback(null, {
    response: `Hello ${call.request.user}, your message was received: "${call.request.message}"`,
  });
};

const server = new grpc.Server();
server.addService(climateProto.ClimateService.service, {
  DiscoverService: discoverService,
});
server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Climate Service is running!");
  }
);
