import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Link, Redirect } from 'react-router-dom';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ReactS3 from 'react-s3';
import s3_config from '../config/s3.config.js';
import { object } from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormSelect from 'react-bootstrap/FormSelect';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Navbar from './navbar';
import server_IP from '../config/server.config.js';

// Define a Login Component
class CustomerProfile extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            customer_ID: null,
            const_customer_name: "",
            first_name: "",
            last_name: "",
            line1: "",
            line2: "",
            city: "",
            state_name: "",
            zipcode: "",
            country: "",
            phone_number: "",
            profile_picture: "",
            const_profile_picture: "",
            profile_picture_file: "",
            about: "",
            const_about: "",
            dob: "",
            nickname: ""
        }
        //Bind the handlers to this class
        this.setCustomerState = this.setCustomerState.bind(this);
        this.fetchCustomerDetails = this.fetchCustomerDetails.bind(this);
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.addressLine1ChangeHandler = this.addressLine1ChangeHandler.bind(this);
        this.addressLine2ChangeHandler = this.addressLine2ChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.zipChangeHandler = this.zipChangeHandler.bind(this);
        this.phoneNumberChangeHandler = this.phoneNumberChangeHandler.bind(this);
        this.profilePictureChangeHandler = this.profilePictureChangeHandler.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        this.setCustomerState();
        this.fetchCustomerDetails();
    }
    setCustomerState = async () => {
        if (cookie.load('customer')) {
            this.setState({
                customer_ID: cookie.load('customer')
            })
        }
    }
    fetchCustomerDetails = async () => {
        try {
            await this.setCustomerState();
            console.log('Fetching customer details')
            const response = await axios.get(`http://${server_IP}:3001/customers/${this.state.customer_ID}`);
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                this.setState({
                    const_customer_name: response.data.first_name + " " + response.data.last_name,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    const_profile_picture: response.data.profile_picture,
                    profile_picture: response.data.profile_picture,
                    about: response.data.about,
                    const_about: response.data.about,
                    line1: response.data.addresses[0].line1,
                    line2: response.data.addresses[0].line2,
                    city: response.data.addresses[0].city,
                    state_name: response.data.addresses[0].state_name,
                    zipcode: response.data.addresses[0].zipcode,
                    country: response.data.country,
                    phone_number: response.data.phone_number,
                    dob: response.data.dob,
                    nickname: response.data.nickname
                })
                console.log('Cookie status: ', cookie.load('cookie'));
            } else{
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    nicknameChangeHandler = (e) => {
        this.setState({
            nickname: e.target.value
        })
    }
    firstNameChangeHandler = (e) => {
        this.setState({
            first_name: e.target.value
        })
    }
    lastNameChangeHandler = (e) => {
        this.setState({
            last_name: e.target.value
        })
    }
    aboutChangeHandler = (e) => {
        this.setState({
            about: e.target.value
        })
    }
    addressLine1ChangeHandler = (e) => {
        this.setState({
            line1: e.target.value
        })
    }
    addressLine2ChangeHandler = e => {
        this.setState({
            line2: e.target.value
        })
    }
    cityChangeHandler = e => {
        this.setState({
            city: e.target.value
        })
    }
    stateChangeHandler = e => {
        this.setState({
            state_name: e.target.value
        })
    }
    zipChangeHandler = e => {
        this.setState({
            zipcode: e.target.value
        })
    }
    phoneNumberChangeHandler = (e) => {
        this.setState({
            phone_number: e.target.value
        })
    }
    dobChangeHandler = (e) => {
        this.setState({
            dob: e.target.value
        })
    }
    profilePictureChangeHandler = e => {
        const file = e.target.files[0]
        console.log(e.target.files[0])
        this.setState({
            profile_picture_file: file
        })
    }
    uploadImageToS3 = async () => {
        if (this.state.profile_picture_file){
            try {
                const data = await ReactS3.uploadFile(this.state.profile_picture_file, s3_config)
                this.setState({
                    profile_picture: data.location
                })
            } catch (err) {
                console.error(err);
            }
            
        }
    }
    submitUpdate = async (e) => {
        //prevent page from refresh
        e.preventDefault();

        await this.uploadImageToS3()

        const customer_data = {
            customer_ID: this.state.customer_ID,
            nickname: this.state.nickname,
            first_name : this.state.first_name,
            last_name: this.state.last_name,
            about: this.state.about,
            phone_number: this.state.phone_number,
            dob: this.state.dob,
            profile_picture: this.state.profile_picture,
        }
        console.log(customer_data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        // make a post request with the user data
        axios.put(`http://${server_IP}:3001/customers/${this.state.customer_ID}`,customer_data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request for storing restaurant info");
                    console.log(response);
                    console.log('Cookie status: ', cookie.load('cookie'));
                    const address_data = {
                        customer_ID: this.state.customer_ID,
                        line1: this.state.line1,
                        line2: this.state.line2,
                        city: this.state.city,
                        state_name: this.state.state_name,
                        zipcode: this.state.zipcode
                    }
                    axios.put(`http://${server_IP}:3001/customerAddress`, address_data)
                    .then(resp => {
                        console.log("Status Code: ", resp.status);
                        if (resp.status === 200) {
                            console.log("Successful request for storing customer address");
                            console.log(resp);
                            this.fetchCustomerDetails();
                        } else {
                            console.log("Unsuccessful request for storing customer address");
                            console.log(resp)
                        }
                    })
                } else{
                    console.log("Unsuccessful request for storing customer info");
                    console.log(response);
                }
            });
    }
    render(){
        console.log("Rendering")
        let redirectVar = null;
        if (!cookie.load('customer')){
            redirectVar = <Redirect to="/welcomeUser"/>
        }
        return(
            <Container fluid>
                {redirectVar}
                <Navbar/>
                <Container>
                    <Row>
                        <Col xs={3} className="mx-2 my-4">
                            <Image src={this.state.const_profile_picture} style={{ width: '20rem', height: '10rem'}}></Image>
                        </Col>
                        <Col xs={7} className="mx-auto">
                            <Row className="h2 mt-5 mb-4">
                            {`Welcome, ${this.state.const_customer_name}`}
                            </Row>
                            <Row className="my-2">
                            {`${this.state.const_about}`}
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <Container className="mt-5">
                    <p className="h4 my-3">Feel free to update any of your details as you like!</p>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>Nickname</Form.Label>
                            <Form.Control onChange={this.nicknameChangeHandler} type="text" defaultValue={this.state.nickname} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicRestaurantName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control onChange={this.firstNameChangeHandler} type="text" defaultValue={this.state.first_name} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control onChange={this.lastNameChangeHandler} type="text" defaultValue={this.state.last_name} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>About</Form.Label>
                            <Form.Control onChange={this.aboutChangeHandler} type="text" defaultValue={this.state.about} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridAddress1">
                            <Form.Label>Street Address</Form.Label>
                            <Form.Control onChange={this.addressLine1ChangeHandler} defaultValue={this.state.line1} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridAddress2">
                            <Form.Control onChange={this.addressLine2ChangeHandler} defaultValue={this.state.line2} />
                        </Form.Group>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control onChange={this.cityChangeHandler} defaultValue={this.state.city}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>State</Form.Label>
                            <Form.Control onChange={this.stateChangeHandler} defaultValue={this.state.state_name}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                            <Form.Label>Zip</Form.Label>
                            <Form.Control onChange={this.zipChangeHandler} type="number" defaultValue={this.state.zipcode}/>
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control onChange={this.phoneNumberChangeHandler} type="number" defaultValue={this.state.phone_number} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control onChange={this.dobChangeHandler} type="text" defaultValue={this.state.dob} />
                        </Form.Group>
                                 
                        <Form.Group controlId="formCoverImage" className="mb-3">
                            <Form.Label>Update your profile picture</Form.Label>
                            <Form.Control onChange={this.profilePictureChangeHandler} type="file"/>
                        </Form.Group>

                        <div className="d-grid gap-2 mb-5">
                            <Button onClick={this.submitUpdate} variant="dark" type="submit">
                                Save
                            </Button>
                        </div>
                    </Form>
                </Container>

            </Container>
            
        )
    }
}

export default CustomerProfile;