const PROTO_PATH = __dirname + "/tracker.proto";
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const {
  login,
  logout,
  search,
  index,
} = require("./controllers/tracker.controllers");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const trackerProto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

server.addService(trackerProto.Tracker.service, {
  login: (call, callback) => {
    const message = login(call);
    callback(null, { message: message });
  },
  logout: (call, callback) => {
    const message = logout(call);
    callback(null, { message: message });
  },
  search: (call, callback) => {
    const peers = search(call);
    callback(null, { peers: peers });
  },
  index: (call, callback) => {
    const message = index(call);
    callback(null, { message: message });
  },
});
server.bind("localhost:5000", grpc.ServerCredentials.createInsecure());

module.exports = server;
