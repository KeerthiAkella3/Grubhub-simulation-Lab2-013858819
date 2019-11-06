import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Rnd } from 'react-rnd';

export class BuyerOrderBrief extends Component {

    constructor(props) {
        super(props)

        this.state = {
            orderData: undefined,
            showBuyerChatModal: false,
            messagesToOwner: [],
            messagesFromOwner: [],
        }

        this.handleChatWithRestaurant = this.handleChatWithRestaurant.bind(this);
    }

    componentWillMount = () => {
        this.setState({
            orderData: this.props.anOrderData,
        })
    }

    handleChatWithRestaurant = () => {
        // get previous converstation from backend
        let fromId = this.state.orderData.buyerId;
        let toId = this.state.orderData.restaurantId;
        axios.get('http://localhost:3001/getMessages', {
            params: {
                fromId: fromId,
                toId: toId,
            }
        }).then(response => {
            console.log("Response on buyer details: ");
            console.log(response.data.buyerDetails);
            if (response.status === 200) {
                let buyerDetails = response.data.buyerDetails;
                if (buyerDetails) {
                    this.setState({
                        buyerName: buyerDetails.buyerName,
                        buyerEmailId: buyerDetails.buyerEmail,
                        buyerAddress: buyerDetails.buyerAddress,
                        buyerId: buyerDetails._id,
                        })
                }
            } else {
                console.log("Status Code: ", response.status);
                console.log(response.data.responseMessage);
            }
        }).catch(error => {

        });

        this.setState({
            showBuyerChatModal: true,
        })
    }

    handleSubmitChat = (message) => {
        // send new converstation to backend
        let buyerId = this.state.orderData.buyerId;
        let restaurantId = this.state.orderData.restaurantId;
        let data = {
            fromId: buyerId,
            toId: restaurantId,
            message: message,
        }
        axios.post('http://localhost:3001/sendMessages', data)
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
            showBuyerChatModal: false,
        })
    }

    handleCloseChatModal = () => {
        this.setState({
            showBuyerChatModal: false,
        })
    }

    // eachOrderInfo = {
    //     uniqueOrderId: uniqueOrderId,
    //     orderItemsInfo: orderItemsInfo,
    //     buyerOrderStatus: anOrder.buyerOrderStatus,
    //     buyerEmailId: anOrder.buyerEmailId,
    //     restaurantOrderStatus: restaurantOrderInfo.restaurantOrderStatus,
    //     restaurantName: restaurantDetails.restaurantName,
    //     restaurantAddress: restaurantDetails.restaurantAddress,
    //   }
    render() {
        let orderData = this.state.orderData;
        let restaurantName = orderData.restaurantName;
        let restaurantAddress = orderData.restaurantAddress;
        let restaurantOrderStatus = orderData.restaurantOrderStatus;
        let uniqueOrderId = orderData._id;
        let orderItemsInfo = orderData.items;
        let totalPrice = orderData.totalPrice;
        let itemInfoDOM = [];
        let chatModal = [];

        if (showBuyerChatModal === true) {
            chatModal = <BuyerChatModal
                previousConversation={this.state.previousConversation}
                onClose={this.handleCloseChatModal}
                onSave={this.handleSubmitChat}
            ></BuyerChatModal>
        }

        console.log('items in order from db')
        console.log(orderItemsInfo);
        for (let index = 0; orderItemsInfo !== undefined && index < orderItemsInfo.length; index++) {
            let anItem = orderItemsInfo[index];
            console.log(anItem);
            if (anItem !== undefined) {
                itemInfoDOM.push(
                    <Card.Text key={index}>
                        Name : {anItem.itemName},<br />
                        Quantity: {anItem.itemQuantity},<br />
                        Price: {anItem.itemTotalPrice},<br />
                    </Card.Text>
                );
                // totalPrice = parseFloat(eval(totalPrice + parseFloat(anItem.itemTotalPrice))).toFixed(2);
            }
        }
        return (
            <Card style={{
                width: '18rem',
                borderRadius: '15px',
                marginLeft: '5px',
                marginRight: '5px',
            }}>
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                    <Card.Title>{restaurantName}</Card.Title>
                    <Card.Subtitle>
                        Restaurant Address: {restaurantAddress}
                        <br />
                        <br />
                    </Card.Subtitle>
                    {itemInfoDOM}
                    <Card.Footer style={{
                        fontWeight: "500",
                        backgroundColor: "#e6f2ff",
                        fontWeight: "500",
                    }}>
                        Total Cost of Order: {totalPrice}<br />
                        Order Status: <b>{restaurantOrderStatus}</b>
                    </Card.Footer>
                    <Button variant="danger" onClick={this.handleChatWithRestaurant}> Chat with Customer </Button>
                    {chatModal}
                </Card.Body>
            </Card>
        )
    }
}

export default BuyerOrderBrief
