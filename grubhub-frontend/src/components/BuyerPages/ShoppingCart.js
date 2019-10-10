import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'

export class ShoppingCart extends Component {
    constructor(props) {
        super(props)
        this.placeOrder = this.placeOrder.bind(this)
    }

    placeOrder = (e, placeOrderCallback) => {
        console.log("Shopping did mount");
        console.log(this.props.cartItems);
        let index = 0;
        let netPrice = 0.0;
        for (index = 0; index < this.props.cartItems.length; index++) {
            let anItem = this.props.cartItems[index];
            netPrice = parseFloat(eval(parseFloat(netPrice) + parseFloat(anItem.itemTotalPrice))).toFixed(2);
        }
        
        placeOrderCallback({
            itemsInCart: [...this.props.cartItems],
            netPrice: netPrice,
        })
    }

    render() {
        let cartItems = this.props.cartItems;
        let cartItemsDOM = [];
        let index = 0;
        let netPrice = 0.0;
        for (index = 0; index < cartItems.length; index++) {
            netPrice = parseFloat(eval(parseFloat(netPrice) + parseFloat(cartItems[index].itemTotalPrice))).toFixed(2);
            cartItemsDOM.push(
            <div style={{ width: "100%", height: "100%" }} onChange={this.updateState}>
                <Card style={{ borderStyle: "none", width: "100%", height: "100%" }}>
                    <Card.Body style={{ width: "100%", height: "100%" }}>
                        <Card.Title>{cartItems[index].itemName}</Card.Title>
                        <Card.Text>
                            {cartItems[index].itemTotalPrice}
                        </Card.Text>
                        <Card.Text>
                            Quantity: {cartItems[index].itemQuantity}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            );
        }
        return (
            <div>
                <Container>
                    <Row>
                        <h3>Your order from {this.props.restaurantName}</h3>
                    </Row>
                    <Row>
                        {cartItemsDOM}
                    </Row>
                    <Row>
                        Items subtotal: <t /> {netPrice}
                    </Row>
                    <Row>
                        <Button variant="success" onClick={(e) => {
                            this.placeOrder(e, this.props.placeOrder)
                        }}>
                            Place Order
                        </Button>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default ShoppingCart
