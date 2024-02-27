const { filesLocation, activePeers } = require("../../data/data");

const login = (call) => {
  const [, ip] = call.getPeer().split(":");

  activePeers.add(ip);
  return "OK. Peer logged in";
};

const search = (call) => {
  const { fileName } = call.request;

  const peers = filesLocation[fileName];
  console.log("Matched peers: ", peers);

  return Array.from(peers ?? []);
};

const index = (call) => {
  const [, ip] = call.getPeer().split(":");
  const { fileList } = call.request;

  fileList.forEach((file) => {
    if (!filesLocation[file]) {
      filesLocation[file] = new Set();
    }
    filesLocation[file].add(ip);
  });

  console.log("Files directory: ", filesLocation);

  return "OK. Files indexed";
};

const logout = (call) => {
  const [, ip] = call.getPeer().split(":");

  activePeers.delete(ip);
  for (const file in filesLocation) {
    filesLocation[file].delete(ip);
  }

  return "OK. Peer logged out";
};

module.exports = { login, search, index, logout };
