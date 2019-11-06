import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

export class PlaceOrder extends Component {

    constructor(props) {
        super(props)

        this.state = {
            show: true,
        }

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose = (e, closeCallback) => {
        this.setState({
            show: false
        })
        closeCallback()
    }

    render() {
        let orderItemsSummaryDOM = [];
        let cartItems = this.props.cartItems;
        let index = 0;
        for (index = 0; index < cartItems.length; index++) {
            orderItemsSummaryDOM.push(
                <div style={{ width: "100%", height: "100%" }} onChange={this.updateState}>
                    <Card style={{ borderStyle: "none", width: "100%", height: "100%", marginBottom: '1px', marginLeft: '1px', marginRight: '1px' }}>
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
                <Modal show={this.state.show} onHide={(e) => {
                    this.handleClose(e, this.props.onClose);
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Order Summary</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>RestaurantName: {this.props.restaurantName}</p>
                        <p>restaurantAddress: {this.props.restaurantAddress}</p>
                        <p>BuyerName: {this.props.buyerName}</p>
                        <p>BuyerAddress: {this.props.buyerAddress}</p>
                        {orderItemsSummaryDOM}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={(e) => {
                            this.handleClose(e, this.props.onClose)
                        }}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div >
        )
    }
}

export default PlaceOrder;