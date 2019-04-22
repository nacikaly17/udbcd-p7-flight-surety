import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Button } from 'reactstrap';
import { Redirect } from 'react-router-dom'
import InsuranceDetail from './InsuranceDetail'
import { Row, Col } from 'reactstrap';
import { handleUpdateFlight } from '../actions/airlines'
import StatusCodes from '../utils/StatusCodes'

class InsuranceProcedure extends Component {

    state = {
        toHome: false,
        isFetchedFlight: false,
        isFetchedInsuranceData: true,
        // insurance
        passengerAddress: null,
        isIssued: false,
        isPaid: false,
        insurancePrice: 1,
        insurancePayout: 0,
    }

    readFlightData() {
        const { id, dispatch, contractApi, flightNumber, flight } = this.props
        const _flightNo = id + flightNumber
        if (contractApi.contract !== null) {
            contractApi.contract.getFlightData(
                _flightNo,
                (error, result1) => {
                    if (!error) {
                        flight.isRegisteredFlight = result1[0]
                        flight.flightStatus = result1[1]
                        dispatch(handleUpdateFlight(id, flight))
                    }
                });
        }
        this.setState(() => ({
            isFetchedFlight: true
        }))
    }

    readInsuranceData() {
        const { id, contractApi, flightNumber, flight } = this.props
        const { passengerAddress } = this.state
        const _flightNo = id + flightNumber
        if (contractApi.contract !== null) {
            contractApi.contract.getInsuranceData(
                passengerAddress,
                _flightNo,
                flight.flightDate,
                (error, result1) => {
                    if (!error) {
                        flight.isRegisteredFlight = result1[0]
                        flight.flightStatus = result1[1]
                        this.setState(() => ({
                            isFetchedInsuranceData: true,
                            isIssued: result1[1],
                            isPaid: result1[2],
                            insurancePrice: result1[3],
                            insurancePayout: result1[4],
                        }))
                    } else {
                        console.log(error)
                    }
                });
        }
    }

    handleChangeInsurancePrice = (e) => {
        const insurancePrice = e.target.value
        this.setState(() => ({
            insurancePrice
        }))
    }

    handleChangePassengerAddress = (e) => {
        const passengerAddress = e.target.value
        this.setState(() => ({
            passengerAddress
        }))
    }

    handleBuyInsurance() {

        const { contractApi, id, flight, flightNumber } = this.props
        const { insurancePrice, passengerAddress } = this.state
        const _flightNo = id + flightNumber

        if (contractApi.contract !== null) {
            contractApi.contract.buy(
                passengerAddress,
                _flightNo,
                flight.flightDate,
                insurancePrice
                , (error, result1) => {
                    if (error) {
                        console.log(error, result1);
                        alert(error)
                    } else {
                        this.setState(() => ({
                            isIssued: false,
                            isPaid: false,
                            insurancePrice: 0,
                            insurancePayout: 0,
                            isFetchedInsuranceData: false,
                        }))
                    }
                });
        }
    }

    handleFlightStatus() {

        // Submit a request for oracles to get status information for a flight
        // await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight, timestamp);

        const {
            id,
            flightNumber,
            airline,
            flight, contractApi } = this.props

        const _flightNo = id + flightNumber
        const timestamp = flight.flightDate
        const { registeredOracles, TEST_ORACLES_COUNT } = contractApi

        contractApi.contract.fetchFlightStatus(
            airline.address,
            _flightNo,
            timestamp,
            (error, payload) => {
                if (error) {
                    console.log(error, payload);
                } else {
                    // Since the Index assigned to each test account is opaque by design
                    // loop through all the accounts and for each account, all its Indexes (indices?)
                    // and submit a response. The contract will reject a submission if it was
                    // not requested so while sub-optimal, it's a good test of that feature
                    for (let a = 1; a <= TEST_ORACLES_COUNT; a++) {

                        // Get oracle information
                        let oracleAccount = registeredOracles[a - 1];

                        for (let idx = 0; idx < 3; idx++) {
                            let oracleIndex = oracleAccount.result0;
                            if (idx === 1)
                                oracleIndex = oracleAccount.result1;
                            if (idx === 2)
                                oracleIndex = oracleAccount.result2;
                            console.log(" index : ", idx, oracleIndex, _flightNo, StatusCodes.STATUS_CODE_LATE_AIRLINE)
                            contractApi.contract.submitOracleResponse(
                                oracleIndex,
                                airline.address,
                                _flightNo,
                                timestamp,
                                StatusCodes.STATUS_CODE_UNKNOWN,
                                (error, result) => {
                                    if (error) {
                                        console.log(error, result);
                                    } else {
                                        if (idx === 2) {
                                            this.setState(() => ({
                                                isFetchedFlight: false
                                            }))
                                        }
                                    }
                                });
                        }
                    }
                }
            });
    }

