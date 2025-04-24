const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const CLIMATE_PROTO_PATH = path.join(__dirname, "../protos/climate.proto");
const definition = protoLoader.loadSync(CLIMATE_PROTO_PATH);
const climateProto = grpc.loadPackageDefinition(definition).climate;

const client = new climateProto.ClimateService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const initiateClimateReadings = () => {
  const requestMessage = "Begin streaming today's weather readings.";
  const call = client.InitiateClimateReadings({ message: requestMessage });
  console.log("\nHOURLY CLIMATE READINGS INITIATED...");
  call.on("data", (climateReading) => {
    console.log(
      `
    WEATHER DETAILS FOR ${climateReading.time}
    -------------------------
    TEMPERATURE: ${climateReading.temperature}
    HUMIDITY:    ${climateReading.humidity}
    `
    );
  });
  call.on("end", () => {
    console.log("CLIMATE READINGS COMPLETE.  SYSTEM RESET FOR TOMORROW. \n");
  });
};

initiateClimateReadings();
