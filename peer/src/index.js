const express = require("express");
const router = require("./routes/peer.routes");

const trackerClient = require("./grpc/trackerClient");
const peerServer = require("./grpc/peerServer");

const files = require("./data/files");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(router);

app.listen(PORT, () => {

  const randomAmount = Math.round(Math.random() * files.length);
  const randomPeerFiles = [];
  for (let i = 0; i < randomAmount; i++) {
    const randomFile = Math.round(Math.random() * (files.length - 1));
    randomPeerFiles.push(files[randomFile]);
  }

  new Promise((resolve, reject) => {
    trackerClient.login({}, (err, response) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log(response);
      resolve(response);
    });
  }).then((response) => {
    trackerClient.index(
      { fileList: randomPeerFiles },
      (err, response) => {
        if (err) {
          console.error(err);
        }
        console.log(response);
      }
    );
  });
});

try {
  peerServer.start();
  console.log("Peer server running");
} catch (error) {
  console.error(error);
  process.exit(1);
}
