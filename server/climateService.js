const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const CLIMATE_PROTO_PATH = path.join(__dirname, "../protos/climate.proto");
const definition = protoLoader.loadSync(CLIMATE_PROTO_PATH);
const climateProto = grpc.loadPackageDefinition(definition).climate;

// Emulating hourly climate readings (would come from instruments on the roof in a real world scenario).
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

// ----------------------------
// Main Climate System function
// Server-Streaming Service
// ----------------------------

// Helper function for initiateClimateReadings to mimic hours passing.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Using a loop to perform a new "write" call every 3 seconds.
const initiateClimateReadings = async (call) => {
  for (i = 0; i < readings.length; i++) {
    const climateReading = readings[i];
    await delay(3000);
    call.write(climateReading);
  }
  // Ending the call once all 14 responses have been emitted.
  call.end();
};

// Creating the server and adding the Climate Service via the proto file.
const server = new grpc.Server();
server.addService(climateProto.ClimateService.service, {
  InitiateClimateReadings: initiateClimateReadings,
});

// Choosing and assigning a port for the service.
const PORT = "50051";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Climate Service is running on localhost:${PORT}`);
  }
);
