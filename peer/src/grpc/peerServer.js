const PROTO_PATH = __dirname + "/peer.proto";
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const trackerClient = require("../grpc/trackerClient");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const peerProto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

server.addService(peerProto.Peer.service, {
  download: (call, callback) => {
    const { file } = call.request;
    console.log(
      `Download request for file ${file} received. Sending file data...`
    );
    callback(null, { message: `This is the data of the file` });
  },
  upload: async (call, callback) => {
    const { fileList } = call.request;

    console.log(
      "Upload request for files received\nDownloading file data: " + fileList
    );

    try {
      let response = await new Promise((resolve, reject) => {
        trackerClient.index({ fileList: fileList }, (err, response) => {
          if (err) reject(err);
          resolve(response);
        });
      });
      console.log(response);
      callback(null, { message: `File data uploaded successfully` });

    } catch (error) {
      console.error(error);
    }
  },
});
server.bind("localhost:30043", grpc.ServerCredentials.createInsecure());

module.exports = server;
