const fs = require('fs');
const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");

module.exports = function (deployer) {
  // first Airline
  //let firstAirline = owner; // accounts[0]
  let fiaId = 'ND'
  let fiaName = 'FirstAirline'
  let fiaCountry = 'Germany'

  deployer.deploy(FlightSuretyData, fiaId, fiaName, fiaCountry)
    .then(() => {
      return deployer.deploy(FlightSuretyApp, FlightSuretyData.address)
        .then(() => {
          let config = {
            localhost: {
              url: 'http://localhost:8545',
              dataAddress: FlightSuretyData.address,
              appAddress: FlightSuretyApp.address
            }
          }
          fs.writeFileSync(__dirname + '/../client/src/utils/config.json', JSON.stringify(config, null, '\t'), 'utf-8');
          fs.writeFileSync(__dirname + '/../server/src/server/config.json', JSON.stringify(config, null, '\t'), 'utf-8');
        });
    });
};
