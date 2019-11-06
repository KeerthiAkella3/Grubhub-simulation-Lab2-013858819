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
                        <p>{this.props.previousConverstation}</p>
                    </Modal.Body>

                    <Modal.Body>
                        <input type="text" defaultValue="type here... "></input>
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
