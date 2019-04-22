import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom'

class NotFound extends Component {

    render() {

        return (
            <div>
                <h2 className="center">Page not found : 404</h2>
                <p>No match found for <code>{this.props.location.pathname}</code></p>
                <p>The page you were looking for was moved or doesn't exist.</p>
                <div>
                    <Link to={`/`}>
                        <Button color="primary" size="sm" >Back to Home</Button>
                    </Link>
                </div>
            </div>
        )
    }
}


export default connect()(NotFound)