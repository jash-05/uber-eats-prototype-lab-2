import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import server_IP from '../config/server.config.js';

// Define a Login Component
class WelcomeUser extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            user_type: ''
        }
        // //Bind the handlers to this class
        this.userTypeChangeHandler = this.userTypeChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    userTypeChangeHandler = (e) => {
        this.setState({
            userType: e.target.value
        })
    }

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        console.log(`First name: ${this.state.first_name}, Last name: ${this.state.last_name}, Email: ${this.state.email}, Password: ${this.state.password}, Country: ${this.state.country}, Phone number: ${this.state.phone_number}`)
        // var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            first_name : this.state.first_name,
            last_name: this.state.last_name,
            email_id: this.state.email,
            pass: this.state.password,
            country: this.state.country,
            phone_number: this.state.phone_number
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`http://${server_IP}:3001/customers`,data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request");
                    console.log(response);
                    console.log('Cookie status: ', cookie.load('cookie'));
                } else{
                    console.log("Unsuccessful request");
                    console.log(response);
                }
            });
    }
    render(){
        return(
            <Container fluid style={{backgroundImage: `url('https://duyt4h9nfnj50.cloudfront.net/resized/70c5a078c4f5cbba5e1d1b49d69e57b8-w2880-8a.jpg')`, height:"100vh", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
                <Navbar/>
                {/* <Container className="mx-auto p-5">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Uber_Eats_2020_logo.svg/1280px-Uber_Eats_2020_logo.svg.png" fluid/>                    
                </Container> */}
                <Container className="mt-5 bg-light p-5 rounded">
                    <Row>
                        <p className="display-6">Welcome to Uber Eats! Are you a customer or restaurant owner?</p>
                    </Row>
                    <Row>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>I am a Customer</Card.Title>
                                    <Link to="/customerLogin"><Button variant="success">Login</Button></Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>I am a Restaurant owner</Card.Title>
                                    <Link to="/restaurantLogin"><Button variant="success">Login</Button></Link>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                </Container>
            </Container>
        )
    }
}
//export Login Component
export default WelcomeUser;