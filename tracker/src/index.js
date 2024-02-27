const server = require("./grpc/trackerServer");

try {
  server.start();
  console.log("Tracker server running");
} catch (error) {
  console.error(error);
  process.exit(1);
}
