import React, { Component } from 'react'

export class BuyerChatModal extends Component {
    render() {
        return (
            <div>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Modal title</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Modal body text goes here.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" onSave={this.onSave}>Save</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        )
    }
}

export default BuyerChatModal