    handleInsurancePayout() {

        alert("handleInsurancePayout")
    }

    setPassengerAddressInitial() {
        const { passengers } = this.props
        this.setState(() => ({
            passengerAddress: passengers['P1'].address,
            isFetchedInsuranceData: false,
        }))
    }
    render() {

        const { id, flightNumber, flight } = this.props
        const { toHome,
            isFetchedFlight,
            isFetchedInsuranceData,
            isIssued,
            isPaid,
            insurancePrice,
            insurancePayout,
            passengerAddress } = this.state

        if (!isFetchedFlight && !flight.isRegisteredFlight) {
            // read airline data from contract
            this.readFlightData()
        }


        if (!isFetchedInsuranceData) {
            // read insurance data from contract
            this.readInsuranceData()
        }

        if (passengerAddress === null) {
            this.setPassengerAddressInitial();
        }

        if (toHome === true) {
            return <Redirect to={`/airlines/${id}`} />
        }

        return (
            <div className="container">
                <h3 className="center">Buy Flight Insurance</h3>
                <InsuranceDetail id={id} flightNumber={flightNumber} />
                <div className='center'>
                    <Row>
                        <Col sm="4">
                            <Button
                                color="primary" size="sm"
                                type="submit"
                                onClick={() => { this.handleBuyInsurance(); }}
                                disabled={isIssued === true}
                            >Buy-Insurance</Button>
                        </Col>
                        <Col sm="4">
                            <Button
                                color="primary" size="sm"
                                type="submit"
                                onClick={() => { this.handleFlightStatus(); }}
                            >Read-Flight-Status</Button>
                        </Col>
                        <Col sm="4">
                            <Button
                                color="primary" size="sm"
                                type="submit"
                                onClick={() => { this.handleInsurancePayout(); }}
                                disabled={isPaid === false || insurancePayout === 0}
                            >Payout</Button>
                        </Col>
                    </Row>
                </div>
                <div className="procedure-container">
                    <div className="procedure-info">
                        <div className='container'>
                            <Row>
                                <Col sm="4">
                                    <label>Passenger</label>
                                </Col>
                                <Col sm="8">
                                    <Input type="textarea"
                                        name="address"
                                        id="address"
                                        value={passengerAddress}
                                        onChange={this.handleChangePassengerAddress}
                                        className='textarea'
                                        maxLength={82}
                                    />
                                </Col>
                            </Row>
                            <p></p>
                            <Row>
                                <Col sm="4">
                                    <label>Insurance-Price:</label>
                                </Col>
                                <Col sm="8">
                                    <input
                                        type="id-text"
                                        value={insurancePrice}
                                        placeholder="1"
                                        onChange={this.handleChangeInsurancePrice} />
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4">
                                    <label>Issued:</label>
                                </Col>
                                <Col sm="8">
                                    {isIssued
                                        ? <span className='text-green'> Yes </span>
                                        : <span> No </span>}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4">
                                    <label>Paid:</label>
                                </Col>
                                <Col sm="8">
                                    {isPaid
                                        ? <span className='text-green'> Yes </span>
                                        : <span> No </span>}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4">
                                    <label>Insurance-Payout:</label>
                                </Col>
                                <Col sm="8">
                                    <label>{insurancePayout}</label>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="center">
                    <Button
                        color="primary" size="sm"
                        type="submit"
                        onClick={() => this.setState(() => ({
                            toHome: true,
                        }))}
                    >Back</Button>
                </div>

            </div>
        )
    }
}


function mapStateToProps({ airlines, contractApi, passengers }, props) {
    const { id, flightNumber } = props.match.params
    const airline = airlines[id]
    const flight = airline.flights[flightNumber]
    return {
        id,
        flightNumber,
        airline,
        flight,
        contractApi,
        passengers,
        passengerIds: Object.keys(passengers)
    }
}
export default connect(mapStateToProps)(InsuranceProcedure)