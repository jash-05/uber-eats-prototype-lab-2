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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactS3 from 'react-s3';
import s3_config from '../config/s3.config.js';
import {Redirect} from 'react-router';
import RestaurantNavbar from './restaurant.navbar';
import { Link } from 'react-router-dom';
import server_IP from '../config/server.config.js';

// Define a Login Component
class RestaurantRegister extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_name: "",
            owner_name: "",
            email: "",
            pass: "",
            address_line_1: "",
            address_line_2: "",
            city: "",
            state: "",
            zip: "",
            country: "Select country",
            phone_number: "",
            vegetarian: false,
            non_vegetarian: true,
            vegan: false,
            delivery: true,
            pickup: false,
            uploaded_image: "",
            cover_image: "",
            opening_time: "",
            closing_time: "",
            about: ""
        }
        // //Bind the handlers to this class
        this.restaurantNameChangeHandler = this.restaurantNameChangeHandler.bind(this);
        this.ownerNameChangeHandler = this.ownerNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.addressLine1ChangeHandler = this.addressLine1ChangeHandler.bind(this);
        this.addressLine2ChangeHandler = this.addressLine2ChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.zipChangeHandler = this.zipChangeHandler.bind(this);
        this.countryChangeHandler = this.countryChangeHandler.bind(this);
        this.phoneNumberChangeHandler = this.phoneNumberChangeHandler.bind(this);
        this.vegetarianChangeHandler = this.vegetarianChangeHandler.bind(this);
        this.nonVegetarianChangeHandler = this.nonVegetarianChangeHandler.bind(this);
        this.veganChangeHandler = this.veganChangeHandler.bind(this);
        this.deliveryChangeHandler = this.deliveryChangeHandler.bind(this);
        this.pickupChangeHandler = this.pickupChangeHandler.bind(this);
        this.coverImageChangeHandler = this.coverImageChangeHandler.bind(this);
        
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })        
    }
    restaurantNameChangeHandler = (e) => {
        this.setState({
            restaurant_name: e.target.value
        })
    }
    ownerNameChangeHandler = (e) => {
        this.setState({
            owner_name: e.target.value
        })
    }
    aboutChangeHandler = (e) => {
        this.setState({
            about: e.target.value
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
    vegetarianChangeHandler = (e) => {
        this.setState({
            vegetarian: e.target.checked
        })
    }
    nonVegetarianChangeHandler = e => {
        this.setState({
            non_vegetarian: e.target.checked
        })
    }
    veganChangeHandler = e => {
        this.setState({
            vegan: e.target.checked
        })
    }
    deliveryChangeHandler = e => {
        this.setState({
            delivery: e.target.checked
        })
    }
    pickupChangeHandler = e => {
        this.setState({
            pickup: e.target.checked
        })
    }
    coverImageChangeHandler = e => {
        const file = e.target.files[0]
        console.log(e.target.files[0])
        ReactS3.uploadFile(file, s3_config)
        .then((data) => {
            this.setState({
                cover_image: data.location
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
    openingTimeChangeHandler = e => {
        this.setState({
            opening_time: e.target.value
        })
    }
    closingTimeChangeHandler = e => {
        this.setState({
            closing_time: e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        console.log(`Restaurant name: ${this.state.restaurant_name}, Owner name: ${this.state.owner_name}, Email: ${this.state.email}, Password: ${this.state.password}, Country: ${this.state.country}, Phone number: ${this.state.phone_number}`);
        // var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const restaurant_data = {
            restaurant_name : this.state.restaurant_name,
            owner_name: this.state.owner_name,
            email_id: this.state.email,
            pass: this.state.password,
            country: this.state.country,
            phone_number: this.state.phone_number,
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup,
            cover_image: this.state.cover_image,
            opening_time: this.state.opening_time,
            closing_time: this.state.closing_time,
            about: this.state.about
        }
        console.log(restaurant_data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        // make a post request with the user data
        axios.post(`http://${server_IP}:3001/restaurants`,restaurant_data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request for storing restaurant info");
                    console.log(response);
                    const address_data = {
                        restaurant_ID: response.data.restaurant_ID,
                        address_line_1: this.state.address_line_1,
                        address_line_2: this.state.address_line_2,
                        city: this.state.city,
                        state: this.state.state,
                        zip: this.state.zip
                    }
                    axios.post(`http://${server_IP}:3001/restaurantAddress`, address_data)
                    .then(resp => {
                        console.log("Status Code: ", resp.status);
                        if (resp.status === 200) {
                            console.log("Successful request for storing restaurant address");
                            console.log(resp);
                            window.location.reload(false);
                        } else {
                            console.log("Unsuccessful request for storing restaurant address");
                            console.log(resp)
                        }
                    })
                } else{
                    console.log("Unsuccessful request for storing restaurant info");
                    console.log(response);
                }
            });
    }
    render(){
        console.log('RENDERING')
        let redirectVar = null;
        if(cookie.load('restaurant')){
            redirectVar = <Redirect to= "/restaurantProfile"/>
        }
        return(
            <Container fluid style={{backgroundImage: `url('https://images.unsplash.com/photo-1614946569026-d3044c2983e3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80')`, height:"100vh", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
                {redirectVar}
                <RestaurantNavbar/>
                {/* <Container className="mx-auto p-5">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Uber_Eats_2020_logo.svg/1280px-Uber_Eats_2020_logo.svg.png" fluid/>                    
                </Container> */}
                <Container className="mt-5 bg-light px-5 py-3 rounded">
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicRestaurantName">
                            <Form.Label>Restaurant name</Form.Label>
                            <Form.Control onChange={this.restaurantNameChangeHandler} type="text" placeholder="Enter the name of your restaurant" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>Owner name</Form.Label>
                            <Form.Control onChange={this.ownerNameChangeHandler} type="text" placeholder="Enter your full name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>About</Form.Label>
                            <Form.Control onChange={this.aboutChangeHandler} type="text" placeholder="Enter a description for your restaurant" />
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

                        <Form.Group className="mb-3" controlId="formBasicFoodOptions">
                            <Form.Label>Food Options</Form.Label>
                            <div key="inline-checkbox" className="mb-3">
                            <Form.Check
                                onChange={this.vegetarianChangeHandler}
                                inline
                                label="Vegetarian"
                                name="group1"
                                type="checkbox"
                                id="inline-checkbox-1"
                            />
                            <Form.Check
                                onChange={this.nonVegetarianChangeHandler}
                                inline
                                label="Non-Vegetarian"
                                name="group1"
                                type="checkbox"
                                id="inline-checkbox-2"
                            />
                            <Form.Check
                                onChange={this.veganChangeHandler}
                                inline
                                label="Vegan"
                                name="group1"
                                type="checkbox"
                                id="inline-checkbox-3"
                            />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicDeliveryOptions">
                            <Form.Label>Delivery Options</Form.Label>
                            <div key="inline-checkbox" className="mb-3">
                            <Form.Check
                                onChange={this.deliveryChangeHandler}
                                inline
                                label="Delivery"
                                name="group1"
                                type="checkbox"
                                id="inline-checkbox-4"
                            />
                            <Form.Check
                                onChange={this.pickupChangeHandler}
                                inline
                                label="Pickup"
                                name="group1"
                                type="checkbox"
                                id="inline-checkbox-5"
                            />
                            </div>
                        </Form.Group>                
                        
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Opening Time</Form.Label>
                            <Form.Control onChange={this.openingTimeChangeHandler} placeholder="Eg: 10:00 AM" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Closing Time</Form.Label>
                            <Form.Control onChange={this.closingTimeChangeHandler} placeholder="Eg: 09:30 PM"/>
                            </Form.Group>
                        </Row>

                        <Form.Group controlId="formCoverImage" className="mb-3">
                            <Form.Label>Upload your cover image</Form.Label>
                            <Form.Control onChange={this.coverImageChangeHandler} type="file" />
                        </Form.Group>

                        <div className="d-grid gap-2 mb-5">
                            <Button onClick={this.submitLogin} variant="primary" type="submit">
                                Add your restaurant
                            </Button>
                        </div>
                        <div className="d-flex flex-row mt-3">
                            <div className="">Already use Uber Eats?</div>
                            <div className="mx-2"><Link to="/restaurantLogin" style={{textDecoration: 'none'}}>
                            <p style={{color: "#21b53f"}}>Sign in</p></Link></div>
                        </div>
                    </Form>
                </Container>
            </Container>
        )
    }
}
//export Login Component
export default RestaurantRegister;