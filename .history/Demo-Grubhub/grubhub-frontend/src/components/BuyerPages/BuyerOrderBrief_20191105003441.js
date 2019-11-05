import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export class BuyerOrderBrief extends Component {

    constructor(props) {
        super(props)

        this.state = {
            orderData: undefined,
        }
    }

    componentWillMount = () => {
        this.setState({
            orderData: this.props.anOrderData,
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
        
        console.log('items in order from db')
        console.log(orderItemsInfo);
        for (let index = 0; orderItemsInfo !== undefined && index < orderItemsInfo.length; index++) {
            let anItem = orderItemsInfo[index];
            console.log(anItem);
            if (anItem !== undefined) {
                itemInfoDOM.push(
                    <Card.Text key={anItem.itemId}>
                        <p>Name : {anItem.itemName},</p>
                        <p>Quantity: {anItem.itemQuantity},</p>
                        <p>Price: {anItem.itemTotalPrice},</p>
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
                    }}>
                        Total Cost of Order: {totalPrice}<br/>
                        Order Status: {restaurantOrderStatus}
                    </Card.Footer>
                </Card.Body>
            </Card>
        )
    }
}

export default BuyerOrderBrief
