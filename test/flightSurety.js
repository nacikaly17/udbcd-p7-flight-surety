
var Test = require('../config/testConfig.js');
var BigNumber = require('../client/node_modules/bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

    var config;

    before('setup contract', async () => {
        config = await Test.Config(accounts);

        console.log("-----------------------------")
        console.log("Owner         accounts[0]  : ", config.owner);
        console.log("AdminUser     accounts[1]  : ", config.adminUser);
        console.log("FirstAirline  accounts[2]  : "
            , config.firstAirline, config.fiaId, config.fiaName, config.fiaCountry);
        console.log("SecondAirline accounts[3]  : ", config.secondAirline);
        console.log("ThirdAirline  accounts[4]  : ", config.thirdAirline);
        console.log("FourthAirline accounts[5]  : ", config.fourthAirline);
        console.log("FifthAirline  accounts[6]  : ", config.fifthAirline);
        console.log("-----------------------------")
        console.log("FlightSuretyApp Address    : ", config.flightSuretyApp.address);
        console.log("FlightSuretyData Address   : ", config.flightSuretyData.address);
        console.log("-----------------------------")
        await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    });

    /****************************************************************************************/
    /* FlightSuretyApp Operations and Settings                                              */
    /****************************************************************************************/

    it(`1. flightSuretyApp has correct  isOperational()`, async function () {

        // Get operating status
        let status = await config.flightSuretyApp.isOperational.call();
        assert.equal(status, true, "flightSuretyApp is not operational");

    });

    it(`2. flightSuretyApp contractOwner is registered as admin user`, async function () {

        // Get isUserRegistered
        let status = await config.flightSuretyApp.isUserRegistered.call(config.owner);
        assert.equal(status, true, "contractOwner is not registered as admin user");

    });

    it('3. flightSuretyApp contractOwner can register new user', async () => {

        // ARRANGE
        let newUser = config.testAddresses[0];

        // ACT
        await config.flightSuretyApp.registerUser(newUser, false, { from: config.owner });
        let result = await config.flightSuretyApp.isUserRegistered.call(newUser);

        // ASSERT
        assert.equal(result, true, "Contract owner cannot register new user");

    });

    it('4. flightSuretyApp adminUser can change operational of contract', async () => {

        // ARRANGE
        // let adminUser = config.owner;

        let startStatus = await config.flightSuretyApp.isOperational.call();
        let changeStatus = !startStatus;

        // ACT
        await config.flightSuretyApp.setOperatingStatus(changeStatus, { from: config.owner });
        let newStatus = await config.flightSuretyApp.isOperational.call();

        // ASSERT
        assert.equal(changeStatus, newStatus, "setOperatingStatus call failed");

        // set operating status true for future calls
        await config.flightSuretyApp.setOperatingStatus(true, { from: config.owner });
        let status = await config.flightSuretyApp.isOperational.call();
        // ASSERT
        assert.equal(status, true, "setOperatingStatus call failed for following actions.");
    });

    /****************************************************************************************/
    /* FlightSuretyData Operations and Settings                                              */
    /****************************************************************************************/

    it(`5. flightSuretyData has correct initial isOperational() value`, async function () {

        // Get operating status
        let status = await config.flightSuretyData.isOperational.call();
        assert.equal(status, true, "Incorrect initial operating status value");

    });

    it(`6. check setOperatingStatus() for non-Contract Owner account`, async function () {

        // Ensure that access is denied for non-Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, true, "Access not restricted to Contract Owner");

    });

    it(`7. check setOperatingStatus() for Contract Owner account`, async function () {

        // Ensure that access is allowed for Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false);
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, false, "Access not restricted to Contract Owner");

    });

    it(`8. check access  operating status is false`, async function () {

        await config.flightSuretyData.setOperatingStatus(false);

        let reverted = false;
        try {
            await config.flightSurety.setTestingMode(true);
        }
        catch (e) {
            reverted = true;
        }
        assert.equal(reverted, true, "Access not blocked for requireIsOperational");

        // Set it back for other tests to work
        await config.flightSuretyData.setOperatingStatus(true);

    });

    /****************************************************************************************/
    /*  Register Airline Functions                                                          */
    /****************************************************************************************/

    it(`9. flightSuretyData has registered firstAirline  when contract is deployed`, async function () {

        // firstAirline isRegistered
        let status = await config.flightSuretyApp.isAirline.call(config.firstAirline);
        assert.equal(status, true, "firstAirline is not registered when contract is deployed");

    });


    it('10. Register second Airline using flightSuretyApp.registerAirline() ', async () => {

        // ARRANGE

        // firstAirline isRegistered
        let status1 = await config.flightSuretyApp.isAirline.call(config.firstAirline);
        assert.equal(status1, true, "firstAirline is not registered when contract is deployed");
        // ACT
        await config.flightSuretyApp.registerAirline(
            config.secondAirline,
            config.seaId,
            config.seaName,
            config.seaCountry,
            { from: config.firstAirline });

        // ASSERT
        let status2 = await config.flightSuretyApp.isAirline.call(config.secondAirline);
        assert.equal(status2, true, "second Airline could not be registered using flightSuretyApp.registerAirline()");

    });

    it('11. Register third Airline using flightSuretyApp.registerAirline() ', async () => {

        // ACT
        await config.flightSuretyApp.registerAirline(
            config.thirdAirline,
            config.thaId,
            config.thaName,
            config.thaCountry,
            { from: config.firstAirline });

        // ASSERT
        let status2 = await config.flightSuretyApp.isAirline.call(config.thirdAirline);
        assert.equal(status2, true, "third Airline could not be registered using flightSuretyApp.registerAirline()");

    });

    it('12. Register fourthAirline Airline using flightSuretyApp.registerAirline() ', async () => {

        // ACT
        await config.flightSuretyApp.registerAirline(
            config.fourthAirline,
            config.thaId,
            config.thaName,
            config.thaCountry,
            { from: config.firstAirline });

        // ASSERT
        let status2 = await config.flightSuretyApp.isAirline.call(config.fourthAirline);
        assert.equal(status2, true, "fourth Airline could not be registered using flightSuretyApp.registerAirline()");

    });


    it(`13. fetch firstAirline  data`, async function () {

        // fetch firstAirline data
        const airlineData = await config.flightSuretyApp.getAirlineData.call(config.firstAirline);
        // Verify the result set
        assert.equal(airlineData[0], config.fiaId, 'Error: Invalid firstAirline id ')
        assert.equal(airlineData[1], config.fiaName, 'Error: Invalid firstAirline name')
        assert.equal(airlineData[2], config.fiaCountry, 'Error: Invalid firstAirline country ')
        assert.equal(airlineData[3], 0, 'Error: Invalid firstAirline funds')
        assert.equal(airlineData[4], true, 'Error: Invalid firstAirline isRegistered ')
        assert.equal(airlineData[5], false, 'Error: Invalid firstAirline isFunded')

    });

    it(`14. fetch secondAirline  data`, async function () {

        // fetch secondAirline data
        const airlineData = await config.flightSuretyApp.getAirlineData.call(config.secondAirline);
        // Verify the result set
        assert.equal(airlineData[0], config.seaId, 'Error: Invalid secondAirline id ')
        assert.equal(airlineData[1], config.seaName, 'Error: Invalid secondAirline name')
        assert.equal(airlineData[2], config.seaCountry, 'Error: Invalid secondAirline country ')
        assert.equal(airlineData[3].toString(), 0, 'Error: Invalid secondAirline funds')
        assert.equal(airlineData[4], true, 'Error: Invalid secondAirline isRegistered ')
        assert.equal(airlineData[5], false, 'Error: Invalid secondAirline isFunded')

    });


    it('15. Register an Airline using registerAirline() for it is not funded ', async () => {

        // ACT
        await config.flightSuretyApp.registerAirline(
            config.fifthAirline,
            config.fifaId,
            config.fifaName,
            config.fifaCountry,
            { from: config.firstAirline });

        // ASSERT
        let status2 = await config.flightSuretyApp.isAirline.call(config.fifthAirline);
        assert.equal(status2, true, "Airline should not be able to register another airline if it hasn't provided funding");

    });

    /****************************************************************************************/
    /*  Register Flight Functions                                                          */
    /****************************************************************************************/

    it('16. Register first Flight using flightSuretyApp.registerFlight() ', async () => {

        // ARRANGE
        const flight = config.fiaId + config.fiaFlightNumber1;
        // firstAirline isRegistered
        let status1 = await config.flightSuretyApp.isAirline.call(config.firstAirline);
        assert.equal(status1, true, "firstAirline is not registered when contract is deployed");
        // ACT
        await config.flightSuretyApp.registerFlight(
            flight,
            config.firstAirline,
            { from: config.owner });
        // ASSERT
        let status3 = await config.flightSuretyApp.isFlightRegistered.call(flight);
        assert.equal(status3, true, "first Flight could not be registered using flightSuretyApp.registerFlight()");

    });

    /****************************************************************************************/
    /*  Send Funds  Functions                                                          */
    /****************************************************************************************/

    it('17. Send funds to first Airline using flightSuretyApp.fund() ', async () => {

        // ARRANGE
        const funds = 10;
        // firstAirline isRegistered
        let status1 = await config.flightSuretyApp.isAirline.call(config.firstAirline);
        assert.equal(status1, true, "firstAirline is not registered when contract is deployed");
        // ACT
        await config.flightSuretyApp.fund({ from: config.firstAirline, value: funds })
        // ASSERT
        // fetch airline data
        const airlineData = await config.flightSuretyApp.getAirlineData.call(config.firstAirline);
        // Verify the result set
        assert.equal(airlineData[3].toString(), funds, 'Error: Invalid funds ')

    });
    it('18. Send funds to second Airline using flightSuretyApp.fund() ', async () => {

        // ARRANGE
        const funds = 10;
        // firstAirline isRegistered
        let status1 = await config.flightSuretyApp.isAirline.call(config.secondAirline);
        assert.equal(status1, true, "secondAirline is not registered ");
        // ACT
        await config.flightSuretyApp.fund({ from: config.secondAirline, value: funds })
        // ASSERT
        // fetch airline data
        const airlineData = await config.flightSuretyApp.getAirlineData.call(config.secondAirline);
        // Verify the result set
        assert.equal(airlineData[3].toString(), funds, 'Error: Invalid funds ')

    });

    it('19. P1 buys insurance for first Airline firstFlight using flightSuretyApp.buy() ', async () => {

        // ARRANGE
        const insurancePrice = 1; // ether
        const insurancePayout = 0; // payout
        const flightDate = new Date().getDate();
        const flight = config.fiaId + config.fiaFlightNumber1;

        // firstAirline isRegistered
        let status1 = await config.flightSuretyApp.isAirline.call(config.firstAirline);
        assert.equal(status1, true, "firstAirline is not registered ");
        // ACT buy insurance
        await config.flightSuretyApp.buy(
            config.passenger1,            // passengerId
            flight,
            flightDate,
            insurancePrice,
            { from: config.owner });
        // ASSERT
        // fetch insurance data
        const insuranceData = await config.flightSuretyApp.getInsuranceData.call(
            config.passenger1,            // passengerId
            flight,
            flightDate,
            { from: config.owner });
        // Verify the result set
        assert.equal(insuranceData[1], true, 'Error: Invalid isIssued ')
        assert.equal(insuranceData[2], false, 'Error: Invalid isPaid ')
        assert.equal(insuranceData[3].toString(), insurancePrice, 'Error: Invalid insurance Price ')
        assert.equal(insuranceData[4].toString(), insurancePayout, 'Error: Invalid insurance Price ')
        // console.log("Passenger 1 insurance key: ", insuranceData[0])
    });

    it('20. P2 buys insurance for first Airline firstFlight using flightSuretyApp.buy() ', async () => {

        // ARRANGE
        const insurancePrice = 1; // ether
        const insurancePayout = 0; // payout
        const flightDate = new Date().getDate();
        const flight = config.fiaId + config.fiaFlightNumber1;

        // firstAirline isRegistered
        let status1 = await config.flightSuretyApp.isAirline.call(config.firstAirline);
        assert.equal(status1, true, "firstAirline is not registered ");
        // ACT buy insurance
        await config.flightSuretyApp.buy(
            config.passenger2,            // passengerId
            flight,
            flightDate,
            insurancePrice,
            { from: config.owner });
        // ASSERT
        // fetch insurance data
        const insuranceData = await config.flightSuretyApp.getInsuranceData.call(
            config.passenger2,            // passengerId
            flight,
            flightDate,
            { from: config.owner });
        // Verify the result set
        assert.equal(insuranceData[1], true, 'Error: Invalid isIssued ')
        assert.equal(insuranceData[2], false, 'Error: Invalid isPaid ')
        assert.equal(insuranceData[3].toString(), insurancePrice, 'Error: Invalid insurance Price ')
        assert.equal(insuranceData[4].toString(), insurancePayout, 'Error: Invalid insurance Price ')
        // console.log("Passenger 1 insurance key: ", insuranceData[0])
    });

});
