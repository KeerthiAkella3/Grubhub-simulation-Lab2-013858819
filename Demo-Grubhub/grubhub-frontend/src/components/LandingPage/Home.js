import React, { Component } from 'react'
import 'react-splitter-layout/lib/index.css';
import GettingStarted from './GettingStarted'
import {Container, Row, Col} from 'reactstrap'

class Home extends Component {
    render() {
        return (
            <div>
                <h1>Home</h1>
                <Container>
                <Row>
                    <Col xs={5}><a href="/BuyerProfilePage" className="c-button">Buyer Update page</a></Col>
                    <br/>
                    <Col xs={5}><a href="/OwnerUpdate" className="c-button">Owner update page</a></Col>
                    <a href="/BuyerPicture" className="c-button">Buyer Picture Update page</a>
                    <a href="/OwnerPicture" className="c-button">Owner Picture Update page</a>
                </Row>
            </Container>
            </div>
        )
    }
}

export default Home
