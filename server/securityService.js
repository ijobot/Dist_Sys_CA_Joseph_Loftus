const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
const definition = protoLoader.loadSync(SECURITY_PROTO_PATH);
const securityProto = grpc.loadPackageDefinition(definition).security;

const users = [
  { name: "Security Desk", empID: 1111 },
  { name: "Shane Gillern", empID: 2222 },
  { name: "Juliet Walsh", empID: 3333 },
  { name: "Joe Loftus", empID: 4444 },
  { name: "Kate Scott", empID: 5555 },
  { name: "Beth Buchanan", empID: 6666 },
  { name: "Joel Embiid", empID: 7777 },
  { name: "Tyrese Maxey", empID: 8888 },
  { name: "Bryce Harper", empID: 9999 },
];

const securityClearance = (call) => {
  const secDesk = "SECURITY DESK";
  const confirmMessage = "Please confirm your Employee ID.";
  const secretQuestion = "What is this week's secret Lego piece?";
  const successMessage =
    "Welcome to J&J Brick Shippers!  The door is now open! \n";
  const rejectionMessage = "Sorry, but you cannot be verified.  Goodbye.";
  const secretPiece = "Jumper Plate";

  call.on("data", (correspondence) => {
    console.log(correspondence.action.toString());
    const onList = users.find(
      (u) =>
        u.name.toLowerCase() === correspondence.user.toString().toLowerCase()
    );
    const empMatch = users.find(
      (u) => u.empID === parseInt(correspondence.user)
    );
    const secretAnswer =
      correspondence.user.toString().toLowerCase() ===
      secretPiece.toLowerCase();

    if (correspondence.action.toString() === "sign in" && onList) {
      call.write({
        user: secDesk,
        action: "ID VERIFY:",
        message: confirmMessage,
      });
    } else if (correspondence.action.toString() === "verify" && empMatch) {
      call.write({
        user: secDesk,
        action: "FINAL CHECK:",
        message: secretQuestion,
      });
    } else if (
      correspondence.action.toString() === "secret piece" &&
      secretAnswer
    ) {
      call.write({
        user: secDesk,
        action: "AUTHORIZED:",
        message: successMessage,
      });
      call.end();
    } else {
      call.write({
        user: secDesk,
        action: "REFUSE:",
        message: rejectionMessage,
      });
      call.end();
    }
  });

  call.on("end", () => {
    call.end();
  });

  call.on("error", (e) => {
    console.log(e);
  });
};

const server = new grpc.Server();
server.addService(securityProto.SecurityService.service, {
  SecurityClearance: securityClearance,
});

const PORT = "50053";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Security Service is running on localhost:${PORT}`);
  }
);
