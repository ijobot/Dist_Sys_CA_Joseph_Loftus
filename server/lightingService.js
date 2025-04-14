const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const LIGHTING_PROTO_PATH = path.join(__dirname, "../protos/lighting.proto");
const definition = protoLoader.loadSync(LIGHTING_PROTO_PATH);
const lightingProto = grpc.loadPackageDefinition(definition).lighting;

const initializeService = (call, callback) => {
  console.log(
    `Received message from ${call.request.user}: ${call.request.message}`
  );

  callback(null, {
    response: `Hello ${call.request.user}, your message was received: "${call.request.message}"`,
  });
};

const server = new grpc.Server();
server.addService(lightingProto.LightingService.service, {
  InitializeService: initializeService,
});
server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Lighting Service is running!");
    server.start();
  }
);
