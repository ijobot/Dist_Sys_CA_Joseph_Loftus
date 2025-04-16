const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("../protos/order.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).order;

const placeOrder = (call, callback) => {
  console.log(`Received order from ${call.request.customerName}.`);
  const confirmationMessage = `Order placed for ${call.request.item}.`;
  callback(null, { confirmationMessage });
};

const server = new grpc.Server();
server.addService(proto.OrderService.service, { PlaceOrder: placeOrder });

const PORT = "5001";
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`Server running on localhost:${PORT}`);
  }
);
