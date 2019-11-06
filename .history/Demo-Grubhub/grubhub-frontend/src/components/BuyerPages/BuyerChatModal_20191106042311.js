import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export class BuyerChatModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            chatMessage: "",
            show: true,
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
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

    onChangeHandler = (e) => {
        console.log(e.target.value);
        // this.setState({
        //     chatMessage: e.target.value,
        // })
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
                <Card show={this.state.show} autoFocus={true} enforceFocus={true}>
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
                                <Form.Control name="chat" type='input'/>
                            </Form.Group>
                        </Form>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" type="submit" onClick={this.handleSave}>Save</Button>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default BuyerChatModal
