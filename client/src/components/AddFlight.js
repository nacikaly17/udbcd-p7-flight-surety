import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap';
import { handleAddFlight } from '../actions/airlines'
import { Redirect } from 'react-router-dom'
import { Row, Col } from 'reactstrap';

class AddFlight extends Component {


    state = {
        flightNumber: '',
        departure: '',
        arrival: '',
        flightDate: '',
        toHome: false,
    }

    handleChangeFlightNumber = (e) => {
        const flightNumber = e.target.value
        this.setState(() => ({
            flightNumber
        }))
    }
    handleChangeDeparture = (e) => {
        const departure = e.target.value
        this.setState(() => ({
            departure
        }))
    }
    handleChangeArrival = (e) => {
        const arrival = e.target.value
        this.setState(() => ({
            arrival
        }))
    }
    handleChangeTimestamp = (e) => {

    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { flightNumber, departure, arrival } = this.state
        const { dispatch, id } = this.props
        const flightDate = Date.now()
        dispatch(handleAddFlight(
            id,
            flightNumber.trim(),
            departure.trim(),
            arrival.trim(),
            flightDate))

        this.setState(() => ({
            flightNumber: '',
            departure: '',
            arrival: '',
            flightDate: '',
            toHome: true,
        }))
    }


    render() {
        const { airline } = this.props

        const {
            id,
            name,
            country,
        } = airline

        const { flightNumber, departure, arrival, toHome } = this.state

        if (toHome === true) {
            return <Redirect to={`/airlines/${id}`} />
        }
        return (
            <div >
                <h3 className="center">Add new Flight</h3>
                <Row>
                    <Col sm="12">
                        <div className='airline-container'>
                            <div>
                                <p className="center">{id} : {name} ({country})</p>
                            </div>
                            <div className='airline'>
                                <div className='airline-info'>
                                    <form>
                                        <Row>
                                            <Col sm="4">
                                                <label>Flight Number</label>
                                            </Col>
                                            <Col sm="8">
                                                <input
                                                    type="id-text"
                                                    value={flightNumber}
                                                    placeholder="333"
                                                    onChange={this.handleChangeFlightNumber} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="4">
                                                <label>Departure</label>
                                            </Col>
                                            <Col sm="8">
                                                <input
                                                    type="text"
                                                    value={departure}
                                                    placeholder="FRA"
                                                    onChange={this.handleChangeDeparture} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="4">
                                                <label>Arrival</label>
                                            </Col>
                                            <Col sm="8">
                                                <input
                                                    type="text"
                                                    value={arrival}
                                                    placeholder="LHR"
                                                    onChange={this.handleChangeArrival} />
                                            </Col>
                                        </Row>
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
                                                        onClick={this.handleSubmit}
                                                        disabled={flightNumber === '' || departure === '' || arrival === ''}
                                                    >Submit</Button>
                                                </Col>
                                            </Row>
                                        </div>

                                    </form>
                                </div>
                            </div>

                        </div>

                    </Col>
                </Row>
            </div>

        )
    }
}

function mapStateToProps({ airlines }, props) {
    const { id } = props.match.params
    const airline = airlines[id]
    return {
        id,
        airline,
    }
}

export default connect(mapStateToProps)(AddFlight)