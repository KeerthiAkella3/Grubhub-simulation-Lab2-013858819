import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import OwnerMenuItemCard from './OwnerMenuItemCard';
import { CardDeck } from 'reactstrap';
import MenuItemAddModal from './MenuItemAddModal';
import cookie from 'react-cookies';
import MenuSectionAddModal from './MenuSectionAddModal';

export class MenuPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sections: [],
            items: [],
            restaurantDetails: {},
            restaurantId: 1,
            showMenuItemAddModal: false,
            showMenuSectionAddModal: false,
            itemAddModalSection: "",
        }

        /** Section Update Handlers */
        this.deleteSectionButtonHandler = this.deleteSectionButtonHandler.bind(this);
        this.addSectionButtonHandler = this.addSectionButtonHandler.bind(this);

        /** Item Update Handlers */
        this.addItemsButtonHandler = this.addItemsButtonHandler.bind(this);
        this.deleteItemButtonHandler = this.deleteItemButtonHandler.bind(this);

        /** Section Modal Handlers */
        this.closeSectionAddModal = this.closeSectionAddModal.bind(this);
        this.saveSectionAddModal = this.saveSectionAddModal.bind(this);

        /** Menu Item Add Handlers */
        this.closeMenuItemAddModal = this.closeMenuItemAddModal.bind(this);
        this.saveMenuItemAddModal = this.saveMenuItemAddModal.bind(this);
    }

    componentWillMount = () => {
        // debugger;
        let restaurantId = cookie.load('cookie1');
        console.log("restaurantId")
        console.log(restaurantId)
        let menu = [];
        let sections = [];
        let restaurantDetails = {};
        console.log("Getting details of restaurant with ID: " + restaurantId);
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/menu', {
            params: {
                restaurantId: restaurantId
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log('response from DB: ');
                    console.log(response.data);
                    menu.push(...response.data.menu);
                    sections.push(...response.data.sections);
                    restaurantDetails = response.data.restaurantDetails;
                } else {
                    console.log("Status Code: ", response.status);
                    console.log(response.data.responseMessage);
                }
                this.setState({
                    restaurantId: cookie.load('cookie1'),
                    restaurantDetails: restaurantDetails,
                    sections: sections,
                    items: menu,
                })
            }).catch(error => {
                console.log(error);
            });
    }

    addSectionButtonHandler = () => {
        this.setState({
            showMenuSectionAddModal: true,
        })
    }

    deleteSectionButtonHandler = (e, sectionName) => {
        e.preventDefault();
        console.log("Deleting Menu Section");
        let menu = [];
        let sections = [];
        let items = this.state.items;
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            let anItem = items[itemIndex];
            if (anItem.itemSection === sectionName) {
                axios.defaults.withCredentials = true;
                axios.delete('http://localhost:3001/restaurantMenu', {
                    params: {
                        menuItemId: anItem.itemId,
                    }
                }).then(response => {
                    console.log("Response on delete menu Item details: ");
                    console.log(response.data.responseMessage);
                    if (response.status === 200) {
                        console.log("Successfully deleted menu Item");
                    } else {
                        console.log("Status Code: ", response.status);
                        console.log(response.data.responseMessage);
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        }

        let restaurantId = this.state.restaurantId;
        console.log("in state")
        console.log(restaurantId)
        axios.defaults.withCredentials = true;
        axios.delete('http://localhost:3001/restaurantSection', {
            params: {
                restaurantId: restaurantId,
                sectionName: sectionName,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log('section got successfully deleted');
                } else {
                    console.log("Status Code: ", response.status);
                    console.log(response.data.responseMessage);
                }

                // refresh state with existing items
                axios.defaults.withCredentials = true;
                axios.get('http://localhost:3001/menu', {
                    params: {
                        restaurantId: restaurantId
                    }
                })
                    .then(response => {
                        if (response.status === 200) {
                            console.log('response from DB: ');
                            console.log(response.data);
                            menu.push(...response.data.menu);
                            sections.push(...response.data.sections);
                        } else {
                            console.log("Status Code: ", response.status);
                            console.log(response.data.responseMessage);
                        }
                        this.setState({
                            items: menu,
                            sections: sections,
                        })
                    }).catch(error => {
                        console.log(error);
                    });
            }).catch(error => {
                console.log(error);
            });
    }

    addItemsButtonHandler = (e, sectionName) => {
        e.preventDefault();
        this.setState({
            showMenuItemAddModal: true,
            itemAddModalSection: sectionName
        })
    }

    deleteItemButtonHandler = (e, itemId) => {
        e.preventDefault();

        // update state with now available items in menu
        console.log("Handling deletion of menu item");
        // delete entry of this item from menu
        e.preventDefault();
        
        let menu = [];
        let sections = [];
        axios.defaults.withCredentials = true;
        axios.delete('http://localhost:3001/restaurantMenu', {
            params: {
                menuItemId: itemId,
            }
        }).then(response => {
            console.log("Response on delete menu Item details: ");
            console.log(response.data.responseMessage);
            if (response.status === 200) {
                console.log("Successfully deleted menu Item");
            } else {
                console.log("Status Code: ", response.status);
                console.log(response.data.responseMessage);
            }

            let restaurantId = this.props.restaurantId;
            console.log("Getting details of restaurant with ID: " + restaurantId);
            axios.defaults.withCredentials = true;

            // refresh state with existing items
            axios.defaults.withCredentials = true;
            axios.get('http://localhost:3001/menu', {
                params: {
                    restaurantId: restaurantId
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log('response from DB: ');
                        console.log(response.data);
                        menu.push(...response.data.menu);
                        sections.push(...response.data.sections);
                    } else {
                        console.log("Status Code: ", response.status);
                        console.log(response.data.responseMessage);
                    }
                    this.setState({
                        items: menu,
                        sections: sections,
                    })
                }).catch(error => {
                    console.log(error);
                });

        }).catch(error => {
            console.log(error);
        });
    }

    closeSectionAddModal = () => {
        this.setState({
            showMenuSectionAddModal: false,
        })
    }

    saveSectionAddModal = (sectionName) => {
        // debugger;
        let restaurantId = cookie.load('cookie1');
        console.log("restaurant Id")
        console.log(restaurantId)
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/restaurantSection', {
            restaurantId: restaurantId,
            sectionName: sectionName,
        }).then(response => {
            if (response.status === 200) {
                console.log('Successfully added the section');
                // alert('successfully added the section');
                this.setState({
                    sections: this.state.sections.concat(sectionName),
                    showMenuSectionAddModal: false,
                })
            } else {
                alert('failed to add section');
                console.log('Failed to add the section');
            }
        }).catch(error => {
            console.log(error);
        })
    }

    closeMenuItemAddModal = () => {
        this.setState({
            showMenuItemAddModal: false,
        })
    }

    saveMenuItemAddModal = (addItemState) => {
        // debugger
        let restaurantId = this.state.restaurantId;
        let sections = [];
        let menu = [];
        //// debugger;
        const data = {
            restaurantId: cookie.load('cookie1'),
            menuItemName: addItemState.itemName,
            menuItemDesc: addItemState.itemDesc,
            menuItemImage: addItemState.itemImage,
            menuItemPrice: addItemState.itemPrice,
            menuItemSection: addItemState.itemSection,
        }
        axios.defaults.withCredentials = true;
        console.log("data front end")
        console.log(data)
        axios.post('http://localhost:3001/restaurantMenu', data)
            .then(response => {
                if (response.status === 200) {
                    console.log('successfully added menu item to restaurants menu' + response.data.menuItemUniqueId);
                    console.log(response.data.responseMessage);
                    let itemId = response.data.menuItemUniqueId;
                    let id = cookie.load("cookie1")
                    // debugger
                    console.log("Upload Image Now")
                    console.log(addItemState.itemImage.File)
                    let formData = new FormData();
                    formData.append('id', cookie.load("cookie1"));
                    formData.append('table', "restaurantMenuTable");
                    formData.append('selectedFile', addItemState.itemImage);
                    formData.append('sectionName',addItemState.itemSection)
                    formData.append('itemName',addItemState.itemName)

                    axios({
                        method: 'post',
                        url: 'http://localhost:3001/img/upload ',
                        data: formData,
                        config: { headers: { 'Content-Type': 'multipart/form-data' } }
                    })
                        .then((response) => {
                            if (response.status >= 500) {
                                throw new Error("Bad response from server");
                            }
                            console.log(response);
                            this.setState({
                                showMenuItemAddModal: false,
                            })
                            return response.data;
                        })
                        .then((responseData) => {
                            // alert(responseData.responseMessage);
                            console.log('Menu Item Image Added');
                        }).catch(function (err) {
                            console.log(err)
                        });

                    // Update all menu items in this component's state.
                    let anItem = {
                        itemName: addItemState.itemName,
                        itemDesc: addItemState.itemDesc,
                        itemImage: addItemState.itemImage,
                        itemPrice: addItemState.itemPrice,
                        itemSection: addItemState.itemSection,
                    }

                    this.setState({
                        items: this.state.items.concat(anItem),
                        showMenuItemAddModal: false,
                    })

                    // refresh state with existing items
                    axios.defaults.withCredentials = true;
                    axios.get('http://localhost:3001/menu', {
                        params: {
                            restaurantId: restaurantId
                        }
                    })
                        .then(response => {
                            if (response.status === 200) {
                                console.log('response from DB: ');
                                console.log(response.data);
                                menu.push(...response.data.menu);
                                sections.push(...response.data.sections);
                            } else {
                                console.log("Status Code: ", response.status);
                                console.log(response.data.responseMessage);
                            }
                            this.setState({
                                items: menu,
                                sections: sections,

                            })
                        }).catch(error => {
                            console.log(error);
                        });
                } else {
                    console.log("Status Code: ", response.status);
                    console.log(response.data.responseMessage);
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    showMenuItemAddModal: false,
                })
            });
    }

    render() {
        let MenuSectionsDOM = [];
        let index = 0;
        let sections = this.state.sections;
        let allItems = this.state.items;
        console.log('printing state of menu-page')
        console.log(this.state);
        // Go through appetizers first
        while (index < sections.length) {
            /**
             * For each section
             * find all items that match this sectionName
             * add those items under this section
             * add "add items" button at the end
             * add "delete section" button at the end
             */
            let sectionName = sections[index];
            let sectionData = [];
            for (let index = 0; index < allItems.length;) {
                let threeMenuItemsDOM = [];
                for (let curColumn = 0; curColumn < 3 && index < allItems.length; curColumn++ , index++) {
                    let anItem = allItems[index];
                    // debugger
                    if (anItem.itemSection === sectionName) {
                        console.log("creating cards for " + anItem.itemName)
                        threeMenuItemsDOM.push(
                            <OwnerMenuItemCard
                                itemName={anItem.itemName}
                                itemPrice={anItem.itemPrice}
                                itemId={anItem.itemId}
                                itemSection={anItem.itemSection}
                                itemImage={anItem.itemImage}
                                deleteItemButtonHandler={this.deleteItemButtonHandler}
                            />
                        );
                    }
                }
                if (threeMenuItemsDOM.length > 0) {
                    sectionData.push(
                        <Row style={{
                            width: "inehrit",
                            height: "inherit",
                            marginLeft: "5px",
                        }}>
                            <CardDeck style={{
                                flexFlow: 'wrap',
                                width: '420px',
                                height: '200px',
                                flexDirection: 'column',
                                flexBasis: "auto",
                            }}>
                                {threeMenuItemsDOM}
                            </CardDeck>
                        </Row>
                    );
                }
            }

            // TODO: Add "Add Items Button"
            sectionData.push(
                <Button variant="success" size="sm" onClick={(e) => {
                    this.addItemsButtonHandler(e, sectionName)
                }}
                    style={{
                        width: "250px",
                        fontSize: "20px",
                        marginLeft: '5px',
                        marginTop: '40px',
                        // paddingTop: '15px'
                    }}>Add Items to {sectionName} </Button>

            )
            MenuSectionsDOM.push(
                <Row style={{
                    marginTop: '5px',
                    marginBottom: '40px',
                    boxShadow: "0 0 0 1px rgba(67,41,163,.08), 0 1px 5px 0 rgba(67,41,163,.08)",
                    borderRadius: "3px",
                }}>
                    <div style={{
                        width: "100%",
                        height: "100%",
                        paddingBottom: '5px',
                        marginTop: '10px'
                    }}>
                        <Container style={{
                            maxWidth: "100%"
                        }}>
                            <Row style={{
                                width: "100%",
                            }}>
                                <Col sm={10}>
                                    <h1 style={{
                                        fontSize: "30px",
                                        height: "40px"
                                    }}>{sectionName}</h1>
                                </Col>
                                <Col sm={2}>
                                    <Button variant="danger" onClick={(e) => {
                                        this.deleteSectionButtonHandler(e, sectionName)
                                    }} style={{
                                        width: "175px",
                                        fontSize: "20px",
                                    }}>Delete Section</Button>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        paddingBottom: '20px',
                    }}>
                        {sectionData}
                    </div>
                </Row>
            );
            index = index + 1;
        }

        let addSectionDOM = [];
        addSectionDOM.push(
            <div style={{
                width: "100%",
                height: "100%",
                paddingBottom: '5px',
                marginTop: '10px'
            }}>
                <Container style={{
                    maxWidth: "100%"
                }}>
                    <Row style={{
                        width: "100%",
                    }}>
                        <Col sm={5}></Col>
                        <Col sm={2}>
                            <Button variant="success" onClick={(e) => {
                                this.addSectionButtonHandler()
                            }} style={{
                                width: "175px",
                                fontSize: "20px",
                            }}>Add Section</Button></Col>
                        <Col sm={5}></Col>

                    </Row>
                </Container>
            </div>
        );
        let MenuItemAddModalDOM = [];
        if (this.state.showMenuItemAddModal) {
            MenuItemAddModalDOM = <MenuItemAddModal
                onClose={this.closeMenuItemAddModal}
                onSave={this.saveMenuItemAddModal}
                sectionName={this.state.itemAddModalSection}
            />;
        }

        let MenuSectionAddModalDOM = [];
        if (this.state.showMenuSectionAddModal) {
            MenuSectionAddModalDOM = <MenuSectionAddModal
                onClose={this.closeSectionAddModal}
                onSave={this.saveSectionAddModal}
            />;
        }

        return (
            <div style={{
                width: "100%",
                height: "100%",
                backgroundColor: "inherit",
            }}>
                {/* <p>THIS IS MENU PAGE</p>  */}
                <Container style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                }}>
                    {MenuSectionsDOM}
                    {addSectionDOM}
                    {MenuItemAddModalDOM}
                    {MenuSectionAddModalDOM}
                </Container>
            </div>
        )
    }
}

export default MenuPage