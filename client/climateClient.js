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

const requestMessage = "Begin streaming today's weather readings.";
client.GetClimateReading({ message: requestMessage }, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log(
      `
      WEATHER DETAILS 
      temperature: ${response.temperature}
      humidity:    ${response.humidity}
      `
    );
  }
});
