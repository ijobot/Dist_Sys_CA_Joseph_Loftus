const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const definition = protoLoader.loadSync(LIGHT_PROTO_PATH);
const lightProto = grpc.loadPackageDefinition(definition).light;

const client = new lightProto.LightService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

const lightId = 1;
client.GetLight({ id: lightId }, (error, response) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Light details:", response);
  }
});
