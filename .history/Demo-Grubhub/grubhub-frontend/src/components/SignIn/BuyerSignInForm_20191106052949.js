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

    // export const authLogin = (data) => dispatch => {
    //     axios.defaults.withCredentials = true;
    //         axios({
    //             method: 'post',
    //             url: 'http://'+rooturl+':3001/login',
    //             // data: {"jsonData" : JSON.stringify(data)},        
    //             data: data,
    //             config: { headers: { 'Content-Type': 'multipart/form-data' } }
    //         })
    //             .then((response) => {
    //                 if (response.status >= 500) {
    //                     throw new Error("Bad response from server");
    //                 }
    //                 console.log(response);
    //                 return response.data;
    //             })
    //             .then((responseData) => {
    //                 if (responseData.validUser == true) {
    //                     localStorage.setItem("token", responseData.token);
    //                     localStorage.setItem("cookie1", responseData.cookies.cookie1);
    //                     localStorage.setItem("cookie2", responseData.cookies.cookie2);
    //                     localStorage.setItem("cookie3", responseData.cookies.cookie3);
    //                     localStorage.setItem("cookie4", responseData.cookies.cookie4);
    //                     dispatch({
    //                         type: AUTH_LOGIN,
    //                         authFlag: true,
    //                         username: data.email,
    //                         displayErrorMsg: false
    //                     });
    //                     console.log("valid user");
    //                 }
    //                 if (responseData.validUser == false){
    //                     dispatch({
    //                         type: AUTH_LOGIN,
    //                         authFlag: false,
    //                         displayErrorMsg: true
    //                     });
    //                 }
    //             }).catch(function (err) {
    //                 console.log(err)
    //             });
    // }
    



    submitBuyerLogin = (e) => {
        console.log("in submit Login")
        const data = {
            buyerEmailId: this.state.buyerEmailId,
            buyerPassword: this.state.buyerPassword
        }
        console.log("data is..")
        console.log(data);
        e.preventDefault();
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/buyerLogin', data)
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