import React, { Component } from 'react'
import 'filepond/dist/filepond.min.css';
import axios from 'axios';
import { Redirect } from 'react-router'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

class BuyerProfileForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            buyerName: "",
            buyerEmailId: "",
            buyerPassword: "",
            buyerPhone: "",
            buyerAddress: "",
            finishedSignUp: false,
            message: ""
        }

        this.buyerNameChangeHandler = this.buyerNameChangeHandler.bind(this)
        this.emailIdChangeHandler = this.emailIdChangeHandler.bind(this)
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
        this.phoneNumberChangeHandler = this.phoneNumberChangeHandler.bind(this)
        this.submitBuyerSignUp = this.submitBuyerSignUp.bind(this)
        this.addressChangeHandler = this.addressChangeHandler.bind(this)
    }
    buyerNameChangeHandler = (e) => {
        this.setState({
            buyerName: e.target.value
        })
    }
    emailIdChangeHandler = (e) => {
        this.setState({
            buyerEmailId: e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            buyerPassword: e.target.value
        })
    }

    phoneNumberChangeHandler = (e) => {
        this.setState({
            buyerPhone: e.target.value
        })
    }

    addressChangeHandler = (e) => {
        this.setState({
            buyerAddress: e.target.value
        })
    }

    submitBuyerSignUp = (e) => {
        //console.log("in submit ")
        e.preventDefault();
        console.log(this.state.message)
        const data = {
            buyerName: this.state.buyerName,
            buyerEmailId: this.state.buyerEmailId,
            buyerPassword: this.state.buyerPassword,
            buyerPhone: this.state.buyerPhone.substring(1, 4),
            buyerAddress: this.state.buyerAddress,
        }

        console.log("data is..")
        console.log(data);

        this.setState({
            message: "Buyer already exists"
        })

        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/buyerSignup', data)
            .then(response => {
                console.log("frontend")
                //console.log("Status Code : ", response.status);
                console.log("Response from Sign Up " + response);
                console.log(response);
                //console.log(response.message)
                if (response.data.responseMessage === "Successfully Added!") {
                    this.setState({
                        finishedSignUp: true,
                        message: "Buyer signed up successfully"
                    })
                } else {
                    this.setState({
                        finishedSignUp: false,
                        message: "Buyer already exists"
                    })
                }
            });
    }

    render() {
        var nextpage = null
        if (this.state.finishedSignUp === true) {
            nextpage = <Redirect to="/BuyerSignIn" />
        }
        return (
            <div>
                {nextpage}

                <center>
                    <br></br>
                    <Card style={{ width: '22rem' }} >
                        <br></br>
                        <h3>Create your account</h3>
                        <br></br>
                        <center>
                            <Form style={{ width: '18rem' }}>
                                <Form.Group controlId="formGridName" >
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control placeholder="Ryan Gosling" required type="text" name="buyerName" onChange={this.buyerNameChangeHandler} />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control required type="email" placeholder="Enter email" name="buyerEmailId" onChange={this.emailIdChangeHandler} />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" required placeholder="Password" required name="buyerPassword" onChange={this.passwordChangeHandler} />
                                </Form.Group>
                                <Form.Group controlId="formGridPhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control required placeholder="### ### ####" input type="text" name="buyerPhone" maxLength="15" onChange={this.phoneNumberChangeHandler} />
                                </Form.Group>
                                <Form.Group controlId="formGridAddress1">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control placeholder="1234 Main St, city, state" required input type="text" name="address" onChange={this.addressChangeHandler} />
                                </Form.Group>
                                <Button variant="primary" type="submit" onClick={this.submitBuyerSignUp}>
                                    Create your account
                    </Button>

                            </Form>
                            <br></br>
                        </center>
                    </Card>
                </center>
            </div>
        )
    }
}

export default BuyerProfileForm