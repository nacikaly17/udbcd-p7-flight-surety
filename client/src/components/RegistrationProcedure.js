import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom'
import InsuranceDetail from './InsuranceDetail'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { handleUpdateAirline } from '../actions/airlines'
import { handleUpdateFlight } from '../actions/airlines'

class RegistrationProcedure extends Component {

    state = {
        fundsTosend: 10,
        toHome: false,
        activeTab: '1',
        isFetched: true,
        isFetchedFlight: false,
    }

    toggle(tab) {

        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    readAirlineData() {

        const { airline, dispatch, contractApi } = this.props
        if (contractApi.contract !== null) {
            contractApi.contract.getAirlineData(
                airline.address,
                (error, result1) => {
                    if (!error) {
                        //console.log(result1)
                        // update redux
                        airline.id = result1[0]
                        airline.name = result1[1]
                        airline.country = result1[2]
                        airline.funds = result1[3]
                        airline.isRegistered = result1[4]
                        airline.isFunded = result1[5]
                        airline.isFetched = true
                        dispatch(handleUpdateAirline(airline))
                    }
                });
        }
        this.setState(() => ({
            isFetched: true
        }))
    }

    readFlightData() {
        const { id, dispatch, contractApi, flightNumber, flight } = this.props
        const _flightNo = id + flightNumber
        if (contractApi.contract !== null) {
            contractApi.contract.getFlightData(
                _flightNo,
                (error, result1) => {
                    if (!error) {
                        //console.log(result1)
                        // update redux
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

    handleChangeFundsTosend = (e) => {
        const fundsTosend = e.target.value
        this.setState(() => ({
            fundsTosend
        }))
    }

    handleRegisterAirline = (e) => {
        e.preventDefault()

        const { contractApi, dispatch, airline } = this.props

        if (contractApi.contract !== null) {
            contractApi.contract.registerAirline(
                airline.address,
                airline.id,
                airline.name,
                airline.country
                , (error, result1) => {
                    if (error) {
                        console.log(error, result1);
                        alert(error)
                    } else {
                        airline.isRegistered = true
                        //alert(JSON.stringify(airline))
                        dispatch(handleUpdateAirline(airline))
                    }
                });
        }
    }

    handleRegisterFlight = (e) => {
        e.preventDefault()


        const { contractApi, dispatch, airline, id, flight, flightNumber } = this.props
        const _flightNo = id + flightNumber
        if (contractApi.contract !== null) {
            contractApi.contract.registerFlight(
                _flightNo,
                airline.address
                , (error, result1) => {
                    if (error) {
                        console.log(error, result1);
                        alert(error)
                    } else {
                        flight.isRegisteredFlight = true
                        dispatch(handleUpdateFlight(id, flight))
                    }
                });
        }
    }

    handleSendFunds = (e) => {
        e.preventDefault()

        const { contractApi, dispatch, airline } = this.props

        if (contractApi.contract !== null) {
            contractApi.contract.fund(
                airline.address,
                this.state.fundsTosend
                , (error, result1) => {
                    if (error) {
                        console.log(error, result1);
                        alert(error)
                    } else {
                        airline.isFunded = true
                        airline.isFetched = false
                        dispatch(handleUpdateAirline(airline))
                        this.setState(() => ({
                            isFetched: false
                        }))
                    }
                });
        }
    }

    render() {

        const { id, flightNumber, airline, flight } = this.props

        const { toHome,
            fundsTosend,
            isFetched,
            isFetchedFlight } = this.state

        const {
            isRegistered,
            address,
        } = airline


        if (!isFetched) {
            // read airline data from contract
            this.readAirlineData()
        }

        if (!isFetchedFlight) {
            // read flight data from contract
            this.readFlightData()
        }

        if (toHome === true) {
            return <Redirect to={`/airlines/${id}`} />
        }

        return (
            <div className="container">
                <h3 className="center">Register</h3>
                <InsuranceDetail id={id} flightNumber={flightNumber} />
                <div>
                    <Row>
                        <Col sm="6">
                            <h4>Flight Registration Procedure:</h4>
                        </Col>
                        <Col sm="6">
                            <Button
                                color="primary" size="sm"
                                type="submit"
                                onClick={() => this.setState(() => ({
                                    toHome: true,
                                }))}
                            >Back</Button>
                        </Col>
                    </Row>
                </div>
                <div className="procedure-container">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}>1. Register Airline</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}>2. Send-Funds</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => { this.toggle('3'); }}>3. Register Flight</NavLink>
                        </NavItem>
                    </Nav>
                    <div className="procedure-info">
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <div >
                                    <Row>
                                        <Col sm="12">
                                            <p>Register Airline</p>
                                        </Col>
                                        <Col sm="2">
                                            <p>Address:</p>
                                        </Col>
                                        <Col sm="10">
                                            <p>{address} </p>
                                        </Col>
                                    </Row>
                                    <Button
                                        color="primary" size="sm"
                                        type="submit"
                                        onClick={this.handleRegisterAirline}
                                        disabled={isRegistered === true}
                                    >Register Airline</Button>
                                </div>
                            </TabPane>
                            <TabPane tabId="2">
                                <div className='container'>
                                    <form>
                                        <Row>
                                            <Col sm="4">
                                                <label>Funds to send ( requirement is 10 ether ):</label>
                                            </Col>
                                            <Col sm="8">
                                                <input
                                                    type="id-text"
                                                    value={fundsTosend}
                                                    placeholder="1"
                                                    onChange={this.handleChangeFundsTosend} />
                                            </Col>
                                        </Row>
                                        <Button
                                            color="primary" size="sm"
                                            type="submit"
                                            onClick={this.handleSendFunds}
                                        >SendFunds</Button>
                                    </form>
                                </div>
                            </TabPane>
                            <TabPane tabId="3">
                                <div >
                                    <Row>
                                        <Col sm="12">
                                            <p>Register a future flight for insuring.</p>
                                        </Col>
                                        <Col sm="2">
                                            <p>Flightnumber:</p>
                                        </Col>
                                        <Col sm="10">
                                            <p>{id}{flightNumber} </p>
                                        </Col>
                                    </Row>
                                    <Button
                                        color="primary" size="sm"
                                        type="submit"
                                        onClick={this.handleRegisterFlight}
                                        disabled={flight.isRegisteredFlight === true}
                                    >Register Flight</Button>
                                </div>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps({ airlines, contractApi }, props) {
    const { id, flightNumber } = props.match.params
    const airline = airlines[id]
    const flight = airline.flights[flightNumber]
    return {
        id,
        flightNumber,
        airline,
        flight,
        contractApi
    }
}
export default connect(mapStateToProps)(RegistrationProcedure)