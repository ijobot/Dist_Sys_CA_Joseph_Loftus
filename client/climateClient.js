const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const CLIMATE_PROTO_PATH = path.join(__dirname, "../protos/climate.proto");
const definition = protoLoader.loadSync(CLIMATE_PROTO_PATH);
const climateProto = grpc.loadPackageDefinition(definition).climate;

// Creating the client and loading the proto.
const client = new climateProto.ClimateService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Client functionality for the Climate Service.
const initiateClimateReadings = () => {
  const requestMessage = "Begin streaming today's weather readings.";
  const call = client.initiateClimateReadings({ message: requestMessage });
  console.log("\nHOURLY CLIMATE READINGS INITIATED...");
  call.on("data", (climateReading) => {
    const reading = `
    WEATHER DETAILS FOR ${climateReading.time}
    -------------------------
    TEMPERATURE: ${climateReading.temperature}
    HUMIDITY:    ${climateReading.humidity}
    `;
    console.log(reading);
    return reading;
  });
  call.on("end", () => {
    console.log("CLIMATE READINGS COMPLETE.  SYSTEM RESET FOR TOMORROW. \n");
  });
};

// Function call to trigger the climate readings.
initiateClimateReadings();

module.exports = {
  initiateClimateReadings,
};
