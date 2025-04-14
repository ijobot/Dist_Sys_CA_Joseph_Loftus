const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const definition = protoLoader.loadSync(LIGHT_PROTO_PATH);
const lightProto = grpc.loadPackageDefinition(definition).light;

const lights = [
  { id: 1, name: "Light 1", color: "#222222" },
  { id: 2, name: "Light 2", color: "#777777" },
];

const getLight = (call, callback) => {
  const light = lights.find((light) => light.id === call.request.id);
  if (light) {
    callback(null, light);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Light not found",
    });
  }
};

const server = new grpc.Server();
server.addService(lightProto.LightService.service, {
  GetLight: getLight,
});
server.bindAsync(
  "127.0.0.1:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Light Service is running!");
  }
);
