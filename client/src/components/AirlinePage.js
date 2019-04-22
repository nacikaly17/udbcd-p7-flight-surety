import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import Flight from './Flight'
import { Redirect } from 'react-router-dom'

class AirlinePage extends Component {

    state = {
        toAddFlight: false,
        toHome: false,
    }

    handleAddFlight = (e) => {
        e.preventDefault()

        this.setState(() => ({
            toAddFlight: true,
        }))

    }


    render() {

        const { airline } = this.props

        if (airline === null) {
            return <p>This Airline doesn't exist</p>
        }

        const {
            id,
            name,
            country,
            isRegistered,
            isFunded,
            funds,
            address,
        } = airline

        const flightNumbers = Object.keys(airline.flights)

        const { toAddFlight, toHome } = this.state

        if (toHome === true) {
            return <Redirect to='/' />
        }

        if (toAddFlight === true) {
            return <Redirect to={`/addFlight/airlines/${id}`} />
        }

        return (
            <div >
                <h3 className="center">Airline</h3>
                <Row>
                    <Col sm="12">
                        <div className='airline-container'>
                            <div>
                                <p className="center">{id} : {name} ({country})</p>
                            </div>
                            <div className='airline'>
                                <div className='airline-info'>
                                    <Row>
                                        <Col sm="3">
                                            <span>Address : </span>
                                        </Col>
                                        <Col sm="9">
                                            <span>{address} </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="3">
                                            <span>Registered : </span>
                                        </Col>
                                        <Col sm="9">
                                            {isRegistered
                                                ? <span className='text-green'> Yes </span>
                                                : <span> No </span>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="3">
                                            <span>Funded : </span>
                                        </Col>
                                        <Col sm="9">
                                            {isFunded
                                                ? <span className='text-green'> Yes </span>
                                                : <span> No </span>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="3">
                                            <span>Funds: </span>
                                        </Col>
                                        <Col sm="3">
                                            <span>{funds} </span>
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
                                            onClick={() => this.setState(() => ({
                                                toHome: true,
                                            }))}
                                        >Back</Button>
                                    </Col>
                                    <Col sm="6">
                                        <Button
                                            color="primary" size="sm"
                                            type="submit"
                                            onClick={this.handleAddFlight}
                                        >Add Flight</Button>
                                    </Col>
                                </Row>
                                <p></p>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div >
                    <h3 className="center">Flights</h3>
                    <Row>
                        <Col sm="12">
                            <ul >
                                {flightNumbers.map((flightNumber) => (
                                    <li key={flightNumber}>
                                        <Flight id={id} flightNumber={flightNumber} />
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ airlines }, props) {
    const { id } = props.match.params
    const airline = airlines[id]
    return {
        airline,
    }
}

export default connect(mapStateToProps)(AirlinePage)