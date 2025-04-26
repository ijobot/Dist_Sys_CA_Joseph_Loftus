const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const readline = require("readline");

const SECURITY_PROTO_PATH = path.join(__dirname, "../protos/security.proto");
const definition = protoLoader.loadSync(SECURITY_PROTO_PATH);
const securityProto = grpc.loadPackageDefinition(definition).security;

const client = new securityProto.SecurityService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

const securityClearance = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const call = client.securityClearance();
  call.on("data", (response) => {
    console.log(`
    ${response.user} - ${response.action} ${response.message}
    `);
    currentAction++;
  });

  call.on("end", () => {
    call.end();
    rl.close();
  });

  call.on("error", (e) => {
    console.log(e);
  });

  let currentAction = 1;

  console.log(
    "SECURITY - DESK WELCOME: Please type your full name, or 'Q' to quit. "
  );

  rl.on("line", (enteredText) => {
    if (enteredText.toLowerCase() === "q") {
      call.end();
      rl.close();
    }
    if (currentAction === 1) {
      call.write({ action: "sign in", user: enteredText, message: "" });
    }
    if (currentAction === 2) {
      call.write({ action: "verify", user: enteredText, message: "" });
    }
    if (currentAction === 3) {
      call.write({ action: "secret piece", user: enteredText, message: "" });
    }
    if (currentAction === 4) {
      call.end();
      rl.close();
    }
  });
};

module.exports = {
  securityClearance,
};
