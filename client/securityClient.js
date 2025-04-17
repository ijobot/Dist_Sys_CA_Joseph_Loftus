const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
const definition = protoLoader.loadSync(SECURITY_PROTO_PATH);
const securityProto = grpc.loadPackageDefinition(definition).security;

const client = new securityProto.SecurityService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

const question = "What is your employee number?";
client.AskSecurityQuestion({ question: question }, (error, response) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(
      `
      ACCESS GRANTED 
      
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
