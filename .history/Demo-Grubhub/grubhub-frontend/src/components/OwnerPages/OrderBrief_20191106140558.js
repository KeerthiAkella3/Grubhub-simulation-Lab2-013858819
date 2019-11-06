import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { Rnd } from "react-rnd";
import OwnerChatModal from './OwnerChatModal';

export class OrderBrief extends Component {

    constructor(props) {
        super(props)

        this.state = {
            anOrderData: undefined,
            orderStatus: "New",
            showOwnerChatModal: false,
            messagesToOwner: undefined,
            messagesToBuyer: undefined,
        }
        this.cancelOrder = this.cancelOrder.bind(this);
        this.handleChatWithBuyer = this.handleChatWithBuyer.bind(this);
        this.handleCloseChatModal = this.handleCloseChatModal.bind(this);
        this.handleSubmitChat = this.handleSubmitChat.bind(this);
    }

    componentDidMount = () => {
        this.setState({
            anOrderData: this.props.anOrderData,
            orderStatus: this.props.orderStatus,
        })
    }

    cancelOrder = () => {
        let anOrderData = this.state.anOrderData;
        axios.delete('http://3.133.92.239:3001/deleteOrder', {
            params: {
                uniqueOrderId: anOrderData._id,
            }
        }).then(response => {
            console.log("Response on delete order");
            if (response.status === 200) {
                console.log("Successfully deleted Order");
            } else {
                console.log("Status Code: ", response.status);
                console.log(response.data.responseMessage);
            }
        }).catch(error => {
            console.log(error);
        });
        this.setState({
            anOrderData: undefined,
        })
    }

    handleChatWithBuyer = () => {
        // get previous converstation from backend
        let restaurantId = this.state.anOrderData.restaurantId;
        let buyerId = this.state.anOrderData.buyerId;
        let uniqueOrderId = this.state.anOrderData._id;
        let messagesToBuyer = undefined;
        let messagesToOwner = undefined;
        axios.get('http://3.133.92.239:3001/getMessages', {
            params: {
                buyerId: buyerId,
                restaurantId: restaurantId,
                uniqueOrderId: uniqueOrderId
            }
        }).then(response => {
            console.log("Response on messages from buyer ");
            console.log(response.data.buyerDetails);
            if (response.status === 200) {
                messagesToOwner = response.data.messagesToOwner;
                messagesToBuyer = response.data.messagesToBuyer;
            } else {
                console.log("Status Code: ", response.status);
                console.log(response.data.responseMessage);
            }
            this.setState({
                showOwnerChatModal: true,
                messagesToBuyer: messagesToBuyer,
                messagesToOwner: messagesToOwner,
            })
        }).catch(error => {

        });
    }

    handleSubmitChat = (message) => {
        // send new converstation to backend
        let buyerId = this.state.anOrderData.buyerId;
        let restaurantId = this.state.anOrderData.restaurantId;
        let data = {
            buyerId: buyerId,
            restaurantId: restaurantId,
            uniqueOrderId: this.state.anOrderData._id,
            message: message,
        }
        axios.post('http://3.133.92.239:3001/sendMessageToBuyer', data)
            .then(response => {
                if (response.status === 200) {
                    console.log('Successfully saved conversation!');
                } else {
                    console.log("Status Code: ", response.status);
                    console.log(response.data.responseMessage);
                }
            }).catch(error => {
                console.log(error);
            });

        this.setState({
            showOwnerChatModal: false,
        })
    }

    handleCloseChatModal = () => {
        this.setState({
            showOwnerChatModal: false,
        })
    }

    changeOrderStatus = (e, nextStatus) => {

        let anOrderData = this.state.anOrderData;
        e.preventDefault();
        axios.defaults.withCredentials = true;
        axios.post('http://3.133.92.239:3001/updateOrder',
            {
                uniqueOrderId: anOrderData._id,
                nextStatus: nextStatus,
            }
        ).then(response => {
            console.log("Response on update order details: ");
            console.log(response.data.buyerDetails);
            if (response.status === 200) {
                console.log("Successfully updated Order");
                // window.alert("Successfully updated order from " + anOrderData.buyerName);
            } else {
                console.log("Status Code: ", response.status);
                console.log(response.data.responseMessage);
            }
        }).catch(error => {
            console.log(error);
        });
        this.setState({
            anOrderData: undefined,
        })
        // this.props.handleChangeStatus(e, nextStatus);
    }


