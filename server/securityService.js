const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
const definition = protoLoader.loadSync(SECURITY_PROTO_PATH);
const securityProto = grpc.loadPackageDefinition(definition).security;

const discover = (call, callback) => {
  console.log(
    `Received message from ${call.request.user}: ${call.request.message}`
  );

  callback(null, {
    response: `Hello ${call.request.user}, your message was received: "${call.request.message}"`,
  });
};

const server = new grpc.Server();
server.addService(securityProto.SecurityService.service, {
  Discover: discover,
});
server.bindAsync(
  "127.0.0.1:50053",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Security Service is running!");
  }
);
