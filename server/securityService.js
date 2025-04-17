const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
const definition = protoLoader.loadSync(SECURITY_PROTO_PATH);
const securityProto = grpc.loadPackageDefinition(definition).security;

const askSecurityQuestion = (call, callback) => {
  if (call.request.question) {
    const response = { id: 44, answer: "2x2 jumper" };
    callback(null, response);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Security currently not accessible.",
    });
  }
};

const server = new grpc.Server();
server.addService(securityProto.SecurityService.service, {
  AskSecurityQuestion: askSecurityQuestion,
});

const PORT = "50053";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Security Service is running on localhost:${PORT}`);
  }
);