    render() {
        let anOrderData = this.state.anOrderData;
        let chatModal = [];
        if (anOrderData == undefined) {
            return null;
        }

        let listGroupStyle = {
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingRight: "2px",
        }

        if (this.state.showOwnerChatModal === true) {
            chatModal = <OwnerChatModal
                messagesToOwner={this.state.messagesToOwner}
                messagesToBuyer={this.state.messagesToBuyer}
                buyerName={this.state.anOrderData.buyerName}
                restaurantName={this.state.anOrderData.restaurantName}
                onClose={this.handleCloseChatModal}
                onSave={this.handleSubmitChat}
            ></OwnerChatModal>
        }

        console.log("In order brief page");
        console.log(anOrderData);
        // an order will have buyer, owner information, and multiple items. One item includes total price, quantity and item name.
        let buyerName = anOrderData.buyerName;
        let buyerAddress = anOrderData.buyerAddress;
        let netTotalPrice = 0.0;
        let orderItemsDOM = [];
        let index = 0;
        for (index = 0; index < anOrderData.items.length; index++) {
            console.log("Going through various items in order");
            console.log(anOrderData.items[index]);
            netTotalPrice = anOrderData.totalPrice;
            orderItemsDOM.push(
                <div key={index} style={{ width: "100%", height: "100%" }}>
                    <ListGroup.Item key={index} disabled style={listGroupStyle}>
                        <h3>Name: {anOrderData.items[index].itemName}</h3>
                        <Container style={{
                            maxWidth: "100%",
                            width: "100%",
                            height: "100%",
                        }}>
                            <Row>
                                <Col sm={10}>
                                    Quantity: {anOrderData.items[index].itemQuantity}
                                </Col>
                                <Col sm={2} style={{
                                    // marginRight: "2px",
                                    textAlign: "end",
                                }}>
                                    Price: USD {anOrderData.items[index].itemTotalPrice}
                                </Col>
                            </Row>
                        </Container>
                    </ListGroup.Item>
                </div>
            );
        }

        let orderButtonDOM = [];
        let nextStatus = "Preparing";
        if (this.state.orderStatus !== "Delivered") {
            if (this.state.orderStatus === "New") {
                nextStatus = "Preparing";
            } else if (this.state.orderStatus === "Preparing") {
                nextStatus = "Ready";
            } else if (this.state.orderStatus === "Ready") {
                nextStatus = "Delivered";
            }
            orderButtonDOM.push(
                <Row key={0}>
                    <Col sm={5}>
                        <Button variant="danger" onClick={this.cancelOrder}> Cancel Order </Button>
                    </Col>
                    <Col sm={5}>
                        <Button variant="danger" onClick={this.handleChatWithBuyer}> Messages </Button>
                    </Col>
                    <Col sm={2}>
                        <Button variant="success" onClick={(e) => {
                            this.changeOrderStatus(e, nextStatus)
                        }}>Move to {nextStatus}</Button>
                    </Col>

                </Row>
            )
        }

        return (

            <div>
                <Card bg="secondary" text="white" style={{
                    borderStyle: "none",
                    marginTop: '5px',
                    marginBottom: '5px',
                    heigth: "flex",
                }}>
                    {/* <Card.Header>Header</Card.Header> */}
                    <Card.Body>
                        <Card.Title>{buyerName}</Card.Title>
                        {/* <Card.Text> */}
                        {buyerAddress}
                        {/* </Card.Text> */}
                        {/* <Card.Text> */}
                        {orderItemsDOM}
                        {/* </Card.Text> */}
                        <Card.Text style={{
                            textAlign: "end",
                            fontWeight: "900",
                        }}>
                            Total Price: USD {parseFloat(netTotalPrice).toFixed(2)}
                        </Card.Text>
                        <Container style={{
                            width: "100%",
                            height: "100%",
                            maxWidth: "100%"
                        }}>
                            {orderButtonDOM}
                        </Container>
                    </Card.Body>
                </Card>
                {chatModal}
            </div>
        )
    }
}

export default OrderBrief