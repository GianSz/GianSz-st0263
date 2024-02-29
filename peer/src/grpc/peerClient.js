const PROTO_PATH = __dirname + "/peer.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const Peer = grpc.loadPackageDefinition(packageDefinition).Peer;

const createClient = (ip) => {
  return new Peer(ip + ":5000", grpc.credentials.createInsecure());
};

module.exports = createClient;
