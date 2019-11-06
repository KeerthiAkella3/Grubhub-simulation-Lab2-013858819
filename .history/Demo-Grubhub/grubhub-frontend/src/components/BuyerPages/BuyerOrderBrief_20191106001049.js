import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import {Rnd} from 'react-rnd';

export class BuyerOrderBrief extends Component {

    constructor(props) {
        super(props)

        this.state = {
            orderData: undefined,
            showBuyerChatModal: false,
        }

        this.handleChatWithRestaurant = this.handleChatWithRestaurant.bind(this);
    }

    componentWillMount = () => {
        this.setState({
            orderData: this.props.anOrderData,
        })
    }

    handleChatWithRestaurant = () => {
        this.setState({
            showBuyerChatModal: true,
        })
    }

    handleSubmitChat = () => {

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
        
        console.log('items in order from db')
        console.log(orderItemsInfo);
        for (let index = 0; orderItemsInfo !== undefined && index < orderItemsInfo.length; index++) {
            let anItem = orderItemsInfo[index];
            console.log(anItem);
            if (anItem !== undefined) {
                itemInfoDOM.push(
                    <Card.Text key={index}>
                        Name : {anItem.itemName},<br/>
                        Quantity: {anItem.itemQuantity},<br/>
                        Price: {anItem.itemTotalPrice},<br/>
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
                marginRight: '5px',  }}>
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                    <Card.Title>{restaurantName}</Card.Title>
                    <Card.Subtitle>
                        Restaurant Address: {restaurantAddress}
                    <br/>
                    <br/>
                    </Card.Subtitle>
                    {itemInfoDOM}
                    <Card.Footer style={{
                        fontWeight: "500",
                        backgroundColor: "#e6f2ff",
                        fontWeight: "500",
                    }}>
                        Total Cost of Order: {totalPrice}<br/>
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
