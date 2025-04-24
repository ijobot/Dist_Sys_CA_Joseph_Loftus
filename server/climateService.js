const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const CLIMATE_PROTO_PATH = path.join(__dirname, "../protos/climate.proto");
const definition = protoLoader.loadSync(CLIMATE_PROTO_PATH);
const climateProto = grpc.loadPackageDefinition(definition).climate;

const readings = [
  { time: "06:00", temperature: 11, humidity: 60 },
  { time: "07:00", temperature: 11, humidity: 58 },
  { time: "08:00", temperature: 12, humidity: 55 },
  { time: "09:00", temperature: 12, humidity: 53 },
  { time: "10:00", temperature: 13, humidity: 45 },
  { time: "11:00", temperature: 14, humidity: 38 },
  { time: "12:00", temperature: 15, humidity: 32 },
  { time: "13:00", temperature: 15, humidity: 25 },
  { time: "14:00", temperature: 15, humidity: 22 },
  { time: "15:00", temperature: 16, humidity: 16 },
  { time: "16:00", temperature: 16, humidity: 15 },
  { time: "17:00", temperature: 15, humidity: 16 },
  { time: "18:00", temperature: 14, humidity: 19 },
  { time: "19:00", temperature: 14, humidity: 30 },
  { time: "20:00", temperature: 13, humidity: 39 },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const initiateClimateReadings = async (call) => {
  for (i = 0; i < readings.length; i++) {
    const climateReading = readings[i];
    await delay(3000);
    call.write(climateReading);
  }
  call.end();
};

const server = new grpc.Server();
server.addService(climateProto.ClimateService.service, {
  InitiateClimateReadings: initiateClimateReadings,
});

const PORT = "50051";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Climate Service is running on localhost:${PORT}`);
  }
);
