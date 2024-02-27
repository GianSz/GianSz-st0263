const PROTO_PATH = __dirname + "/tracker.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const Tracker = grpc.loadPackageDefinition(packageDefinition).Tracker;
const client = new Tracker("localhost:5000", grpc.credentials.createInsecure());

module.exports = client;
