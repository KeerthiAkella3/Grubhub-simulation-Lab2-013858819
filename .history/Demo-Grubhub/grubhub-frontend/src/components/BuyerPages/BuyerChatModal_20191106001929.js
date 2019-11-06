import React, { Component } from 'react'

export class BuyerChatModal extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            chatMessage: "",
            show: true,
        }
    }

    handleClose = () => {
        this.props.onClose();
    }

    handleSave = () => {
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
                        <p>{this.props.previousConverstation}</p>
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

export default BuyerChatModal
