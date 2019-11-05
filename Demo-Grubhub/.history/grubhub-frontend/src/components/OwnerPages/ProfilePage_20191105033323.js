import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

/**
 * This is owner (restaurant's) profile page
 */
export class ProfilePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            readonly: '',
            id: '',
            restaurantEmailId: '',
            restaurantAddress: '',
            userPassword: '',
            restaurantPhone: '',
            restaurantName: '',
            restaurantCuisine: '',
        }
    }

    componentDidMount() {
        var restaurantEmailId = cookie.load('cookie1');
        var restaurantId = cookie.load('cookie2');
        if (restaurantEmailId) {
            
            axios({
                method: 'get',
                url: 'http://localhost:3001/restaurantDetails',
                params: { restaurantId: cookie.load('cookie1') },
                config: { headers: { 'Content-Type': 'application/json' } }
            })
                .then((response) => {
                    if (response.status >= 500) {
                        throw new Error("Bad response from server");
                    }
                    console.log(response);
                    if (response.data) {
                        let restaurantDetails = response.data.restaurantDetails;
                        this.setState({
                            restaurantName: restaurantDetails.restaurantName,
                            restaurantPhone: restaurantDetails.restaurantPhone,
                            restaurantAddress: restaurantDetails.restaurantAddress,
                            restaurantCuisine: restaurantDetails.restaurantCuisine,
                            restaurantrestaurantEmailId: restaurantDetails.restaurantEmailId,
                            id: restaurantDetails.restaurantId
                        });
                    }
                }).catch(function (err) {
                    console.log(err)
                });

            axios({
                method: 'get',
                url: 'http://localhost:3001/profile/img',
                params: { "id": restaurantId, "table": "restaurantTable" },
                config: { headers: { 'Content-Type': 'application/json' } }
            })
                .then((response) => {
                    if (response.status >= 500) {
                        throw new Error("Bad response from server");
                    }
                    console.log(response);
                    return response.data;
                })
                .then((responseData) => {
                    console.log(responseData.base64str);
                    this.setState({
                        restaurantImage: "data:image/png;base64," + responseData.base64str
                    });
                }).catch(function (err) {
                    console.log(err)
                });
        }
    }

    onClose() {
        this.setState({ preview: null })
    }

    onPicUpload = async (e) => {
        console.log("on pic upload")
        this.setState({ selectedFile: e.target.files[0] });
        var restaurantId = cookie.load('cookie1');
        var emailId = cookie.load('cookie3');
        let formData = new FormData();
        formData.append('id', restaurantId);
        formData.append('table', "restaurantTable");
        formData.append('selectedFile', e.target.files[0]);
        e.preventDefault();
        axios.defaults.withCredentials = true;
        await axios({
            method: 'post',
            url: 'http://localhost:3001/img/upload ',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                alert(responseData.responseMessage);
                axios({
                    method: 'get',
                    url: 'http://localhost:3001/profile/img',
                    params: { "id": restaurantId, "table": "restaurantTable" },
                    config: { headers: { 'Content-Type': 'application/json' } }
                })
                    .then((response) => {
                        if (response.status >= 500) {
                            throw new Error("Bad response from server");
                        }
                        console.log(response);
                        return response.data;
                    })
                    .then((responseData) => {
                        console.log(responseData.base64str);
                        this.setState({
                            restaurantImage: "data:image/png;base64," + responseData.base64str
                        });
                    }).catch(function (err) {
                        console.log(err)
                    });

                //window.location.reload();
            }).catch(function (err) {
                console.log(err)
            });
    }


    updateProfile = async (event) => {
        event.preventDefault();
        axios.defaults.withCredentials = true;
        var restaurantEmailId = cookie.load('cookie3');
        var restaurantId = cookie.load('cookie1');
        console.log("In update profile cookie 3 " + restaurantEmailId)
        console.log("In update profile cookie 1 " + restaurantId)
        const formData = new FormData(event.target);
        await axios({
            method: 'post',
            url: 'http://localhost:3001/updateOwner',
            data: {
                "restaurantEmailId": restaurantEmailId, "table": "restaurantTable",
                "restaurantName": formData.get('restaurantName'),
                "restaurantPhone": formData.get('restaurantPhone'),
                "restaurantAddress": formData.get('restaurantAddress'),
                "restaurantName": formData.get('restaurantName'),
                "restaurantCuisine": formData.get('restaurantCuisine'),
                "restaurantId": restaurantId
            },
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responsedata) => {
                alert("Sucessfully edited");

                //window.location.reload();
            }).catch(function (err) {
                console.log(err)
            });
    }

    render() {

        let imageDiv = (<div className='buttons fadein'>
            <div className='button'>
                <label htmlFor='single'>
                    <img src={this.state.restaurantImage} alt="Profile pic" height="40px" width="60px" ></img>
                </label>
                {/* <input type='file' id='single' name="selectedFile" onChange={this.onPicUpload} style={{ height: "0px", width: "0px" }} accept="image/x-png,image/gif,image/jpeg" /> */}
            </div>
        </div>);

        return (
            <div>
                <h4>Your account</h4>
                <Form onSubmit={this.updateProfile}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" name="restaurantName" defaultValue={this.state.restaurantName} required readOnly={this.state.readonly} />
                    </Form.Group>
                    <Form.Group controlId="formGridrestaurantAddress1">
                        <Form.Label>restaurantAddress</Form.Label>
                        <Form.Control type="text" name="restaurantAddress" defaultValue={this.state.restaurantAddress} required readOnly={this.state.readonly} />
                    </Form.Group>

                    <Form.Group controlId="formBasicrestaurantPhone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" name="restaurantPhone" defaultValue={this.state.restaurantPhone} required readOnly={this.state.readonly} />
                    </Form.Group>

                    <Form.Group controlId="formBasicRetaurentName">
                        <Form.Label>Restaurant Name</Form.Label>
                        <Form.Control type="text" name="restaurantName" defaultValue={this.state.restaurantName} required readOnly={this.state.readonly} />
                    </Form.Group>

                    <Form.Group controlId="formBasicrestaurantCuisine">
                        <Form.Label>restaurantCuisine</Form.Label>
                        <Form.Control type="text" name="restaurantCuisine" defaultValue={this.state.restaurantCuisine} required readOnly={this.state.readonly} />
                    </Form.Group>

                    <Form.Group controlId='buyerImage'>
                        <Form.Label>Owner Profile Pic</Form.Label>
                        {imageDiv}
                        <Form.Control as='input' type='file' onChange={this.onPicUpload}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Update Profile
                     </Button>
                </Form>
            </div>
        )
    }
}

export default ProfilePage