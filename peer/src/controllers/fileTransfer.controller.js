const trackerClient = require("../grpc/trackerClient");
const createClient = require("../grpc/peerClient");

const downloadFile = async (req, res) => {
    // const client = createClient("127.0.0.1");
    // console.log(client);
    // console.log("meloo")

    const { file } = req.params;
    let response;
    
    response = await new Promise((resolve, reject) => {
        trackerClient.search({ fileName: file }, (err, response) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(response);
        });
    })
    
    const ip = response.peers[0];

    if(ip === undefined) {
        console.log("File not found");
        return res.status(404).json({
            status: 404,
            message: "File not found"
        });
    }

    response = await new Promise((resolve, reject) => {
        const client = createClient(ip);
        client.download({ file: file }, (err, response) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log(response);
            resolve(response);
        });
    });

    console.log("File downloaded. Updating tracker...");
    response = await new Promise((resolve, reject) => {
        trackerClient.index({ fileList: [file] }, (err, response) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log(response);
            resolve(response);
        });
    });

    res.status(200).json({
        status: 200,
        data: file,
        message: "OK"
    });
}

const uploadFile = async (req, res) => {
    const { ip, fileList } = req.body;

    let response;
    response = await new Promise((resolve, reject) => {
        const client = createClient(ip);
        client.upload({ fileList: fileList }, (err, response) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log(response);
            resolve(response);
        });
    });

    res.status(201).json({
        status: 201,
        message: "OK"
    });
}

module.exports = {
    downloadFile,
    uploadFile
}