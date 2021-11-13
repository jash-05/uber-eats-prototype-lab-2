import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import RestaurantNavbar from './restaurant.navbar';
import { Link } from 'react-router-dom';
import server_IP from '../config/server.config.js';

// Define a Login Component
class RestaurantLogin extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email: "",
            password: "",
            authFlag: false,
            loginStatus: ""
        }
        // //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
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

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        console.log(`Email: ${this.state.email}, Password: ${this.state.password}`)
        // var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email_id: this.state.email,
            pass: this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`http://${server_IP}:3001/restaurant`,data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request");
                    console.log(response);
                    this.setState({
                        authFlag : true
                    })
                } else{
                    console.log("Unsuccessful request");
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
                <Container className="mt-5 bg-light p-5 rounded">
                    <Form>
                        
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={this.emailChangeHandler} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={this.passwordChangeHandler} type="password" placeholder="Password" />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button onClick={this.submitLogin} variant="primary" type="submit">
                                Login to your account
                            </Button>
                        </div>
                        <div className="d-flex flex-row mt-3">
                            <div className="">New to Uber Eats?</div>
                            <div className="mx-2"><Link to="/restaurantRegister" style={{textDecoration: 'none'}}>
                            <p style={{color: "#21b53f"}}>Create an account</p></Link></div>
                        </div>
                    </Form>
                </Container>
            </Container>
        )
    }
}
//export Login Component
export default RestaurantLogin;