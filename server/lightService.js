const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const LIGHT_PROTO_PATH = path.join(__dirname, "../protos/light.proto");
const definition = protoLoader.loadSync(LIGHT_PROTO_PATH);
const lightProto = grpc.loadPackageDefinition(definition).light;

const lights = [
  { id: 1, room: "conference", brightness: 100, color: "bright white" },
  { id: 2, room: "conference", brightness: 100, color: "bright white" },
  { id: 3, room: "conference", brightness: 100, color: "bright white" },
  { id: 4, room: "office 1", brightness: 70, color: "light blue" },
  { id: 5, room: "office 1", brightness: 70, color: "light blue" },
  { id: 6, room: "office 2", brightness: 0, color: "warm yellow" },
  { id: 7, room: "office 2", brightness: 0, color: "warm yellow" },
  { id: 8, room: "entrance", brightness: 100, color: "red" },
  { id: 9, room: "entrance", brightness: 100, color: "green" },
  { id: 10, room: "entrance", brightness: 100, color: "red" },
  { id: 11, room: "entrance", brightness: 100, color: "green" },
  { id: 12, room: "hallway", brightness: 90, color: "soft white" },
  { id: 13, room: "hallway", brightness: 90, color: "soft white" },
  { id: 14, room: "elevator", brightness: 60, color: "warm yellow" },
];

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

const getRoomLights = (call) => {
  lights.forEach((light) => {
    if (light.room === call.request.room) {
      call.write(light);
    }
  });
  call.end();
};

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

const setRoomLights = (call, callback) => {
  const roomlights = lights.filter((light) => light.room !== call.request.room);
  if (roomlights) {
    roomlights.forEach((rm) => {
      (rm.brightness = call.request.brightness),
        (rm.color = call.request.color);
    });
    const confirmationMessage = `All lights in room ${call.request.room} have been set to brightness: ${light.brightness} and color: ${light.color}.`;
    callback(null, confirmationMessage);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Room not found",
    });
  }
};

const server = new grpc.Server();
server.addService(lightProto.LightService.service, {
  GetLight: getLight,
  GetRoomLights: getRoomLights,
  SetLight: setLight,
  SetRoomLights: setRoomLights,
});

const PORT = "50052";
server.bindAsync(
  `localhost:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Light Service is running on localhost:${PORT}`);
  }
);
