const os = require("os");

const getSystemIPAddress = () => {
  const interfaces = os.networkInterfaces();
  let systemIPAddress = "Unknown";

  Object.keys(interfaces).forEach((interfaceName) => {
    const addresses = interfaces[interfaceName];
    addresses.forEach((address) => {
      if (!address.internal && address.family === "IPv4") {
        systemIPAddress = address.address;
      }
    });
  });

  return systemIPAddress;
};

module.exports = {
  getSystemIPAddress,
};