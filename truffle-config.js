const path = require("path");
//var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
//var mnemonic = "smile equal furnace lens crunch person cause sword goddess print answer reason";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // match any network
      websockets: true
    },
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};
