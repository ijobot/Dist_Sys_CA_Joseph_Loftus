const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const CLIMATE_PROTO_PATH = path.join(__dirname, "../protos/climate.proto");
const definition = protoLoader.loadSync(CLIMATE_PROTO_PATH);
const climateProto = grpc.loadPackageDefinition(definition).climate;

const readings = [
  { temperature: 21, humidity: 22 },
  { temperature: 19, humidity: 62 },
  { temperature: 16, humidity: 88 },
  { temperature: 12, humidity: 41 },
  { temperature: 8, humidity: 23 },
  { temperature: 17, humidity: 71 },
  { temperature: 24, humidity: 16 },
];

const getClimateReading = (call, callback) => {
  const currentReading = readings[Math.floor(Math.random() * readings.length)];
  if (call.request && currentReading) {
    callback(null, currentReading);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Climate reading not found.",
    });
  }
};

const server = new grpc.Server();
server.addService(climateProto.ClimateService.service, {
  GetClimateReading: getClimateReading,
});

const PORT = "50051";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Climate Service is running on localhost:${PORT}`);
  }
);
