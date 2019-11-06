import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'

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

    onChangeHandler = (e) => {
        this.setState({
            chatMessage: e.target.value,
        })
    }

    render() {
        console.log('data to this modal from parent i.e., buyer order brief page');
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
                <Modal show={this.state.show} onHide={(e) => {
                    this.handleClose(e, this.props.onClose);
                }}>
                    <Modal.Header>
                        <Modal.Title>Modal title</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
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
                                <FormControl type="text" placeholder="type here..." name="chat" onChange={this.onChangeHandler/>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                            <Button variant="primary" type="submit" onClick={this.handleSave}>Save</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default BuyerChatModal
