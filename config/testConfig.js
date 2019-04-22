
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('../client/node_modules/bignumber.js');

var Config = async function (accounts) {

    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x69e1CB5cFcA8A311586e3406ed0301C06fb839a2",
        "0xF014343BDFFbED8660A9d8721deC985126f189F3",
        "0x0E79EDbD6A727CfeE09A2b1d0A59F7752d5bf7C9",
        "0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4",
        "0xa23eAEf02F9E0338EEcDa8Fdd0A73aDD781b2A86",
        "0x6b85cc8f612d5457d49775439335f83e12b8cfde",
        "0xcbd22ff1ded1423fbc24a7af2148745878800024",
        "0xc257274276a4e539741ca11b590b9447b26a8051",
        "0x2f2899d6d35b1a48a4fbdc93a37a72f264a9fca7"
    ];

    const passenger1 = testAddresses[0];
    const passenger2 = testAddresses[1];

    const owner = accounts[0];
    const adminUser = accounts[0];
    // first Airline
    const firstAirline = accounts[0];
    const fiaId = 'ND'
    const fiaName = 'FirstAirline'
    const fiaCountry = 'USA'
    const fiaFlightNumber1 = '1309'


    const secondAirline = accounts[1];
    const seaId = 'LH'
    const seaName = 'Lufthansa'
    const seaCountry = 'Germany'
    const seaFlightNumber1 = '403'

    const thirdAirline = accounts[2];
    const thaId = 'AF'
    const thaName = 'Air France'
    const thaCountry = 'France'
    const thaFlightNumber1 = '1319'

    const fourthAirline = accounts[3];
    const foaId = 'BA'
    const foaName = 'Britisch Airways'
    const foaCountry = 'United Kingdom'

    const fifthAirline = accounts[4];
    const fifaId = 'KL'
    const fifaName = 'KLM'
    const fifaCountry = 'Netherlands'

    const sixAirline = accounts[5];
    const sixfaId = 'TK'
    const sixfaName = 'Turkish Airlines'
    const sixfaCountry = 'Turkey'


    //  R1. First airline is registered when contract (FlightSuretyData) is deployed.
    let flightSuretyData = await FlightSuretyData.new(fiaId, fiaName, fiaCountry);
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);


    return {
        owner: owner,
        adminUser: adminUser,
        passenger1: passenger1,
        passenger2: passenger2,

        firstAirline: firstAirline,     // 1.
        fiaId: fiaId,
        fiaName: fiaName,
        fiaCountry: fiaCountry,
        fiaFlightNumber1: fiaFlightNumber1,

        secondAirline: secondAirline,   // 2.
        seaId: seaId,
        seaName: seaName,
        seaCountry: seaCountry,
        seaFlightNumber1: seaFlightNumber1,

        thirdAirline: thirdAirline,     // 3.
        thaId: thaId,
        thaName: thaName,
        thaCountry: thaCountry,
        thaFlightNumber1: thaFlightNumber1,

        fourthAirline: fourthAirline,     // 4.
        foaId: foaId,
        foaName: foaName,
        foaCountry: foaCountry,

        fifthAirline: fifthAirline,     // 5.
        fifaId: fifaId,
        fifaName: fifaName,
        fifaCountry: fifaCountry,

        sixfthAirline: sixAirline,     // 6.
        sixfaId: sixfaId,
        sixfaName: sixfaName,
        sixfaCountry: sixfaCountry,

        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};