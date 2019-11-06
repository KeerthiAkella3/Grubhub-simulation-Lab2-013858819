import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import Button from 'react-bootstrap/Button'

export class OwnerChatModal extends Component {

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

    chatChangeHandler = (e) => {
        this.setState({
            chatMessage: e.target.value
        })
    }
    
    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={(e) => {
                    this.handleClose(e, this.props.onClose);
                }}>
                    <Modal.Header>
                        <Modal.Title>Modal title</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.props.BuyerName}:
                        <p>{this.props.messagesToOwner}</p>
                    </Modal.Body>

                    <Modal.Body>
                        {this.props.RestaurantName}:
                        <p>{this.props.messagesToBuyer}</p>
                    </Modal.Body>

                    <Modal.Body>
                        <input type="text" defaultValue="type here... " onChange={this.chatChangeHandler}></input>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" onClick={this.handleSave}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default OwnerChatModal