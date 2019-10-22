import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'

class GettingStarted extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <Container style={{
                maxWidth: "100%",
                width: "100%",
                height: "100%",
                alignItems: "center"
            }}>
                <Row style={{
                    paddingTop: '150px',
                    paddingBottom: '250px'
                }}>
                    <Col xs={5}><a href="/BuyerSignUp" style={{
                        fontWeight: '500',
                        fontSize: '25px',
                        color: "red",
                    }}>Buyer Sign Up</a></Col>
                    <Col xs={5}><a href="/BuyerSignIn" style={{
                        fontWeight: '500',
                        fontSize: '25px',   
                    }}>Buyer Sign In</a></Col>
                </Row>
                <Row style={{
                    marginTop: '15px',
                    marginBotton: '15px'
                }}>
                    <Col xs={5}><a href="/OwnerSignUp" style={{
                        fontWeight: '500',
                        fontSize: '25px',
                        color: "red",
                    }}>Owner Sign Up</a></Col>
                    <Col xs={5}><a href="/OwnerSignIn" style={{
                        fontWeight: '500',
                        fontSize: '25px',
                    }}>Owner Sign In</a></Col>
                </Row>
            </Container>
        )
    }
}

export default GettingStarted
