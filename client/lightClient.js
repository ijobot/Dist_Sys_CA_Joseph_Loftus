const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const readline = require("readline-sync");

const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const definition = protoLoader.loadSync(LIGHT_PROTO_PATH);
const lightProto = grpc.loadPackageDefinition(definition).light;

const client = new lightProto.LightService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

const getLight = () => {
  const lightId = readline.question(
    "Please enter a Light ID to see its details: \n"
  );
  client.getLight({ id: lightId }, (error, response) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log(
        `
          DETAILS FOR LIGHT ${response.id}
          room:          ${response.room}
          brightness:    ${response.brightness}
          color:         ${response.color}
          `
      );
    }
  });
};

const setLight = () => {
  const lightToSet = parseInt(
    readline.question("Which light would you like to update? \n")
  );
  const setBrightness = parseInt(
    readline.question("Please enter a brightness setting from 1-100: \n")
  );
  const setColor = readline.question("Please enter the color setting: \n");
  client.setLight(
    {
      id: lightToSet,
      brightness: setBrightness,
      color: setColor,
    },
    (error, response) => {
      if (error) {
        console.error("Error:", error);
      } else {
        console.log(
          `
          ${response.confirmationMessage}
          `
        );
      }
    }
  );
};

const getRoomLights = () => {
  const roomResponse = readline.question(
    "Enter a room to see which lights are available: \n"
  );
  const call = client.getRoomLights({ room: roomResponse });
  console.log(`\nThe following lights are in room "${roomResponse}":`);
  call.on("data", (light) => {
    console.log(`${light.id}`);
  });
  call.on("end", () => console.log(" "));
};

const setMultipleLights = () => {
  const call = client.setMultipleLights((error, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log(response.confirmationMessage);
    }
  });
  const brightness = parseInt(
    readline.question(
      "Please enter a brightness setting from 1-100 for multiple lights: \n"
    )
  );
  const color = readline.question(
    "Please enter a color setting for multiple lights: \n"
  );

  let addMore = true;
  while (addMore) {
    const id = parseInt(
      readline.question("Please enter a light ID to add to the list. \n")
    );
    call.write({ id, brightness, color });
    addMore = readline.keyInYNStrict("Add another? \n");
  }
  call.end();
};

function mainMenu() {
  console.log(
    `
      1. Get a single light by its ID.
      2. Get all the light IDs in a particular room.
      3. Adjust a single light's settings.
      4. Adjust all lights in a particular room.
      5. Exit the Light Service.
      `
  );
  const choice = parseInt(readline.question("Choose a function: \n"));

  switch (choice) {
    case 1:
      getLight();
      break;
    case 2:
      getRoomLights();
      break;
    case 3:
      setLight();
      break;
    case 4:
      setMultipleLights();
      break;
    case 5:
      return;
    default:
      console.log("Please choose a function from 1 to 4.");
  }
}

mainMenu();
