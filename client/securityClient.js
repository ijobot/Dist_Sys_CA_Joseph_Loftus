const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const readline = require("readline");
const crypto = require("crypto-js");

const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
const definition = protoLoader.loadSync(SECURITY_PROTO_PATH);
const securityProto = grpc.loadPackageDefinition(definition).security;

// Creating the client and loading the proto.
const client = new securityProto.SecurityService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

// Helper functions for encryption
const encryptBeforeSend = (message, secretKey) => {
  return crypto.AES.encrypt(message, secretKey).toString();
};
const decryptOnReceive = (cipherText, secretKey) => {
  let bytes = crypto.AES.decrypt(cipherText, secretKey);
  return bytes.toString(crypto.enc.Utf8);
};
const secretKey = "12345isThePasswordOnMyLuggage";

// Client functionality for the Security Service.
const securityClearance = () => {
  // Create the interface for users to type their choices/responses.
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // When receiving call data, print out in readable fashion and increase the currentAction value by 1.
  const call = client.securityClearance();
  call.on("data", (response) => {
    console.log(response.message);
    if (response.action === "AUTHORIZED:" || response.action === "REFUSE:") {
      console.log(`
        ${response.user} - ${response.action} ${response.message}
        `);
    } else {
      const decryptedMessage = decryptOnReceive(response.message, secretKey);
      console.log(`
      ${response.user} - ${response.action} ${decryptedMessage}
      `);
    }
    currentAction++;
  });

  call.on("end", () => {
    call.end();
    rl.close();
  });

  call.on("error", (error) => {
    console.log(
      "Error :: securityClearance function :: securityClient file",
      error
    );
  });

  let currentAction = 1;

  // Initialising prompt to start bidirectional communication.
  console.log(
    "\nSECURITY DESK - WELCOME: Please type your full name, or 'Q' to quit. "
  );

  // Series of questions and answers streamed from both the Server-side and Client-side.
  rl.on("line", (enteredText) => {
    if (enteredText.toLowerCase() === "q") {
      call.end();
      rl.close();
    }
    const encrytedText = encryptBeforeSend(enteredText, secretKey);
    if (currentAction === 1) {
      call.write({
        action: "sign in",
        user: "employee",
        message: encrytedText,
      });
    }
    if (currentAction === 2) {
      call.write({ action: "verify", user: "employee", message: encrytedText });
    }
    if (currentAction === 3) {
      call.write({
        action: "secret piece",
        user: "employee",
        message: encrytedText,
      });
    }
    if (currentAction === 4) {
      call.end();
      rl.close();
    }
  });
};

securityClearance();

module.exports = {
  securityClearance,
};
