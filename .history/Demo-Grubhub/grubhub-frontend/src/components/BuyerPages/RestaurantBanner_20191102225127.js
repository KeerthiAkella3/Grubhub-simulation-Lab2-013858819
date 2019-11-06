import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import axios from 'axios'
import cookie from 'react-cookies'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export class RestaurantBanner extends Component {
    constructor(props) {
        super(props)

        this.state = {
            backgroundImage: undefined,
        }
    }

    componentDidMount = () => {
        var restaurantId = cookie.load('cookie2');
       // e.preventDefault();
        axios.defaults.withCredentials = true;
        if (restaurantId) {
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
                        backgroundImage: "data:image/png;base64," + responseData.base64str
                    });
                }).catch(function (err) {
                    console.log(err)
                });
        }
    }

    render() {
        return (
            <Jumbotron fluid>
                <Container style={{
                    maxWidth: "100%",
                    width: "100%",
                    height: "100%",
                }}>
                    <Row>
                        <Col sm={7}>
                            <h1>{this.props.restaurantName}</h1>
                            1 Washington Sq, San Jose, CA 95192
                        </Col>
                        <Col sm={5} style = {{
                            textAlignLast: 'end',
                        }}> 
                            <img src={this.state.backgroundImage} alt="Profile pic" height="100px" width="100px" ></img>
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
        )
    }
}

export default RestaurantBanner
