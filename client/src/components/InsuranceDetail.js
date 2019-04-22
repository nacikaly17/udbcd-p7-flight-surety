import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap';
import TiPlane from 'react-icons/lib/ti/plane'
import {getStatusText} from '../utils/helpers'

class InsuranceDetail extends Component {

    render() {

        const { id, flightNumber, airline, flight } = this.props

        const {
            name,
            country,
            isRegistered,
            isFunded,
            funds,
        } = airline

        const {
            flightDate,
            departure,
            arrival,
            isRegisteredFlight,
            flightStatus,
        } = flight

        let flightStatusText = getStatusText(flightStatus);

        // Convert timestamp to string
        var date = new Date(flightDate);
        var dateString = date.toDateString() + '  ' + date.toString().slice(16, 21)

        return (
            <div >
                <Row>
                    <Col sm="12">
                        <div className='airline-container'>
                            <div>
                                <p className="center">{id} : {name} ({country})</p>
                            </div>
                            <div className='airline'>
                                <div className='airline-info'>
                                    <Row>
                                        <Col sm="5">
                                            <span>Airline Registered : </span>
                                        </Col>
                                        <Col sm="7">
                                            {isRegistered
                                                ? <span className='text-green'> Yes </span>
                                                : <span> No </span>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="5">
                                            <span>Funded : </span>
                                        </Col>
                                        <Col sm="7">
                                            {isFunded
                                                ? <span className='text-green'> Yes </span>
                                                : <span> No </span>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="5">
                                            <span>Funds (ether): </span>
                                        </Col>
                                        <Col sm="7">
                                            {funds > 0
                                                ? <span className='text-green'>{funds} </span>
                                                : <span >{funds} </span>
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="5">
                                            <span>Flight: </span>
                                        </Col>
                                        <Col sm="7">
                                            <span>{id}{flightNumber} </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="3">
                                            <span>From / To : </span>
                                        </Col>
                                        <Col sm="3">
                                            <span>{departure} </span>
                                        </Col>
                                        <Col sm="3">
                                            <TiPlane className='flight-icon' />
                                        </Col>
                                        <Col sm="3">
                                            <span>{arrival} </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="5">
                                            <span>Flight Date:  </span>
                                        </Col>
                                        <Col sm="7">
                                            <span>{dateString} </span>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col sm="5">
                                            <span>Flight Registered : </span>
                                        </Col>
                                        <Col sm="7">
                                            {isRegisteredFlight
                                                ? <span className='text-green'> Yes </span>
                                                : <span> No </span>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="5">
                                            <span>Flight Status</span>
                                        </Col>
                                        <Col sm="7">
                                            <p>{flightStatusText}</p>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}


function mapStateToProps({ airlines }, { id, flightNumber }) {
    const airline = airlines[id]
    const flight = airline.flights[flightNumber]
    return {
        id,
        flightNumber,
        airline,
        flight
    }
}
export default connect(mapStateToProps)(InsuranceDetail)