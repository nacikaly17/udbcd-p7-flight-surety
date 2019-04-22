import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Button } from 'reactstrap';
import { handleAddAirline } from '../actions/airlines'
import { Redirect } from 'react-router-dom'
import { Row, Col } from 'reactstrap';

class AddAirline extends Component {


    state = {
        id: '',
        name: '',
        country: '',
        address: '',
        toHome: false,
    }
    handleChangeId = (e) => {
        const id = e.target.value
        this.setState(() => ({
            id
        }))
    }
    handleChangeName = (e) => {
        const name = e.target.value
        this.setState(() => ({
            name
        }))
    }
    handleChangeCountry = (e) => {
        const country = e.target.value
        this.setState(() => ({
            country
        }))
    }
    handleChangeAddress = (e) => {
        const address = e.target.value
        this.setState(() => ({
            address
        }))
    }
    handleSubmit = (e) => {
        e.preventDefault()

        const { id, name, country, address } = this.state
        const { dispatch } = this.props

        dispatch(handleAddAirline(id.trim(), name.trim(), country.trim(), address.trim()))

        this.setState(() => ({
            id: '',
            name: '',
            country: '',
            address: '',
            toHome: true,
        }))
    }


    render() {

        const { id, name, country, address, toHome } = this.state

        if (toHome === true) {
            return <Redirect to='/' />
        }
        return (
            <div >
                <h3 className="center">Add-Airline</h3>
                <Row>
                    <Col sm="12">
                        <div className='airline-container'>
                            <div>
                                <p className="center">Fill  Data</p>
                            </div>
                            <div className='airline'>
                                <div className='airline-info'>
                                    <form>
                                        <Row>
                                            <Col sm="2">
                                                <label>Id</label>
                                            </Col>
                                            <Col sm="10">
                                                <input
                                                    type="id-text"
                                                    value={id}
                                                    placeholder="AA"
                                                    onChange={this.handleChangeId} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="2">
                                                <label>Name</label>
                                            </Col>
                                            <Col sm="10">
                                                <input
                                                    type="text"
                                                    value={name}
                                                    placeholder="American Airlines"
                                                    onChange={this.handleChangeName} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="2">
                                                <label>Country</label>
                                            </Col>
                                            <Col sm="10">
                                                <input
                                                    type="text"
                                                    value={country}
                                                    placeholder="USA"
                                                    onChange={this.handleChangeCountry} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="2">
                                                <label>Address</label>
                                            </Col>
                                            <Col sm="10">
                                                <Input type="textarea"
                                                    name="address"
                                                    id="address"
                                                    value={address}
                                                    onChange={this.handleChangeAddress}
                                                    className='textarea'
                                                    maxLength={82}
                                                    placeholder="0xE40Fd2593901a0cBdeDF60038d759e1b3CCADd08"
                                                />
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
                                                        disabled={id === '' || name === '' || country === '' || address === ''}
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

export default connect()(AddAirline)