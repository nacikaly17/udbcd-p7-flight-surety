import FlightSuretyApp from '../contracts/FlightSuretyApp.json';
import FlightSuretyData from '../contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.appAddress = config.appAddress;
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
        this.accounts = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {

            this.owner = accts[0];

            //let counter = 1;
            let counter = 0;
            while (this.airlines.length <= 5) {
                this.airlines.push(accts[counter++]);
            }

            while (this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            counter = 0;
            while (this.accounts.length <= 20) {
                this.accounts.push(accts[counter++]);
            }

            callback();
        });
    }

    authorizeCaller(callback) {
        let self = this;
        self.flightSuretyData.methods
            .authorizeCaller(self.appAddress)
            .send({
                from: self.owner
            }, callback);
    }

    getOwner() {
        return this.owner
    }

    getAccounts() {
        return this.accounts
    }

    getAirlineAdresses() {
        return this.airlines
    }

    getPassengerAdresses() {
        return this.passengers
    }

    isOperational(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner }, callback);
    }

    setOperatingStatus(mode, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .setOperatingStatus(mode)
            .send({ from: self.owner }, callback);
    }

    registerAirline(address, id, name, country, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .registerAirline(address, id, name, country)
            .send({
                "gas": 4712388,
                "gasPrice": 100000000000,
                from: self.owner
            }, callback);
    }

    getAirlineData(address, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .getAirlineData(address)
            .call({ from: self.owner }, callback);
    }

    fund(address, amount, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .fund()
            .send({
                "gas": 4712388,
                "gasPrice": 100000000000,
                from: address,
                value: amount
            }, callback);
    }

    registerFlight(flightNumber, address, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .registerFlight(flightNumber, address)
            .send({
                "gas": 4712388,
                "gasPrice": 100000000000,
                from: self.owner
            }, callback);
    }

    getFlightData(flightNumber, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .getFlightData(flightNumber)
            .call({ from: self.owner }, callback);
    }

    buy(passengerId, flightNumber, flightDate, insurancePrice, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .buy(passengerId, flightNumber, flightDate, insurancePrice)
            .send({
                "gas": 4712388,
                "gasPrice": 100000000000,
                from: self.owner
            }, callback);
    }

    getInsuranceData(passengerId, flightNumber, flightDate, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .getInsuranceData(passengerId, flightNumber, flightDate)
            .call({ from: self.owner }, callback);
    }

    getRegistrationFee(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .REGISTRATION_FEE()
            .call({ from: self.owner }, callback);
    }

    registerOracle(address, fee, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .registerOracle()
            .send({
                "gas": 4712388,
                "gasPrice": 100000000000,
                from: address,
                value: fee
            }, callback);
    }

    submitOracleResponse(index, airline, flight, timestamp, statusCode, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .submitOracleResponse(index, airline, flight, timestamp, statusCode)
            .send({
                "gas": 4712388,
                "gasPrice": 100000000000,
                from: self.owner
            }, callback);
    }

    getMyIndexes(address, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .getMyIndexes()
            .call({
                from: address
            }, callback);
    }

    fetchFlightStatus(airline, flightNo, timestamp, callback) {
        let self = this;
        let payload = {
            airline: airline,
            flight: flightNo,
            timestamp: timestamp
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner }, (error, result) => {
                callback(error, payload);
            });
    }
    /*
    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner }, (error, result) => {
                callback(error, payload);
            });
    }
    */
}