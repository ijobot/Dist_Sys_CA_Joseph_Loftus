const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const crypto = require("crypto-js");

const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
const definition = protoLoader.loadSync(SECURITY_PROTO_PATH);
const securityProto = grpc.loadPackageDefinition(definition).security;

// Emulating an employee/user database (would be hosted in Mongo or SQL in a real world scenario).
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

// -----------------------------
// Main Security System function
// Bidirectional Service
// -----------------------------

// Helper functions for encryption
const encryptBeforeSend = (message, secretKey) => {
  return crypto.AES.encrypt(message, secretKey).toString();
};
const decryptOnRecieve = (cipherText, secretKey) => {
  let bytes = crypto.AES.decrypt(cipherText, secretKey);
  return bytes.toString(crypto.enc.Utf8);
};
const secretKey = "12345isThePasswordOnMyLuggage";

const securityClearance = (call) => {
  const secDesk = "SECURITY DESK";
  const confirmMessage = "Please confirm your Employee ID.";
  const secretQuestion = "What is this week's secret Lego piece?";
  const successMessage =
    "Welcome to J&J Brick Shippers!  The door is now open! \n";
  const rejectionMessage = "Sorry, but you cannot be verified.  Goodbye.";
  const secretPiece = "Jumper Plate";

  call.on("data", (correspondence) => {
    console.log(correspondence.message);
    const decryptedText = decryptOnRecieve(correspondence.message, secretKey);
    console.log(`${decryptedText} \n`);

    const onList = users.find(
      (u) => u.name.toLowerCase() === decryptedText.toLowerCase()
    );
    const empMatch = users.find((u) => u.empID === parseInt(decryptedText));
    const secretAnswer =
      decryptedText.toLowerCase() === secretPiece.toLowerCase();

    // When they type their name in (real world would involve swiping an ID badge), the system asks them to confirm thier employee ID.
    // This is the first back-and-forth.
    if (correspondence.action.toString() === "sign in" && onList) {
      call.write({
        user: secDesk,
        action: "ID VERIFY:",
        message: encryptBeforeSend(confirmMessage, secretKey),
      });
      // Once they have entered their ID and it has been checked, the system asks them for a secret password.
      // This is the second back-and-forth.
    } else if (correspondence.action.toString() === "verify" && empMatch) {
      call.write({
        user: secDesk,
        action: "FINAL CHECK:",
        message: encryptBeforeSend(secretQuestion, secretKey),
      });
      // Once they have entered the secret password, the system either allows them in or denies them entry.
      // This is the final back-and-forth.
    } else if (
      correspondence.action.toString() === "secret piece" &&
      secretAnswer
    ) {
      // Authorizing call
      call.write({
        user: secDesk,
        action: "AUTHORIZED:",
        message: successMessage,
      });
      call.end();
    } else {
      // Refusal call
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

  call.on("error", (error) => {
    console.log(
      "Error :: securityClearance function :: securityService file",
      error
    );
  });
};

// Creating the server and adding the Security Service via the proto file.
const server = new grpc.Server();
server.addService(securityProto.SecurityService.service, {
  SecurityClearance: securityClearance,
});

// Choosing and assigning a port for the service.
const PORT = "50053";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`
      Security Service is running on localhost:${PORT}.
      `);
  }
);
