const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const definition = protoLoader.loadSync(LIGHT_PROTO_PATH);
const lightProto = grpc.loadPackageDefinition(definition).light;

// Emulating a lightmap database (would be hosted in Mongo or SQL in a real world scenario).
const lights = [
  { id: 1, location: "conference", brightness: 100, color: "bright white" },
  { id: 2, location: "conference", brightness: 100, color: "bright white" },
  { id: 3, location: "conference", brightness: 100, color: "bright white" },
  { id: 4, location: "conference", brightness: 100, color: "bright white" },
  { id: 5, location: "conference", brightness: 100, color: "bright white" },
  { id: 6, location: "conference", brightness: 100, color: "bright white" },
  { id: 7, location: "office 1", brightness: 70, color: "light blue" },
  { id: 8, location: "office 1", brightness: 70, color: "light blue" },
  { id: 9, location: "office 2", brightness: 0, color: "warm yellow" },
  { id: 10, location: "office 2", brightness: 0, color: "warm yellow" },
  { id: 11, location: "entrance", brightness: 100, color: "red" },
  { id: 12, location: "entrance", brightness: 100, color: "green" },
  { id: 13, location: "entrance", brightness: 100, color: "red" },
  { id: 14, location: "entrance", brightness: 100, color: "green" },
  { id: 15, location: "hallway", brightness: 90, color: "soft white" },
  { id: 16, location: "hallway", brightness: 90, color: "soft white" },
  { id: 17, location: "hallway", brightness: 90, color: "soft white" },
  { id: 18, location: "hallway", brightness: 90, color: "soft white" },
  { id: 19, location: "elevator", brightness: 60, color: "warm yellow" },
  { id: 20, location: "elevator", brightness: 60, color: "warm yellow" },
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
    LIGHT ${
      light.id
    } IN LOCATION "${light.location.toUpperCase()}" HAS BEEN SET!
    BRIGHTNESS:  ${light.brightness}
    COLOR:       ${light.color.toUpperCase()}
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

// Function makes a single call using a location argument and returns a stream of lights in that location.
const getLocationLights = (call) => {
  lights.forEach((light) => {
    if (light.location === call.request.location) {
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
  GetLocationLights: getLocationLights,
  SetLight: setLight,
  SetMultipleLights: setMultipleLights,
});

// Choosing and assigning a port for the service.
const PORT = "50052";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`
      Light Service is running on localhost:${PORT}.
      `);
  }
);
