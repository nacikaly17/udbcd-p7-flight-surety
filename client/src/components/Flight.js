import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap';
import TiPlane from 'react-icons/lib/ti/plane'
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom'

class Flight extends Component {

    state = {
        toInsuranceProcedure: false,
        toRegistrationProcedure: false
    }


    handleRegistrationProcedure = (e) => {
        e.preventDefault()

        this.setState(() => ({
            toRegistrationProcedure: true,
        }))

    }


    handleInsuranceProcedure = (e) => {
        e.preventDefault()

        this.setState(() => ({
            toInsuranceProcedure: true,
        }))

    }

    render() {

        const { airline, flight, id } = this.props
        const { toInsuranceProcedure, toRegistrationProcedure } = this.state
        if (flight === null) {
            return <p>This Flight doesn't exist</p>
        }

        const {
            flightNumber,
            flightDate,
            departure,
            arrival,
        } = flight

        // Convert timestamp to string
        var date = new Date(flightDate);
        var dateString = date.toDateString() + '  ' + date.toString().slice(16, 21)


        if (toRegistrationProcedure === true) {
            return <Redirect to={`/registrationProcedure/${id}/${flightNumber}`} />
        }

        if (toInsuranceProcedure === true) {
            return <Redirect to={`/insuranceProcedure/${id}/${flightNumber}`} />
        }

        return (
            <div className='flight-container'>
                <div>
                    <p className="center">{airline.name} : {id}{flightNumber}</p>
                </div>
                <div className='flight'>
                    <div className='flight-info'>
                        <Row>
                            <Col sm="2">
                                <span>{departure} </span>
                            </Col>
                            <Col sm="2">
                                <TiPlane className='flight-icon' />
                            </Col>
                            <Col sm="2">
                                <span>{arrival} </span>
                            </Col>
                            <Col sm="6">
                                <span>{dateString} </span>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className='center'>
                    <p></p>
                    <Row>
                        <Col sm="6">
                            <Button
                                color="primary" size="sm"
                                type="submit"
                                onClick={this.handleRegistrationProcedure}
                            >Flight Registration Procedure</Button>
                            <p></p>
                        </Col>
                        <Col sm="6">
                            <Button
                                color="primary" size="sm"
                                type="submit"
                                onClick={this.handleInsuranceProcedure}
                            >Buy Flight Insurance</Button>
                            <p></p>
                        </Col>
                    </Row>
                    <p></p>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ airlines }, { id, flightNumber }) {
    const airline = airlines[id]
    const flight = airline.flights[flightNumber]
    return {
        id,
        airline,
        flight
    }
}
export default connect(mapStateToProps)(Flight)