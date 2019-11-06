import React, { Component } from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import OrderBrief from '../OwnerPages/OrderBrief'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import BuyerOrderBrief from './BuyerOrderBrief'
import BuyerNavBar from './BuyerNavBar'
import { Rnd } from "react-rnd";
import Draggable from 'react-draggable'

/**
 * - See All Past Orders
 * - See All Upcoming Orders (Should also display the orderStatus according to restaurantOwner)
 */
export class BuyerOrdersPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allOrderData: undefined,
        }
    }

    componentDidMount = () => {
        // get order details of this buyer
        // and render it
        let buyerId = cookie.load('cookie1');
        let buyerEmailId = cookie.load('cookie3');
        axios.get('http://localhost:3001/getBuyerOrder', {
            params: {
                buyerEmailId: buyerEmailId,
            }
        }).then(response => {
            console.log("Response on buyer details: ");
            console.log(response.data.allOrderData);
            this.setState({
                allOrderData: response.data.allOrderData,
            });
        }).catch(error => {
            console.log('error! while getting data from buyer order table');
        });
    }

    render() {
        const listOfAllOrders = this.state.allOrderData;
        let listGroupStyle = {
            paddingTop: "5px",
            paddingBottom: "5px",
        }
        let pastListDOM = [];
        let upcomingListDOM = [];
        let pastListGroupOrders = [];
        let upcomingListGroupOrders = [];

        if (listOfAllOrders !== undefined && listOfAllOrders.length !== undefined && listOfAllOrders.length !== 0) {
            for (let index = 0; index < listOfAllOrders.length; index++) {
                let anOrderData = listOfAllOrders[index];
                if (anOrderData.buyerOrderStatus === "Past" || anOrderData.buyerOrderStatus === "Rejected") {
                    pastListGroupOrders.push(
                        <Rnd default={{ width: "100%", height: "flex", y: index * 250 + 10, x: 0, }} enableResizing={false} dragAxis={'y'} bounds='body'>
                            <BuyerOrderBrief anOrderData={anOrderData} orderStatus={anOrderData.buyerOrderStatus} key={index} />
                        </Rnd>
                    );
                } else {
                    upcomingListGroupOrders.push(
                        <BuyerOrderBrief anOrderData={anOrderData} orderStatus={anOrderData.buyerOrderStatus} key={index} />
                    )
                }
            }
            pastListDOM.push(pastListGroupOrders);
            upcomingListDOM.push(upcomingListGroupOrders);
        }

        let rowStyle = {
            height: "100%",
            width: "inherit",
            marginRight: "0px",
            marginLeft: "0px",
        }


        return (
            <div style={{
                width: "100%",
                height: "100%",
            }}>
                <BuyerNavBar disableOrderStatus={true} />
                <ListGroup defaultActiveKey="#link1">
                    <Container style={{
                        marginLeft: "0px",
                        marginRight: "0px",
                        paddingLeft: '2px',
                        paddingRight: '2px',
                    }}>
                        <Col style={rowStyle} sm={6}>
                            <Row style={rowStyle}>
                                <h1>Past Orders:</h1>
                            </Row>
                            <Row>
                                {pastListDOM}

                            </Row>

                        </Col>
                        <Col style={rowStyle} sm={6}>
                            <Row style={rowStyle}>
                                <h1>Upcoming Orders:</h1>
                            </Row>
                            <Row style={rowStyle}>
                                {upcomingListDOM}
                            </Row>
                        </Col>
                    </Container>
                </ListGroup>
            </div>

        )
    }
}

export default BuyerOrdersPage
