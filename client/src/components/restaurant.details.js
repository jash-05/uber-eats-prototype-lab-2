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
import Navbar from './navbar';
import server_IP from '../config/server.config.js';
import {withRouter} from 'react-router-dom';

// Define a Login Component
class RestaurantDetails extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_ID: props.match.params.restaurant_ID,
            customer_ID: cookie.load('customer'),
            restaurant_name: "",
            short_address: "",
            cover_image: "",
            about: "",
            full_adress: "",
            fetchedDishes: [],
            selectedDishes: [],
            order_info: {},
            showModal: false,
            showConfirmationModal: false,
            new_dish: {},
            isFavourite: false
        }
        //Bind the handlers to this class
        this.updateQuantityHandler = this.updateQuantityHandler.bind(this);
        this.fetchRestaurantDetails = this.fetchRestaurantDetails.bind(this);
        this.fetchDishes = this.fetchDishes.bind(this);
        this.fetchCurrentOrder = this.fetchCurrentOrder.bind(this);
        this.viewOrder = this.viewOrder.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.checkoutOrder = this.checkoutOrder.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        if (!cookie.load('customer')){
            this.props.history.push(`/welcomeUser`)
        }
        this.fetchRestaurantDetails();
        this.fetchDishes();
        this.fetchCurrentOrder();
        this.checkIfFavourite();
    }
    checkIfFavourite = async () => {
        try {
            console.log('Fetching customer favourites')
            const response = await axios.get(`http://${server_IP}:3001/favourites/${cookie.load('customer')}`);
            console.log(response.data);
            for (let i=0;i<response.data.length;i++){
                if (response.data[i].restaurant_ID === parseInt(this.state.restaurant_ID)) {
                    this.setState({
                        isFavourite: true
                    })
                    break;
                }
            }
        } catch (err) {
            console.error(err);
            return []
        }
    }
    favouritesHandler = async (e) => {
        console.log(e) 
        let data = {
            customer_ID: this.state.customer_ID,
            restaurant_ID: this.state.restaurant_ID
        }
        if (e.target.className === "heart fa fa-heart-o fa-2x"){
            console.log('adding to favourites')
            console.log(data)
            console.log('Sending request to add favourite restaurant')
            const response = await axios.post(`http://${server_IP}:3001/favourites`, data)
            console.log(response.data);
        } else {
            console.log('removing from favourites')
            console.log('Sending request to delete favourite restaurant')
            const response = await axios.delete(`http://${server_IP}:3001/favourites/${this.state.customer_ID}/${this.state.restaurant_ID}`)
            console.log(response.data)
        }
        this.setState({
            isFavourite: !this.state.isFavourite
        })
    }
    updateQuantityHandler = async (e) => {
        console.log("Update quantity handler")
        let to_add = 0
        if (e.target.innerText === "+"){
            to_add = 1
        } else {
            to_add = -1
        }
        let quantity = parseInt(e.target.parentNode.parentNode.childNodes[1].lastChild.data)
        let dish_ID = parseInt(e.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].data)

        if (this.state.order_info.order_ID) {
            if (this.state.order_info.restaurant_ID === parseInt(this.state.restaurant_ID)) {
                console.log('Add dish to existing order')
                let data = {
                    order_ID: this.state.order_info.order_ID,
                    dish_ID: dish_ID,
                    quantity: Math.max(quantity + to_add, 0),
                    restaurant_ID: this.state.restaurant_ID,
                    customer_ID: this.state.customer_ID
                };
                await this.addItemToOrder(data);
            } else {
                this.setState({
                    new_dish: {
                        dish_ID,
                        quantity: Math.max(quantity + to_add, 0)
                    },
                    showConfirmationModal: true
                })
            }
        } else {
            console.log('create new order and add dish')
            let data = {
                dish_ID: dish_ID,
                quantity: Math.max(quantity + to_add, 0),
                restaurant_ID: this.state.restaurant_ID,
                customer_ID: this.state.customer_ID
            };
            await this.addItemToOrder(data);
        }
        await this.fetchCurrentOrder();
    }
    addItemToOrder = async (data) => {
        try {
            const response  = await axios.post(`http://${server_IP}:3001/addOrderItem`, data);
            console.log("Status Code: ", response.status);
            if (response.status === 200){
                console.log("Successful request");
            } else {
                console.log("Unsuccessful request");
                console.log(response);
            }   
        } catch (err) {
            console.error(err)
        }
    }
    fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get(`http://${server_IP}:3001/restaurants/${this.state.restaurant_ID}`);
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                this.setState({restaurant_name: response.data.restaurant_name});
                this.setState({
                    short_address: `${response.data.line1} ${response.data.line2}`
                });
                this.setState({
                    full_address: `${response.data.line1} ${response.data.line2}, ${response.data.city}, ${response.data.state_name} ${response.data.zipcode}`
                })
                this.setState({cover_image: response.data.cover_image});
                this.setState({about: response.data.about});
                console.log('Cookie status: ', cookie.load('cookie'));
            } else{
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    fetchDishes = async () => {
        let dishesData = [] 
        try {
            const response = await axios.get(`http://${server_IP}:3001/dish`, {params:{restaurant_ID: this.state.restaurant_ID}})
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                for (let i=0;i < response.data.length; i++){
                    let main_ingredients = response.data[i].main_ingredients;
                    if ((main_ingredients) && (main_ingredients.length > 20)) {
                        main_ingredients = main_ingredients.slice(0,80).concat('...')
                    }
                    dishesData.push({
                        'dish_ID': response.data[i].dish_ID,
                        'dish_name': response.data[i].dish_name,
                        'category_ID': response.data[i].category_ID,
                        'main_ingredients': main_ingredients,
                        'price': response.data[i].price,
                        'about': response.data[i].about,
                        "dish_image": response.data[i].dish_image,
                        "quantity": 0
                    });
                }
                this.setState({
                    fetchedDishes: dishesData
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
    fetchCurrentOrder = async () => {
        try {
            console.log("Fetching current order")
            const response = await axios.get(`http://${server_IP}:3001/getOrderDetails`, {
                params: {
                    restaurant_ID: this.state.restaurant_ID,
                    customer_ID: this.state.customer_ID
                }
            })
            console.log("Status Code: ", response.status);
            if (response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                if (response.data.order_ID) {
                    if (response.data.restaurant_ID === parseInt(this.state.restaurant_ID)){
                        const res = await axios.get(`http://${server_IP}:3001/getOrderItems`, {
                            params: {
                                order_ID: response.data.order_ID
                            }
                        })
                        console.log("Status Code: ", res.status);
                        if (res.status === 200){
                            let prev_state = this.state.fetchedDishes
                            if (res.data.dishes){
                                let new_state = []
                                for (let i=0; i<prev_state.length;i++){
                                    let matchedDish = res.data.dishes.filter(x => x.dish_ID === prev_state[i].dish_ID)
                                    if(matchedDish.length>0){
                                        prev_state[i].quantity = matchedDish[0].quantity
                                    }
                                    new_state.push(prev_state[i])
                                }
                                let order_info = response.data
                                delete order_info["dishes"]
                                this.setState({
                                    order_info: order_info,
                                    fetchedDishes: new_state
                                });
                            } else {
                                this.setState({
                                    order_info: response.data
                                })
                            }
                        } else {
                            console.log("Unsuccessful request");
                            console.log(response);
                        }
                    } else {
                        this.setState({
                            order_info: response.data
                        })
                    }
                }
            } else {
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    viewOrder = () => {
        console.log("Inside view order function")
        console.log(this.state.fetchedDishes)
        // console.log(this.state.fetchedDishes[0])
        let selected_dishes = []
        let total_order_amount = 0.0
        for (let i=0; i<this.state.fetchedDishes.length; i++) {
            if (this.state.fetchedDishes[i].quantity > 0) {
                selected_dishes.push(
                    this.state.fetchedDishes[i]
                )
                total_order_amount += (this.state.fetchedDishes[i].quantity 
                    * this.state.fetchedDishes[i].price)
            }
        }
        console.log(selected_dishes);
        console.log(`${total_order_amount}`);
        console.log(this.state.order_info);
        let new_order_info = this.state.order_info
        new_order_info.total_amount = Math.round(total_order_amount*100)/100
        this.setState({
            showModal: !this.state.showModal,
            order_info: new_order_info,
            selectedDishes: selected_dishes
        })
    }
    closeModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }
    checkoutOrder = () => {
        console.log("Inside checkout order function")
        this.setState({
            showModal: !this.state.showModal
        })
    }
    closeConfirmationModal = () => {
        this.setState({
            showConfirmationModal: !this.state.showConfirmationModal
        })
    }
    createNewOrder = async () => {
        console.log("Inside checkout order function")
        try {
            await axios.delete(`http://${server_IP}:3001/deleteInCartOrder/${this.state.customer_ID}`)
            let data = {
                dish_ID: this.state.new_dish.dish_ID,
                quantity: this.state.new_dish.quantity,
                restaurant_ID: this.state.restaurant_ID,
                customer_ID: this.state.customer_ID
            }
            await this.addItemToOrder(data);
            this.setState({
                showConfirmationModal: !this.state.showConfirmationModal
            })
            await this.fetchCurrentOrder();
        } catch (err) {
            console.error(err);
        }

    }
    render(){
        console.log("Rendering");
        console.log(this.state.order_info)
        console.log(this.state.fetchedDishes)
        console.log(this.state.isFavourite)
        let redirectVar = null;
        if (!cookie.load('customer')){
            redirectVar = <Redirect to="/welcomeUser"/>
        }
        const createOrderItemRow = row => {
            return (
                <Row>
                    <Col xs={1}> {row.quantity} </Col>
                    <Col xs={9}> {row.dish_name} </Col>
                    <Col xs={2}> {`$${Math.round(row.quantity * row.price * 100)/100}`} </Col>
                </Row>
            )
        }
        const createCard = card => {
            return (
                <Col sm={3} className="m-3  border"  style={{ width: '32rem', height:'12rem'}}>
                    <Row className="p-2">
                        <Col xs={9} md={8}>
                            <Row className="h5 mt-2 mb-4">{card.dish_name}</Row>
                            <Row className="text-muted">{card.main_ingredients}</Row>
                            <Row className="my-4 px-2">${card.price}</Row>
                        </Col>
                        <Col xs={3} md={4}>
                            <Image src={card.dish_image} className="img-fluid" style={{height: '8rem'}} />
                            <Row className="mt-1">
                                <Col>
                                    <Button onClick={this.updateQuantityHandler} size="md" variant="dark">-</Button>
                                </Col>
                                <Col className="h6 my-auto">
                                    <Form.Label visuallyHidden>{card.dish_ID}</Form.Label>
                                    {card.quantity}
                                </Col>
                                <Col>
                                    <Button onClick={this.updateQuantityHandler} size="md" variant="dark">+</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                  </Col>
            )
        }
        return(
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0}}>
                {redirectVar}
                <Navbar/>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0}}>
                    <Row>
                        <Col>
                            <Image className="" src={this.state.cover_image} fluid style={{ width: "100vw", height:"20rem", objectFit:'cover'}}></Image>
                        </Col>
                    </Row>
                    <Row className="my-4 mx-5">
                        <Col xs={10} className="display-6">
                        {`${this.state.restaurant_name} (${this.state.short_address})`}
                        </Col>
                        <Col xs={1} className="">
                            <i className={this.state.isFavourite ? "heart fa fa-heart fa-2x" : "heart fa fa-heart-o fa-2x"} onClick={this.favouritesHandler} style={{color:"red"}}></i>
                        </Col>
                        <Col xs={1} className="">
                            <Button variant="dark" onClick={this.viewOrder}>
                                View Cart
                            </Button>
                        </Col>
                    </Row>
                    <Row className="lead mx-5 px-3">
                        {`${this.state.about}`}
                    </Row>
                    <Row className="my-2 lead mx-5 px-3">
                        {`${this.state.full_address}`}
                    </Row>
                </Container>                
                <Container className="m-5">
                    <Modal 
                        show={this.state.showConfirmationModal} 
                        onHide={this.closeConfirmationModal}
                        backdrop="static"
                        keyboard={false}
                        centered
                    >
                        <Modal.Header closeButton style={{borderBottom: "0 none"}}>
                        <Modal.Title className="display-6 mx-2">Create new order?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="mx-2">
                                Your order contains items from a different restaurant. Create a new order to add items from this restaurant
                            </Row>
                        </Modal.Body>
                        <Modal.Footer style={{borderTop: "0 none"}}>
                            <Button className="mx-auto mb-4" style={{width: "25rem"}} variant="dark" onClick={this.createNewOrder}>
                                New Order
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal 
                        show={this.state.showModal} 
                        onHide={this.closeModal}
                        backdrop="static"
                        keyboard={false}
                        centered
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Current Order</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.selectedDishes.map(createOrderItemRow)}
                            <Row className="mt-4">
                                <Col xs={1}></Col>
                                <Col xs={9}>Total amount:</Col>
                                <Col xs={2}> {`$${this.state.order_info.total_amount}`} </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Link to={`/checkout/${this.state.restaurant_ID}`}>
                                <Button className="mx-auto" variant="dark" onClick={this.checkoutOrder}>
                                    Go to checkout • {`$${this.state.order_info.total_amount}`}
                                </Button>
                            </Link>
                        </Modal.Footer>
                    </Modal>
                </Container>
                <Container fluid className="my-5 mx-5 px-5">
                    <Row>
                        {this.state.fetchedDishes.map(createCard)}
                    </Row>
                </Container>
            </Container>
            
        )
    }
}



//export Login Component
export default withRouter(RestaurantDetails);