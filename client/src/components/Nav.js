import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Row, Col } from 'reactstrap';

class Nav extends Component {

    render() {

        const { contractApi } = this.props

        return (
            <nav className='nav'>
                <ul>
                    <li className='li'>
                        <NavLink to='/' activeClassName='active'>
                            Airlines
                        </NavLink>
                    </li>
                    <li className='li'>
                        <NavLink to='/addAirline' activeClassName='active'>
                            Add-Airline
                        </NavLink>
                    </li>
                    <li className='li'>
                        <NavLink to='/oracles' activeClassName='active'>
                            Oracles
                        </NavLink>
                    </li>
                    <li className='li'>
                        <NavLink to='/config' activeClassName='active'>
                            <Row>
                                <Col sm="12">
                                    <span>Dapp-isOperational: </span>
                                    {contractApi.isOperational
                                        ? <span className='text-green'>Yes </span>
                                        : <span className='text-red'>No </span>
                                    }
                                </Col>
                            </Row>
                        </NavLink>
                    </li>
                </ul>
            </nav>

        )
    }
}


function mapStateToProps({ airlines, contractApi }) {
    return {
        airlines,
        contractApi
    }
}
export default connect(mapStateToProps)(Nav)