import React, { Component } from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import { Button } from 'react-bootstrap';




class OwnerPicture extends Component {

    constructor(props) {
        super(props)

        this.state = {
            readonly: '',
            isDisabled: false,
            showButton: true,
            selectedFile: '',
            preview: null,
            src: '',
            img: null,
            imgName: null
        }

        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onPicUpload = this.onPicUpload.bind(this)

    }

    componentWillMount() {
        var emailId = cookie.load('cookie1');
        var id = cookie.load('cookie2');
        console.log(id+ "cookie2")
        if (emailId) {
            console.log("able to read cookie");
            let name = cookie.load('cookie3');
            console.log(name);
            axios({
                method: 'get',
                url: 'http://18.220.10.109:3001/profile/img',
                params: { "id": id, "table": "restaurantTable" },
                config: { headers: { 'Content-Type': 'application/json' } }
            })
                .then((response) => {
                    if (response.status >= 500) {
                        throw new Error("Bad response from server");
                    }
                    console.log(response);
                    return response.data;
                })
                .then((responseData) => {
                    console.log(responseData.base64str);
                    this.setState({
                        img: "data:image/png;base64," + responseData.base64str
                    });
                }).catch(function (err) {
                    console.log(err)
                });
        }


    }


    onClose() {
        this.setState({ preview: null })
    }

    onCrop(preview) {
        this.setState({ preview });
        console.log("preview", this.state.preview);
    }

    logout = () => {
        localStorage.clear();
        console.log("All cookies removed!");
        window.location = "/";
    }

    onPicUpload = async (e) => {
        console.log("on pic upload")
        this.setState({ selectedFile: e.target.files[0] });
        var id = cookie.load('cookie2');
        var emailId = cookie.load('cookie1');
        let formData = new FormData();
        formData.append('id', id);
        formData.append('table', "restaurantTable");
        formData.append('selectedFile', e.target.files[0]);

        await axios({
            method: 'post',
            url: 'http://18.220.10.109:3001/img/upload ',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                alert(responseData.responseMessage);
                axios({
                    method: 'get',
                    url: 'http://18.220.10.109:3001/profile/img',
                    params: { "id": id, "table": "restaurantTable" },
                    config: { headers: { 'Content-Type': 'application/json' } }
                })
                    .then((response) => {
                        if (response.status >= 500) {
                            throw new Error("Bad response from server");
                        }
                        console.log(response);
                        return response.data;
                    })
                    .then((responseData) => {
                        console.log(responseData.base64str);
                        this.setState({
                            img: "data:image/png;base64," + responseData.base64str
                        });
                    }).catch(function (err) {
                        console.log(err)
                    });
            
                //window.location.reload();
            }).catch(function (err) {
                console.log(err)
            });
    }

    updateProfilePic = async (e) => {
        //console.log(e.target.files[0]);
        this.setState({ selectedFile: e.target.files[0] });
        //console.log("state",this.state.selectedFile);

        var id = cookie.load('cookie2');
        var emailId = cookie.load('cookie1');
        let formData = new FormData();
        formData.append('id', id);
        formData.append('table', "restaurantTable");
        formData.append('selectedFile', e.target.files[0]);

        await axios({
            method: 'post',
            url: 'http://18.220.10.109:3001/img/upload',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                alert(responseData.responseMessage);
                this.setState({
                    img: "data:image/png;base64," + responseData.base64str
                });
                //window.location.reload();
            }).catch(function (err) {
                console.log(err)
            });
    }



    render() {
        let redirectVar = null;
        if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/BuyerSignIn" />;
        }
        let divButton = null;
        if (this.state.showButton) {
            divButton = <button type="submit" className="btn btn-primary update-button" style={{marginLeft:"6.5em"}} >Update Profile</button>
        }
        let defaultIMGDiv = (<div className='buttons fadein'>
        <div className='button'>
            <label htmlFor='single'>
                <div style={{ fontSize: "130px", marginLeft: "0.25em" }}>
                    <i className="fa fa-user fa-10x"></i>
                </div>
            </label>
        </div>

    </div>);
    let imgDiv
    if (this.state.img != null) {
        
        console.log("has profile pic");
        imgDiv =  (<div className='buttons fadein'>
        <div className='button'>
            <label htmlFor='single'>
                
                    <img src={this.state.img} alt="Profile pic"  height= "400" width= "600" ></img>

               
            </label>
            {/* <input type='file' id='single' name="selectedFile" onChange={this.onPicUpload} style={{ height: "0px", width: "0px" }} accept="image/x-png,image/gif,image/jpeg" /> */}
        </div>

    </div>);
        }
        else{
            imgDiv = defaultIMGDiv;
        }
        return (

            <div>
                <Button onClick = {this.logout}>
                    Logout
                </Button>

                Profile Picture page
                    

                {imgDiv}
               
                <input type='file' id='single' name="selectedFile" onChange={this.onPicUpload} style={{ height: "0px", width: "0px" }} accept="image/x-png,image/gif,image/jpeg" />

                {divButton}

                <br>
                </br>
                <br></br>
            </div>
        )

    }
}




export default OwnerPicture;