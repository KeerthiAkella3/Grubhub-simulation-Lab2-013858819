import React, { Component } from 'react'
import 'filepond/dist/filepond.min.css';
import axios from 'axios';
import { Redirect } from 'react-router'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

class BuyerSignInForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            buyerEmailId: "",
            buyerPassword: "",
            SignedUpFlag: false,
            message: "",
        }

        this.buyerEmailIdChangeHandler = this.buyerEmailIdChangeHandler.bind(this)
        this.buyerPasswordChangeHandler = this.buyerPasswordChangeHandler.bind(this)
        this.submitBuyerLogin = this.submitBuyerLogin.bind(this)
    }

    buyerEmailIdChangeHandler = (e) => {
        this.setState({
            buyerEmailId: e.target.value
        })
    }
    buyerPasswordChangeHandler = (e) => {
        this.setState({
            buyerPassword: e.target.value
        })
    }

    submitBuyerLogin = (e) => {
        console.log("in submit Login")
        e.preventDefault();
        const data = {
            buyerEmailId: this.state.buyerEmailId,
            buyerPassword: this.state.buyerPassword
        }
        console.log("data is..")
        console.log(data);
        axios.defaults.withCredentials = true;
        axios.post('http://18.220.10.109:3001/buyerSignIn', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log("Response from Sign Up " + response);
                console.log(response);
                if (response.data.validUser === true) {
                    this.setState({
                        SignedUpFlag: true,
                        message: "Buyer Logged in successfully"
                    })
                } else {
                    this.setState({
                        SignedUpFlag: false,
                        message: "Invalid Credentials"
                    })
                }
            });
    }

    render() {
        if (this.state.SignedUpFlag === true) {
            return <Redirect to="/BuyerHomePage" />
        }
        return (
            <div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <center>
                    <Card style={{ width: '22rem' }}>
                        <br></br>
                        <h4>Sign in with your Grubhub account</h4>
                        <br></br>
                        <center>
                            <Form style={{ width: '18rem' }}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" required name="buyerEmailId" onChange={this.buyerEmailIdChangeHandler} />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" required name="buyerPassword" onChange={this.buyerPasswordChangeHandler} />
                                </Form.Group>
                                <Form.Text variant="danger">
                                    {this.state.message}
                                </Form.Text>
                                <Button variant="danger" type="submit" onClick={this.submitBuyerLogin}>
                                    Sign in
                                </Button>
                                <br></br>
                            </Form>
                            <br></br>
                        </center>
                    </Card>
                </center>
            </div>
        )
    }
}

export default BuyerSignInForm
