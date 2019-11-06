import React, { Component } from 'react'
import 'filepond/dist/filepond.min.css';
import axios from 'axios';
import { Redirect } from 'react-router'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

class OwnerProfileForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            restaurantEmailId: "",
            restaurantPassword: "",
            restaurantName: "",
            restaurantPhone: "",
            restaurantCuisine: "",
            restaurantAddress: "",
            finishedSignUp: false,
            message: ""
        }

        this.restaurantEmailIdChangeHandler = this.restaurantEmailIdChangeHandler.bind(this)
        this.restaurantPasswordChangeHandler = this.restaurantPasswordChangeHandler.bind(this)
        this.restaurantNameChangeHandler = this.restaurantNameChangeHandler.bind(this)
        this.restaurantPhoneChangeHandler = this.restaurantPhoneChangeHandler.bind(this)
        this.restaurantAddressChangeHandler = this.restaurantAddressChangeHandler.bind(this)
        this.restaurantCuisineChangeHandler = this.restaurantCuisineChangeHandler.bind(this)
        this.submitOwnerSignUp = this.submitOwnerSignUp.bind(this)
    }
    restaurantEmailIdChangeHandler = (e) => {
        this.setState({
            restaurantEmailId: e.target.value
        })
    }
    restaurantPasswordChangeHandler = (e) => {
        this.setState({
            restaurantPassword: e.target.value
        })
    }
    restaurantNameChangeHandler = (e) => {
        this.setState({
            restaurantName: e.target.value
        })
    }
    restaurantPhoneChangeHandler = (e) => {
        this.setState({
            restaurantPhone: e.target.value
        })
    }

    restaurantCuisineChangeHandler = (e) => {
        this.setState({
            restaurantCuisine: e.target.value
        })

    }

    restaurantAddressChangeHandler = (e) => {
        this.setState({
            restaurantAddress: e.target.value
        })
    }

    submitOwnerSignUp = (e) => {
        //console.log("in submit ")
        e.preventDefault();
        const data = {
            restaurantEmailId: this.state.restaurantEmailId,
            restaurantPassword: this.state.restaurantPassword,
            restaurantName: this.state.restaurantName,
            restaurantPhone: this.state.restaurantPhone,
            restaurantCuisine: this.state.restaurantCuisine,
            restaurantAddress: this.state.restaurantAddress
        }
        //console.log("data is..")
        //console.log(data);

        this.setState({
            message: "Owner already exists"
        })

        axios.defaults.withCredentials = true;
        axios.post('http://3.133.92.239:3001/ownerSignup', data)
            .then(response => {
                console.log("frontend")
                console.log("Status Code : ", response.status);
                console.log("In response")
                console.log(response)
                if (response.data.responseMessage === "Successfully Added!") {
                    this.setState({
                        finishedSignUp: true,
                        message: "Owner signed up successfully"
                    })
                } else if (response.data.responseMessage === "User already exists!") {
                    this.setState({
                        finishedSignUp: false,
                        message: "Owner already exists!"
                    })
                } else {
                    this.setState({
                        finishedSignUp: false,
                        message: "Failed to create owner"
                    })

                }
            });
    }

    render() {
        var nextpage = null;
        if (this.state.finishedSignUp === false && this.state.message === "Owner already exists!") {
            alert(this.state.message + "\n Please Sign In");
            nextpage = <Redirect to="/OwnerSignIn" />;
        } else if (this.state.finishedSignUp === true) {
            nextpage = <Redirect to="/OwnerSignIn" />;
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
                                <Form.Group controlId="formGridRestaurantName" >
                                    <Form.Label>Restaurant Name</Form.Label>
                                    <Form.Control placeholder="Dusita" required type="text" name="restaurantName" onChange={this.restaurantNameChangeHandler} />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control required type="email" placeholder="Enter email" name="restaurantEmailId" onChange={this.restaurantEmailIdChangeHandler} />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" required placeholder="Password" required name="restaurantPassword" onChange={this.restaurantPasswordChangeHandler} />
                                </Form.Group>
                                <Form.Group controlId="formGridPhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control required placeholder="### ### ####" input type="text" name="restaurantPhone" maxLength="15" onChange={this.restaurantPhoneChangeHandler} />
                                </Form.Group>
                                <Form.Group controlId="formGridCuisine" >
                                    <Form.Label>Cuisine</Form.Label>
                                    <Form.Control placeholder="Thai" required type="text" name="restaurantCuisine" onChange={this.restaurantCuisineChangeHandler} />
                                </Form.Group>
                                <Form.Group controlId="formGridAddress1">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control placeholder="1234 Main St, city, state" required input type="text" name="address" onChange={this.restaurantAddressChangeHandler} />
                                </Form.Group>
                                <Button variant="primary" type="submit" onClick={this.submitOwnerSignUp}>
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

export default OwnerProfileForm