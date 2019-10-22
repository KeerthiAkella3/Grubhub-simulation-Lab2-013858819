import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export class DefineQuantity extends Component {

    constructor(props) {
        super(props)

        this.state = {
            show: true,
            quantity: 1,
            totalPrice: 0
        }

        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
    }

    componentDidMount = () => {
        this.setState({
            show: true,
            totalPrice: this.props.clickedItem.itemPrice
        })
    }

    handleIncrement = (e, clickedItem) => {
        console.log("Handling increment")
        console.log("prevState total price " + this.state.totalPrice)
        console.log("clicked item price" + clickedItem.itemPrice)
        this.setState(prevState => ({
            quantity: prevState.quantity + 1,
            totalPrice: parseFloat(eval(parseFloat(prevState.totalPrice) + parseFloat(clickedItem.itemPrice))).toFixed(2),
        }));
    }

    handleDecrement = (e, clickedItem) => {
        if (this.state.quantity === 0) {
            return;
        } else {
            this.setState(prevState => ({
                quantity: prevState.quantity - 1,
                totalPrice: parseFloat(eval(parseFloat(prevState.totalPrice) - parseFloat(clickedItem.itemPrice))).toFixed(2),
            }));
        }

    }

    handleClose = (e, closeCallback) => {
        this.setState({
            show: false
        })
        closeCallback()
    }

    handleSave = (e, saveCallback) => {
        this.setState({
            show: false
        })
        saveCallback(this.state, this.props.clickedItem)
    }

    render() {
        let itemName = this.props.clickedItem.itemName;
        let quantity = this.state.quantity;
        return (
            <div>
                <Modal show={this.state.show} onHide={(e) => {
                    this.handleClose(e, this.props.onClose)}
                    }>
                    <Modal.Header closeButton>
                        <Modal.Title>{itemName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Quantity</Form.Label>
                                <div style={
                                    {
                                        width: "160px",
                                        height: "80px",
                                        borderRadius: "40px"
                                    }
                                }>
                                    <Button onClick={(e) => {
                                        this.handleDecrement(e, this.props.clickedItem)
                                    }}
                                        >-</Button>
                                    {quantity}
                                    <Button onClick={(e) => {
                                        this.handleIncrement(e, this.props.clickedItem)
                                    }}>+</Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={(e) => {
                            this.handleClose(e, this.props.onClose)
                        }}>
                            Close
                    </Button>
                        <Button variant="primary" onClick={(e) => {
                            this.handleSave(e, this.props.onSave)
                        }}>
                            Add to bag: {this.state.totalPrice}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        )
    }
}

export default DefineQuantity