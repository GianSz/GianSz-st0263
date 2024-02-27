const trackerClient = require("../grpc/trackerClient");
const createClient = require("../grpc/peerClient");

const downloadFile = async (req, res) => {
  try {
    const { file } = req.params;
    console.log("\n---------------------\nDownload process started\n");

    let response = await new Promise((resolve, reject) => {
      trackerClient.search({ fileName: file }, (err, response) => {
        if (err) reject(err);
        resolve(response);
      });
    });
    console.log(response);

    const ip = response.peers[0];
    if (ip === undefined) {
      console.log("File not found");
      return res.status(404).json({
        status: 404,
        message: "File not found",
      });
    }

    response = await new Promise((resolve, reject) => {
      const client = createClient(ip);
      client.download({ file: file }, (err, response) => {
        if (err) reject(err);
        resolve(response);
      });
    });
    console.log(response);

    console.log("Updating tracker...");
    response = await new Promise((resolve, reject) => {
      trackerClient.index({ fileList: [file] }, (err, response) => {
        if (err) reject(err);
        resolve(response);
      });
    });
    console.log(response);
    console.log("\nDownload process completed\n---------------------\n");

    res.status(200).json({
      status: 200,
      data: file,
      message: "OK",
    });
  } catch (error) {
    console.error(error);
  }
};

const uploadFile = async (req, res) => {
  try {
    const { ip, fileList } = req.body;
    console.log("\n---------------------\nUpload process started\n");

    let response = await new Promise((resolve, reject) => {
      const client = createClient(ip);
      client.upload({ fileList: fileList }, (err, response) => {
        if (err) reject(err);
        resolve(response);
      });
    });
    console.log(response);

    res.status(201).json({
      status: 201,
      message: "OK",
    });
  } catch (error) {
    console.error(error);
  }

  console.log("\nUpload process completed\n---------------------\n");
};

module.exports = {
  downloadFile,
  uploadFile,
};
