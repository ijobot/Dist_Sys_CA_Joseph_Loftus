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

const lightId = 12;
client.GetLight({ id: lightId }, (error, response) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(
      `
      LIGHT DETAILS 
      id:         ${response.id}
      room:       ${response.room}
      brightness: ${response.brightness}
      color:      ${response.color}
      `
    );
  }
});

// const room = "conference";
// client.getRoomLights({ room: room }, (error, response) => {
//   if (error) {
//     console.error("Error:", error);
//   } else {
//     console.log(`The room ${room} has the following lights in it: ${response}`);
//   }
// });

// const call = client.getRoomLights({ room: room });
// call.on("data", (light) => {
//   console.log("HI JOE WORKING");
// });
// call.on("end", () => {
//   console.log("Server done.");
// });
