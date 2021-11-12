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
import ListGroup from 'react-bootstrap/ListGroup';
import Navbar from './navbar'
import server_IP from '../config/server.config.js';

// Define a Login Component
class CustomerPublicProfile extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
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
        this.fetchCustomerDetails = this.fetchCustomerDetails.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        this.fetchCustomerDetails();
    }
    fetchCustomerDetails = async () => {
        try {
            console.log('Fetching customer details')
            console.log(this.props.match)
            const response = await axios.get(`http://${server_IP}:3001/customers/${this.props.match.params.customer_ID}`);
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
                    line1: response.data.line1,
                    line2: response.data.line2,
                    city: response.data.city,
                    state_name: response.data.state_name,
                    zipcode: response.data.zipcode,
                    country: response.data.country,
                    phone_number: response.data.phone_number,
                    dob: response.data.dob,
                    nickname: response.data.nickname
                })
            } else{
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    render(){
        console.log("Rendering")
        return(
            <Container>
                <Navbar/>
                <Container className="mt-5">
                    <Row>
                        <Col xs={3} className="mx-2 mt-5 mb-4">
                            <Image src={this.state.const_profile_picture} style={{ width: '20rem', height: '10rem'}}></Image>
                        </Col>
                        <Col xs={7} className="mx-auto">
                            <Row className="display-2 mt-5 mb-4">
                            {`${this.state.const_customer_name}`}
                            </Row>
                            <Row className="my-2 lead">
                            {`${this.state.const_about}`}
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <Container className="mt-5 mx-5 px-5">
                    <Row className="display-6 mt-5">Basic details</Row>
                    <hr></hr>
                    <Row className="my-3 lead">{(this.state.const_customer_name ? `Full name: ${this.state.const_customer_name}` : "")}</Row>
                    <Row className="my-3 lead">{(this.state.nickname ? `Nickname: ${this.state.nickname}` : "")}</Row>
                    <Row className="my-3 lead">{(this.state.dob ? `Date of birth: ${this.state.dob}` : "")}</Row>
                    <Row className="my-3 lead">{(this.state.phone_number ? `Phone number: (${this.state.phone_number.slice(0,3)}) ${this.state.phone_number.slice(3,6)}-${this.state.phone_number.slice(6,10)}` : "")}</Row>
                    <Row className="my-5"></Row>
                    <Row className="display-6 mt-5">Address details</Row>
                    <hr></hr>
                    <Row className="my-3 lead">{(this.state.line1 ? `Street Address: ${this.state.line1} ${this.state.line2}` : "")}</Row>
                    <Row className="my-3 lead">{(this.state.city ? `City: ${this.state.city}` : "")}</Row>
                    <Row className="my-3 lead">{(this.state.state_name ? `State: ${this.state.state_name}` : "")}</Row>
                    <Row className="my-3 lead">{(this.state.zipcode ? `Postal code: ${this.state.zipcode}` : "")}</Row>
                    <Row className="my-3 lead">{(this.state.country ? `Country: ${this.state.country}` : "")}</Row>
                </Container>

            </Container>
            
        )
    }
}

export default CustomerPublicProfile;