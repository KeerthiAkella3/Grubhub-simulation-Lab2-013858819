import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import CardDialog from 'react-bootstrap/CardDialog'
import CardHeader from 'react-bootstrap/CardHeader'
import CardTitle from 'react-bootstrap/CardTitle'
import CardBody from 'react-bootstrap/CardBody'
import CardFooter from 'react-bootstrap/CardFooter'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export class BuyerChatModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            chatMessage: "",
            show: true,
        }
    }

    handleClose = () => {
        this.setState({
            show: false,
        })
        this.props.onClose();
    }

    handleSave = () => {
        this.setState({
            show: false,
        })
        this.props.onSave(this.state.chatMessage);
    }

    render() {
        console.log('data to this Card from parent i.e., buyer order brief page');
        console.log(this.props);
        let messagesToBuyer = this.props.messagesToBuyer;
        let messagesToOwner = this.props.messagesToOwner;
        let messagesToBuyerDOM = [];
        let messagesToOwnerDOM = [];
        let index = 0;
        for (index = 0; messagesToBuyer !== undefined && index < messagesToBuyer.length; index++) {
            messagesToBuyerDOM.push(
                <p>
                    {messagesToBuyer[index]}
                </p>
            )
        }

        for (index = 0; messagesToOwner !== undefined && index < messagesToOwner.length; index++) {
            messagesToOwnerDOM.push(
                <p>
                    {messagesToOwner[index]}
                </p>
            )
        }



        return (
            <div>
                <Card show={this.state.show} onHide={(e) => {
                    this.handleClose(e, this.props.onClose);
                }}>
                    <Card.Header>
                        <Card.Title>Card title</Card.Title>
                    </Card.Header>

                    <Card.Body>
                        <p>{this.props.buyerName}:</p>
                        {messagesToOwnerDOM}

                        <br />
                        <br />
                        <p>{this.props.restaurantName}:</p>
                        {messagesToBuyerDOM}
                        <br />
                        <br />
                        <Form style={{ width: '18rem' }}>
                            <Form.Group controlId="formChat">
                                <Form.Control type="text" placeholder="type here..." name="chat"/>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                            <Button variant="primary" type="submit" onClick={this.handleSave}>Save</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default BuyerChatModal
