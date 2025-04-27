const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const definition = protoLoader.loadSync(LIGHT_PROTO_PATH);
const lightProto = grpc.loadPackageDefinition(definition).light;

// Emulating a lightmap database (would be hosted in Mongo or SQL in a real world scenario).
const lights = [
  { id: 1, room: "conference", brightness: 100, color: "bright white" },
  { id: 2, room: "conference", brightness: 100, color: "bright white" },
  { id: 3, room: "conference", brightness: 100, color: "bright white" },
  { id: 4, room: "conference", brightness: 100, color: "bright white" },
  { id: 5, room: "conference", brightness: 100, color: "bright white" },
  { id: 6, room: "conference", brightness: 100, color: "bright white" },
  { id: 7, room: "office 1", brightness: 70, color: "light blue" },
  { id: 8, room: "office 1", brightness: 70, color: "light blue" },
  { id: 9, room: "office 2", brightness: 0, color: "warm yellow" },
  { id: 10, room: "office 2", brightness: 0, color: "warm yellow" },
  { id: 11, room: "entrance", brightness: 100, color: "red" },
  { id: 12, room: "entrance", brightness: 100, color: "green" },
  { id: 13, room: "entrance", brightness: 100, color: "red" },
  { id: 14, room: "entrance", brightness: 100, color: "green" },
  { id: 15, room: "hallway", brightness: 90, color: "soft white" },
  { id: 16, room: "hallway", brightness: 90, color: "soft white" },
  { id: 17, room: "hallway", brightness: 90, color: "soft white" },
  { id: 18, room: "hallway", brightness: 90, color: "soft white" },
  { id: 19, room: "elevator", brightness: 60, color: "warm yellow" },
  { id: 20, room: "elevator", brightness: 60, color: "warm yellow" },
];

// --------------------------
// Main Light System function
// Unary Service
// --------------------------

// Function makes a single call and returns a light object as a response.
const getLight = (call, callback) => {
  const light = lights.find((light) => light.id === call.request.id);
  if (light) {
    callback(null, light);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Light not found.",
    });
  }
};

// Function makes a single call with settings and then confirms via response.
const setLight = (call, callback) => {
  const light = lights.find((light) => light.id === call.request.id);
  if (light) {
    light.brightness = call.request.brightness;
    light.color = call.request.color;
    const confirmationMessage = `
    LIGHT ${light.id} IN "${light.room.toUpperCase()}" HAS BEEN SET!
    brightness: ${light.brightness}
    color: ${light.color}
    `;
    callback(null, { confirmationMessage });
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "There was a problem.  Light has not been set.",
    });
  }
};

// --------------------------
// Main Light System function
// Server-Streaming Service
// --------------------------

// Function makes a single call using a room argument and returns a stream of lights in that room.
const getRoomLights = (call) => {
  lights.forEach((light) => {
    if (light.room === call.request.room) {
      call.write(light);
    }
  });
  call.end();
};

// --------------------------
// Main Light System function
// Client-Streaming Service
// --------------------------

// Function makes multiple calls with settings data and then responds with a single confirmation.
const setMultipleLights = (call, callback) => {
  const lightsToSet = [];
  let setBrightness = 0;
  let setColor = "white";

  call.on("data", ({ id, brightness, color }) => {
    lightsToSet.push(id);
    setBrightness = brightness;
    setColor = color;
  });
  call.on("end", () => {
    const confirmationMessage = `Lights [${lightsToSet.join(
      " "
    )}] have all been set to brightness: ${setBrightness} and color: ${setColor.toUpperCase()}.`;
    callback(null, { confirmationMessage });
  });
};

// Creating the server and adding the Light Service via the proto file.
const server = new grpc.Server();
server.addService(lightProto.LightService.service, {
  GetLight: getLight,
  GetRoomLights: getRoomLights,
  SetLight: setLight,
  SetMultipleLights: setMultipleLights,
});

// Choosing and assigning a port for the service.
const PORT = "50052";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Light Service is running on localhost:${PORT}`);
  }
);
