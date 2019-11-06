import React, { Component } from 'react'

export class BuyerChatModal extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }

    handleClose = () => {
        this.props.onClose();
    }

    handleSave = () => {
        this.props.onSave();
    }

    chatChangeHandler = (e) => {
        this.setState({
            chatMessage: e.target.value
        })
    }
    
    render() {
        return (
            <div>
                <Modal.Dialog>
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
                </Modal.Dialog>
            </div>
        )
    }
}

export default BuyerChatModal
