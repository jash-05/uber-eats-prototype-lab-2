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
import RestaurantNavbar from './restaurant.navbar';
import server_IP from '../config/server.config.js';

// Define a Login Component
class EditDish extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            dish_ID: "",
            dish_name: "",
            main_ingredients: "",
            price: "",
            category_ID: "",
            dish_image: "",
            dish_image_file: ""
        }
        //Bind the handlers to this class
        this.fetchDishDetails = this.fetchDishDetails.bind(this);
        this.dishNameChangeHandler = this.dishNameChangeHandler.bind(this);
        this.mainIngredientsChangeHandler = this.mainIngredientsChangeHandler.bind(this);
        this.priceChangeHandler = this.priceChangeHandler.bind(this);
        this.categoryIDChangeHandler = this.categoryIDChangeHandler.bind(this);
        this.dishImageChangeHandler = this.dishImageChangeHandler.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        this.fetchDishDetails();
    }
    fetchDishDetails = async () => {
        try {
            console.log('Fetching dish details')
            const response = await axios.get(`http://${server_IP}:3001/dish/${this.props.match.params.dish_ID}`);
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                this.setState({
                    dish_name: response.data.dish_name,
                    main_ingredients: response.data.main_ingredients,
                    price: response.data.price,
                    category_ID: response.data.category_ID,
                    dish_image: response.data.dish_image
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
    dishNameChangeHandler = (e) => {
        this.setState({
            dish_name: e.target.value
        })
    }
    mainIngredientsChangeHandler = (e) => {
        this.setState({
            main_ingredients: e.target.value
        })
    }
    priceChangeHandler = (e) => {
        this.setState({
            price: e.target.value
        })
    }
    categoryIDChangeHandler = (e) => {
        this.setState({
            category_ID: e.target.value
        })
    }
    dishImageChangeHandler = e => {
        const file = e.target.files[0]
        console.log(e.target.files[0])
        this.setState({
            dish_image_file: file
        })
    }
    uploadImageToS3 = async () => {
        if (this.state.dish_image_file){
            try {
                const data = await ReactS3.uploadFile(this.state.dish_image_file, s3_config)
                this.setState({
                    dish_image: data.location
                })
            } catch (err) {
                console.error(err);
            } 
        }
    }
    submitUpdate = async (e) => {
        //prevent page from refresh
        e.preventDefault();
        console.log(this.state.dish_image)
        await this.uploadImageToS3()
        
        const dish_data = {
            dish_ID: this.props.match.params.dish_ID,
            dish_name: this.state.dish_name,
            main_ingredients: this.state.main_ingredients,
            price: this.state.price,
            dish_image: this.state.dish_image
        }
        console.log(dish_data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        // make a post request with the user data
        axios.put(`http://${server_IP}:3001/dish/${this.state.dish_ID}`,dish_data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request for storing restaurant info");
                    console.log(response);
                    console.log('Cookie status: ', cookie.load('cookie'));
                } else{
                    console.log("Unsuccessful request for storing customer info");
                    console.log(response);
                }
            });
    }
    render(){
        console.log("Rendering")
        let redirectVar = null;
        if (!cookie.load('restaurant')){
            redirectVar = <Redirect to="/welcomeUser"/>
        }
        return(
            <Container fluid>
                {redirectVar}
                <RestaurantNavbar/>
                <Container className="mt-5">
                    <p className="display-6 my-3">Update dish details</p>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>Dish name</Form.Label>
                            <Form.Control onChange={this.dishNameChangeHandler} type="text" defaultValue={this.state.dish_name} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>Main ingredients</Form.Label>
                            <Form.Control onChange={this.mainIngredientsChangeHandler} type="text" defaultValue={this.state.main_ingredients} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>Price</Form.Label>
                            <Form.Control onChange={this.priceChangeHandler} type="text" defaultValue={this.state.price} />
                        </Form.Group>
                                 
                        <Form.Group controlId="formCoverImage" className="mb-3">
                            <Form.Label>Update your profile picture</Form.Label>
                            <Form.Control onChange={this.dishImageChangeHandler} type="file"/>
                        </Form.Group>

                        <div className="d-grid gap-2 mb-5">
                            <Button onClick={this.submitUpdate} variant="dark" type="submit">
                                Save
                            </Button>
                        </div>
                    </Form>
                    <Link to="/restaurantProfile"> <Button variant="success"> Go back to your dashboard </Button> </Link>

                </Container>
            </Container>
        )
    }
}

export default EditDish;