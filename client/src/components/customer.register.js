import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';
import ReactS3 from 'react-s3';
import s3_config from '../config/s3.config.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Redirect} from 'react-router';
import Navbar from './navbar';
import { Link } from 'react-router-dom';
import server_IP from '../config/server.config.js';
const {v4: uuidv4} = require('uuid');

// Define a Login Component
class CustomerRegister extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            address_line_1: "",
            address_line_2: "",
            city: "",
            state: "",
            zip: "",
            country: "Select country",
            phone_number: "",
            dob: "",
            profile_picture: "",
            profile_picture_file: ""
        }
        // //Bind the handlers to this class
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.addressLine1ChangeHandler = this.addressLine1ChangeHandler.bind(this);
        this.addressLine2ChangeHandler = this.addressLine2ChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.zipChangeHandler = this.zipChangeHandler.bind(this);
        this.countryChangeHandler = this.countryChangeHandler.bind(this);
        this.phoneNumberChangeHandler = this.phoneNumberChangeHandler.bind(this);
        this.profilePictureChangeHandler = this.profilePictureChangeHandler.bind(this);
        this.dobChangeHandler = this.dobChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
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
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    addressLine1ChangeHandler = (e) => {
        this.setState({
            address_line_1: e.target.value
        })
    }
    addressLine2ChangeHandler = e => {
        this.setState({
            address_line_2: e.target.value
        })
    }
    cityChangeHandler = e => {
        this.setState({
            city: e.target.value
        })
    }
    stateChangeHandler = e => {
        this.setState({
            state: e.target.value
        })
    }
    zipChangeHandler = e => {
        this.setState({
            zip: e.target.value
        })
    }
    countryChangeHandler = (e) => {
        this.setState({
            country: e
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
    //submit Login handler to send a request to the node backend
    submitLogin = async (e) => {
        //prevent page from refresh
        e.preventDefault();
        await this.uploadImageToS3()
        const data = {
            customer_ID: uuidv4(),
            first_name : this.state.first_name,
            last_name: this.state.last_name,
            email_id: this.state.email,
            pass: this.state.password,
            country: this.state.country,
            phone_number: this.state.phone_number,
            dob: this.state.dob,
            profile_picture: this.state.profile_picture,
            nickname: this.state.nickname,
            addresses: [
                {
                    address_type: "primary",
                    line1: this.state.address_line_1,
                    line2: this.state.address_line_2,
                    city: this.state.city,
                    state_name: this.state.state,
                    zipcode: this.state.zip
                }
            ]
        }
        console.log(data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`http://${server_IP}:3001/customers`,data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request");
                    console.log(response.data);
                } else{
                    console.log("Unsuccessful request");
                    console.log(response);
                }
        });
    }
    render(){
        console.log('RENDERING')
        let redirectVar = null;
        if(localStorage.getItem('customer')){
            redirectVar = <Redirect to= "/dashboard"/>
        }
        return(
            <Container fluid style={{backgroundImage: `url('https://d1ralsognjng37.cloudfront.net/95eaddee-6c8f-4375-ab3f-7e88071518f9.jpeg')`, height:"100vh", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
                    {redirectVar}
                    <Navbar/>
                {/* <Container className="mx-auto p-5">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Uber_Eats_2020_logo.svg/1280px-Uber_Eats_2020_logo.svg.png" fluid/>                    
                </Container> */}
                <Container className="mt-5 bg-light p-5 rounded">
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control onChange={this.firstNameChangeHandler} type="text" placeholder="Enter your first name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control onChange={this.lastNameChangeHandler} type="text" placeholder="Enter your last name" />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={this.emailChangeHandler} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={this.passwordChangeHandler} type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridAddress1">
                            <Form.Label>Street Address</Form.Label>
                            <Form.Control onChange={this.addressLine1ChangeHandler} placeholder="Eg: 1234 Main St" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridAddress2">
                            {/* <Form.Label>Street Address Line 2 (optional)</Form.Label> */}
                            <Form.Control onChange={this.addressLine2ChangeHandler} placeholder="Apartment, studio, or floor (optional)" />
                        </Form.Group>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control onChange={this.cityChangeHandler} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>State</Form.Label>
                            <Form.Control onChange={this.stateChangeHandler} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                            <Form.Label>Zip</Form.Label>
                            <Form.Control onChange={this.zipChangeHandler} type="number" />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formBasicCountry">
                            <Form.Label>Country</Form.Label>
                            <DropdownButton onSelect={this.countryChangeHandler} className="mb-3" id="dropdown-basic-button" size="sm" title={this.state.country}>
                                <Dropdown.Item eventKey="USA">USA</Dropdown.Item>
                                <Dropdown.Item eventKey="Canada">Canada</Dropdown.Item>
                                <Dropdown.Item eventKey="Mexico">Mexico</Dropdown.Item>
                            </DropdownButton>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control onChange={this.phoneNumberChangeHandler} type="number" placeholder="Enter your 10-digit phone number" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>Date of birth</Form.Label>
                            <Form.Control onChange={this.dobChangeHandler} type="text" placeholder="MM/DD/YYYY" />
                        </Form.Group>

                        <Form.Group controlId="formCoverImage" className="mb-3">
                            <Form.Label>Upload your profile picture</Form.Label>
                            <Form.Control onChange={this.profilePictureChangeHandler} type="file" />
                        </Form.Group>

                        <div className="d-grid gap-2 mb-5">
                            <Button onClick={this.submitLogin} variant="primary" type="submit">
                                Create new account
                            </Button>
                        </div>

                        <div className="d-flex flex-row mt-3">
                            <div className="">Already use Uber Eats?</div>
                            <div className="mx-2"><Link to="/customerLogin" style={{textDecoration: 'none'}}>
                            <p style={{color: "#21b53f"}}>Sign in</p></Link></div>
                        </div>
                    </Form>
                </Container>
                </Container>
        )
    }
}
//export Login Component
export default CustomerRegister;