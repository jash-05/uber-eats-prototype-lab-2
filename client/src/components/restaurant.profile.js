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
import Pagination from 'react-bootstrap/Pagination';

// Define a Login Component
class RestaurantProfile extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_ID: null,
            customer_ID: 13,
            const_restaurant_name: "",
            restaurant_name: "",
            owner_name: "",
            line1: "",
            line2: "",
            city: "",
            state_name: "",
            zipcode: "",
            phone_number: "",
            vegetarian: false,
            non_vegetarian: false,
            vegan: false,
            delivery: false,
            pickup: false,
            short_address: "",
            cover_image: "",
            const_cover_image: "",
            about: "",
            const_about: "",
            opening_time: "",
            closing_time: "",
            full_adress: "",
            fetchedDishes: [],
            cover_image_file: "",
            showModal: false,
            new_dish: {
                category_ID: 1
            },
            fetchedOrders: [],
            selectedOrderFilter: "all",
            paginationLimit: 5,
            pageNumbers: []
        }
        //Bind the handlers to this class
        this.setRestaurantState = this.setRestaurantState.bind(this);
        this.fetchRestaurantDetails = this.fetchRestaurantDetails.bind(this);
        this.fetchDishes = this.fetchDishes.bind(this);
        this.restaurantNameChangeHandler = this.restaurantNameChangeHandler.bind(this);
        this.ownerNameChangeHandler = this.ownerNameChangeHandler.bind(this);
        this.addressLine1ChangeHandler = this.addressLine1ChangeHandler.bind(this);
        this.addressLine2ChangeHandler = this.addressLine2ChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.zipChangeHandler = this.zipChangeHandler.bind(this);
        this.phoneNumberChangeHandler = this.phoneNumberChangeHandler.bind(this);
        this.vegetarianChangeHandler = this.vegetarianChangeHandler.bind(this);
        this.nonVegetarianChangeHandler = this.nonVegetarianChangeHandler.bind(this);
        this.veganChangeHandler = this.veganChangeHandler.bind(this);
        this.deliveryChangeHandler = this.deliveryChangeHandler.bind(this);
        this.pickupChangeHandler = this.pickupChangeHandler.bind(this);
        this.coverImageChangeHandler = this.coverImageChangeHandler.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.dishFieldsChangeHandler = this.dishFieldsChangeHandler.bind(this);
        this.addNewDish = this.addNewDish.bind(this);
        this.selectedDishTypeChangeHandler = this.selectedDishTypeChangeHandler.bind(this);
        this.fetchOrders = this.fetchOrders.bind(this);
        this.selectedOrderFilterChangeHandler = this.selectedOrderFilterChangeHandler.bind(this);
        this.orderStatusChangeHandler = this.orderStatusChangeHandler.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        this.setRestaurantState();
        this.fetchRestaurantDetails();
        this.fetchDishes();
        this.fetchOrders('all', 5, 1);
    }
    setRestaurantState = async () => {
        if (cookie.load('restaurant')) {
            this.setState({
                restaurant_ID: cookie.load('restaurant')
            })
        }
    }
    fetchRestaurantDetails = async () => {
        try {
            await this.setRestaurantState();
            console.log('Fetching restaurant details')
            const response = await axios.get(`http://${server_IP}:3001/restaurants/${this.state.restaurant_ID}`);
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                this.setState({
                    const_restaurant_name: response.data.restaurant_name,
                    restaurant_name: response.data.restaurant_name,
                    short_address: `${response.data.address.line1} ${response.data.address.line2}`,
                    full_address: `${response.data.address.line1} ${response.data.address.line2}, ${response.data.address.city}, ${response.data.address.state_name} ${response.data.address.zipcode}`,
                    const_cover_image: response.data.cover_image,
                    cover_image: response.data.cover_image,
                    about: response.data.about,
                    const_about: response.data.about,
                    owner_name: response.data.owner_name,
                    line1: response.data.address.line1,
                    line2: response.data.address.line2,
                    city: response.data.address.city,
                    state_name: response.data.address.state_name,
                    zipcode: response.data.address.zipcode,
                    phone_number: response.data.phone_number,
                    vegetarian: ((response.data.vegetarian) ? true : false),
                    non_vegetarian: ((response.data.non_vegetarian) ? true : false),
                    vegan: ((response.data.vegan) ? true : false),
                    delivery: ((response.data.delivery) ? true : false),
                    pickup: ((response.data.pickup) ? true : false),
                    opening_time: response.data.opening_time,
                    closing_time: response.data.closing_time
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
    fetchDishes = async () => {
        let dishesData = [] 
        try {
            await this.setRestaurantState();
            console.log('Fetching dishes')
            const response = await axios.get(`http://${server_IP}:3001/dish`, {params:{restaurant_ID: this.state.restaurant_ID}})
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request for fetching dishes");
                console.log(response.data);
                for (let i=0;i < response.data.dishes.length; i++){
                    let main_ingredients = response.data.dishes[i].main_ingredients;
                    if ((main_ingredients) && (main_ingredients.length > 20)) {
                        main_ingredients = main_ingredients.slice(0,80).concat('...')
                    }
                    dishesData.push({
                        'dish_ID': response.data.dishes[i].dish_ID,
                        'dish_name': response.data.dishes[i].dish_name,
                        'category_ID': response.data.dishes[i].category_ID,
                        'main_ingredients': main_ingredients,
                        'price': response.data.dishes[i].price,
                        'about': response.data.dishes[i].about,
                        "dish_image": response.data.dishes[i].dish_image,
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
    fetchOrders = async (filter, paginationLimit, pageNumber) => {
        try {
            if (!this.state.restaurant_ID) {
                await this.setRestaurantState();
            }
            console.log('Fetching orders')
            const data = {
                restaurant_ID: this.state.restaurant_ID,
                filter: filter,
                toSkip: (pageNumber - 1) * paginationLimit,
                limit: parseInt(paginationLimit)
            }
            console.log('Sending request to fetch orders with the following params: ')
            console.log(data)
            const response = await axios.get(`http://${server_IP}:3001/fetchOrdersForRestaurant`, {params: data})
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request of fetching orders");
                console.log(response.data);
                let page_numbers = this.state.pageNumbers
                if (parseInt(pageNumber) === 1) {
                    const payload = {
                        restaurant_ID: this.state.restaurant_ID,
                        filter: filter,
                        limit: parseInt(paginationLimit)
                    }
                    const res = await axios.get(`http://${server_IP}:3001/fetchPageNumbersForRestaurantOrders`, {params: payload})
                    console.log("Successful request of fetching page numbers")
                    console.log(res.data)
                    let updated_page_numbers = []
                    for (let i=1; i<=res.data.numberOfPages; i++) {
                        updated_page_numbers.push({
                            pageNumber: i,
                            isHighlighted: (i===1 ? true : false)
                        })
                    }
                    page_numbers = updated_page_numbers;
                }
                this.setState({
                    fetchedOrders: response.data,
                    pageNumbers: page_numbers
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
    openingTimeChangeHandler = (e) => {
        this.setState({
            opening_time: e.target.value
        })
    }
    closingTimeChangeHandler = (e) => {
        this.setState({
            closing_time: e.target.value
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
        this.setState({
            cover_image_file: file
        })

    }
    uploadImageToS3 = async () => {
        if (this.state.cover_image_file){
            try {
                const data = await ReactS3.uploadFile(this.state.cover_image_file, s3_config)
                this.setState({
                    cover_image: data.location
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
        const restaurant_data = {
            restaurant_ID: this.state.restaurant_ID,
            restaurant_name : this.state.restaurant_name,
            owner_name: this.state.owner_name,
            about: this.state.about,
            phone_number: this.state.phone_number,
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup,
            opening_time: this.state.opening_time,
            closing_time: this.state.closing_time,
            cover_image: this.state.cover_image
        }
        console.log(restaurant_data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        // make a post request with the user data
        axios.put(`http://${server_IP}:3001/restaurants/${this.state.restaurant_ID}`,restaurant_data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request for storing restaurant info");
                    console.log(response);
                    console.log('Cookie status: ', cookie.load('cookie'));
                    const address_data = {
                        restaurant_ID: this.state.restaurant_ID,
                        line1: this.state.line1,
                        line2: this.state.line2,
                        city: this.state.city,
                        state_name: this.state.state_name,
                        zipcode: this.state.zipcode
                    }
                    axios.put(`http://${server_IP}:3001/restaurantAddress`, address_data)
                    .then(resp => {
                        console.log("Status Code: ", resp.status);
                        if (resp.status === 200) {
                            console.log("Successful request for storing restaurant address");
                            console.log(resp);
                            this.fetchRestaurantDetails();
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
    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }
    dishFieldsChangeHandler = (e) => {
        let updated_dish = this.state.new_dish;
        updated_dish[e.target.name] = e.target.value;
        this.setState({
            new_dish: updated_dish
        });
    }
    selectedDishTypeChangeHandler = e => {
        console.log(e)
        let updated_dish = this.state.new_dish;
        updated_dish["category_ID"] = parseInt(e.target.selectedOptions[0].id);
        this.setState({
            new_dish: updated_dish
        });
    }
    dishImageChangeHandler = e => {
        const file = e.target.files[0]
        console.log(e.target.files[0])
        let updated_dish = this.state.new_dish;
        updated_dish['dish_image_file'] = file
        this.setState({
            new_dish: updated_dish
        })
    }
    uploadDishImageToS3 = async () => {
        if (this.state.new_dish.dish_image_file){
            try {
                const data = await ReactS3.uploadFile(this.state.new_dish.dish_image_file, s3_config)
                let updated_dish = this.state.new_dish
                updated_dish['dish_image'] = data.location
                delete updated_dish['dish_image_file'];
                this.setState({
                    new_dish: updated_dish
                })
            } catch (err) {
                console.error(err);
            }
        }
    }
    addNewDish = async () => {
        try {
            await this.uploadDishImageToS3();
            let data = this.state.new_dish;
            data['restaurant_ID'] = this.state.restaurant_ID;
            console.log("Adding new dish: ")
            console.log(data);
            const response = await axios.post(`http://${server_IP}:3001/dish`, data);
            console.log("Status Code: ", response.status);
            if (response.status === 200){
                console.log("Successful request");
                console.log(response.data)
                this.setState({
                    showModal: !this.state.showModal,
                    new_dish: {}
                })
                window.location.reload(false);
            } else {
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err)
        }
    }
    selectedOrderFilterChangeHandler = async (e) => {
        await this.fetchOrders(e.target.value, this.state.paginationLimit, 1)
        this.setState({
            selectedOrderFilter: e.target.value
        })
    }
    paginationLimitChangeHandler = async (e) => {
        await this.fetchOrders(this.state.selectedOrderFilter, e.target.value, 1);
        this.setState({
            paginationLimit: e.target.value
        })
    }
    orderStatusChangeHandler = async (e) => {
        if (["placed", "delivered", "cancelled"].includes(e.target.name)) {
            try {
                const data = {
                    order_ID: e.target.id,
                    order_status: e.target.name
                }
                const response = await axios.post(`http://${server_IP}:3001/updateOrderStatus`, data)
                if (response.status === 200){
                    console.log("Successful request")
                    console.log(response.data)
                    await this.fetchOrders();
                    window.location.reload(false);
                } else {
                    console.log("Unsuccessful request")
                }
            } catch (err) {
                console.error(err)
            }
        }
    }
    paginationButtonClickHandler = async (e) => {
        await this.fetchOrders(this.state.selectedOrderFilter, this.state.paginationLimit, parseInt(e.target.text))
        let updatedPageNumbers = []
        for (let i=0; i<this.state.pageNumbers.length; i++) {
            if (this.state.pageNumbers[i].pageNumber === parseInt(e.target.text)) {
                updatedPageNumbers.push({
                    ...this.state.pageNumbers[i],
                    isHighlighted: true
                })
            } else {
                updatedPageNumbers.push({
                    ...this.state.pageNumbers[i],
                    isHighlighted: false
                })
            }
        }
        this.setState({
            pageNumbers: updatedPageNumbers
        })
    }
    render(){
        console.log("Rendering")
        console.log(this.state.pageNumbers)
        let redirectVar = null;
        if (!cookie.load('restaurant')){
            redirectVar = <Redirect to="/welcomeUser"/>
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
                            <Row className="mt-3 mb-1 px-5">
                                <Link to={`/editDish/${card.dish_ID}`}>
                                    <Button size="sm" variant="dark">
                                        Edit
                                    </Button>
                                </Link>
                            </Row>
                        </Col>
                    </Row>
                  </Col>
            )
        }
        const capitalizeFirstLetter = text => {
            return text.charAt(0).toUpperCase() + text.slice(1)
        }
        const createDishItemRow = row => {
            return (
                <Row>
                    <Col xs={1}> {row.quantity} </Col>
                    <Col xs={9}> {row.dish_name} </Col>
                    <Col xs={2}> {`$${Math.round(row.quantity * row.price * 100)/100}`} </Col>
                </Row>
            )
        } 
        const formatDishes = (dish_IDs, dish_names, dish_prices, dish_quantities) => {
            return dish_IDs.map((id, index) => {
                return {
                    dish_ID: id,
                    dish_name: dish_names[index],
                    price: dish_prices[index],
                    quantity: dish_quantities[index]
                }
            })
        }
        const showDropdownButtons = (orderStatus) => {
            return (
                <Dropdown.Item value={orderStatus.x}>{orderStatus.x}</Dropdown.Item>
            )
        }
        const createOrderRow = row => {
            return (
                <Col className="m-3 px-5 mx-5">
                    <Card style={{width: "50rem"}}>
                    <Card.Header>
                        <Row className="p-1">
                        <Col xs={7}>
                            Status: <strong>{capitalizeFirstLetter(((row.order_status==="placed") ? "New Order" : (row.order_status==="cancelled" ? "Preparing" : row.order_status)))}</strong>
                        </Col>
                        <Col xs={3}>
                            Order #{row.order_ID.slice(0,3).toUpperCase()}
                        </Col>
                        <Col xs={2}>
                            {`$${row.total_amount ? row.total_amount : ""}`}
                        </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Link to={`/customerPublicProfile/${row.customer_info.customer_ID}`} style={{ textDecoration: 'none' }}>
                            <Card.Title className="text-dark">{`${row.customer_info.first_name} ${row.customer_info.last_name}`}</Card.Title>
                        </Link>
                        <Card.Text>
                            {`${row.customer_info.line1} ${row.customer_info.line2}, ${row.customer_info.city}, ${row.customer_info.state_name} ${row.customer_info.zipcode}`}
                        </Card.Text>
                        <Accordion className="my-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>View order details</Accordion.Header>
                            <Accordion.Body>
                                {row.order_items.map(createDishItemRow)}
                                <Row className="mt-4">
                                    <Col xs={1}></Col>
                                    <Col xs={9}> Total amount: </Col>

                                    <Col xs={2}> {`$${row.total_amount}`} </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        </Accordion>
                        <Row>
                            <Col xs={4}>
                                {/* <Button variant="dark" value="5" onClick={this.orderStatusChangeHandler}>Update order status</Button> */}
                                <DropdownButton
                                    id="dropdown-button-dark-example2"
                                    variant="dark"
                                    menuVariant="dark"
                                    title="Update order status"
                                    onClick={this.orderStatusChangeHandler}
                                >   
                                    <Dropdown.Item name="placed" id={row.order_ID}>New Order</Dropdown.Item>
                                    <Dropdown.Item name="delivered" id={row.order_ID}>Delivered</Dropdown.Item>
                                    <Dropdown.Item name="cancelled" id={row.order_ID}>Preparing</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                            <Col xs={4}>
                                <Link to={`/customerPublicProfile/${row.customer_info.customer_ID}`} style={{ textDecoration: 'none' }}>
                                    <Button variant="dark">Visit customer profile</Button>
                                </Link>
                            </Col>
                        </Row>                        
                    </Card.Body>
                    </Card>
                </Col>
            )
        }
        const createPageNumberButtons = obj => {
            return (
                <Pagination.Item key={obj.pageNumber} active={obj.isHighlighted} onClick={this.paginationButtonClickHandler}>
                    {obj.pageNumber}
                </Pagination.Item>
            )
        }
        return(
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0}}>
                {redirectVar}
                <RestaurantNavbar/>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0}}>
                    <Row>
                        <Col>
                            <Image className="" src={this.state.const_cover_image} fluid style={{ width: "100vw", height:"20rem", objectFit:'cover'}}></Image>
                        </Col>
                    </Row>
                    <Row className="display-6 my-4 mx-5">
                        {`${this.state.const_restaurant_name} (${this.state.short_address})`}
                    </Row>
                    <Row className="lead mx-5">
                        {`${this.state.const_about}`}
                    </Row>
                    <Row className="my-2 lead mx-5">
                        {`${this.state.full_address}`}
                    </Row>
                </Container>
                <Container className="my-5 mx-5 px-5" fluid>
                    <Tabs defaultActiveKey="second" fill justify>
                        <Tab eventKey="first" title={<span className="display-6 text-dark" style={{fontSize: "1.75rem"}}>Profile</span>}>
                            <Container className="mt-5" fluid>
                                <Form className="mx-5">
                                    <Form.Group className="mb-4" controlId="formBasicRestaurantName">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Restaurant name</Form.Label>
                                        <Form.Control onChange={this.restaurantNameChangeHandler} type="text" defaultValue={this.state.restaurant_name} />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formBasicOwnerName">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Owner name</Form.Label>
                                        <Form.Control onChange={this.ownerNameChangeHandler} type="text" defaultValue={this.state.owner_name} />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4" controlId="formBasicOwnerName">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>About</Form.Label>
                                        <Form.Control onChange={this.aboutChangeHandler} type="text" defaultValue={this.state.about} />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formGridAddress1">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Street Address</Form.Label>
                                        <Form.Control onChange={this.addressLine1ChangeHandler} defaultValue={this.state.line1} />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formGridAddress2">
                                        {/* <Form.Label>Street Address Line 2 (optional)</Form.Label> */}
                                        <Form.Control onChange={this.addressLine2ChangeHandler} defaultValue={this.state.line2} />
                                    </Form.Group>

                                    <Row className="mb-4">
                                        <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>City</Form.Label>
                                        <Form.Control onChange={this.cityChangeHandler} defaultValue={this.state.city}/>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>State</Form.Label>
                                        <Form.Control onChange={this.stateChangeHandler} defaultValue={this.state.state_name}/>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Zip</Form.Label>
                                        <Form.Control onChange={this.zipChangeHandler} type="number" defaultValue={this.state.zipcode}/>
                                        </Form.Group>
                                    </Row>

                                    <Form.Group className="mb-4" controlId="formBasicPhoneNumber">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Phone Number</Form.Label>
                                        <Form.Control onChange={this.phoneNumberChangeHandler} type="number" defaultValue={this.state.phone_number} />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formBasicFoodOptions">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Food Options</Form.Label>
                                        <div key="inline-checkbox" className="mb-3">
                                        <Form.Check
                                            onChange={this.vegetarianChangeHandler}
                                            inline
                                            label="Vegetarian"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-1"
                                            {...this.state.vegetarian && {'defaultChecked': 'true'}}
                                        />
                                        {/* {console.log(this.state.vegetarian)}
                                        {console.log(this.state.non_vegetarian)}
                                        {console.log(this.state.vegan)} */}
                                        <Form.Check
                                            onChange= {this.nonVegetarianChangeHandler}
                                            inline
                                            label="Non-Vegetarian"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-2"
                                            {...this.state.non_vegetarian && {'defaultChecked': 'true'}}
                                        />
                                        <Form.Check
                                            inline
                                            label="Vegan"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-3"
                                            {...this.state.vegan && {'defaultChecked': 'true'}}
                                            onChange={this.veganChangeHandler}
                                        />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formBasicDeliveryOptions">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Delivery Options</Form.Label>
                                        <div key="inline-checkbox" className="mb-3">
                                        <Form.Check
                                            onChange={this.deliveryChangeHandler}
                                            inline
                                            label="Delivery"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-4"
                                            {...this.state.delivery && {'defaultChecked': 'true'}}
                                        />
                                        <Form.Check
                                            onChange={this.pickupChangeHandler}
                                            inline
                                            label="Pickup"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-5"
                                            {...this.state.pickup && {'defaultChecked': 'true'}}
                                        />
                                        </div>
                                    </Form.Group>                
                                    
                                    <Form.Group className="mb-4" controlId="formBasicPhoneNumber">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Opening Time</Form.Label>
                                        <Form.Control onChange={this.openingTimeChangeHandler} type="text" defaultValue={this.state.opening_time} />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formBasicPhoneNumber">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Closing Time</Form.Label>
                                        <Form.Control onChange={this.closingTimeChangeHandler} type="text" defaultValue={this.state.closing_time} />
                                    </Form.Group>

                                    <Form.Group controlId="formCoverImage" className="mb-4">
                                        <Form.Label className="display-6" style={{fontSize: "1.3rem"}}>Update your cover image</Form.Label>
                                        <Form.Control onChange={this.coverImageChangeHandler} type="file" />
                                    </Form.Group>

                                    <div className="d-grid gap-2 mb-5">
                                        <Button onClick={this.submitUpdate} variant="dark" type="submit">
                                            Save
                                        </Button>
                                    </div>
                                </Form>
                            </Container>
                        </Tab>
                        <Tab eventKey="second" title={<span className="display-6 text-dark" style={{fontSize: "1.75rem"}}>Menu</span>}>
                            <Container className="my-5">
                            </Container>
                            <Row className="my-5">
                                {this.state.fetchedDishes.map(createCard)}
                                <Col sm={3} className="m-3  border"  style={{ width: '32rem', height:'12rem'}}>
                                    <Row className="p-2">
                                        <Col xs={9} md={8}>
                                            <Button size="lg" className="my-5 mx-3" variant="dark" onClick={this.toggleModal}>
                                                + Add new dish
                                            </Button>
                                            <Modal 
                                                show={this.state.showModal} 
                                                onHide={this.toggleModal}
                                                backdrop="static"
                                                keyboard={false}
                                                centered
                                            >
                                                <Modal.Header closeButton>
                                                <Modal.Title>Enter details of the new dish</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Form.Group className="mb-3" controlId="formGridAddressType">
                                                        <Form.Label>Dish name</Form.Label>
                                                        <Form.Control name="dish_name" onChange={this.dishFieldsChangeHandler} placeholder="Eg: Avocado Toast, Greek Salad, etc" />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="formGridAddress1">
                                                        <Form.Label>Main ingredients</Form.Label>
                                                        <Form.Control name="main_ingredients" onChange={this.dishFieldsChangeHandler} placeholder="Eg: ice, coconut milk, matcha green tea"/>
                                                    </Form.Group>

                                                    <Row className="mb-3">
                                                        <Form.Group as={Col} controlId="formGridCity">
                                                        <Form.Label>Price</Form.Label>
                                                        <InputGroup>
                                                        <InputGroup.Text>$</InputGroup.Text>
                                                        <Form.Control type="number" name="price" onChange={this.dishFieldsChangeHandler} />
                                                        </InputGroup>
                                                        </Form.Group>
                                                        
                                                        <Form.Group as={Col}>
                                                            <Form.Label>Dish type</Form.Label>
                                                            <Form.Select size="sm" onChange={this.selectedDishTypeChangeHandler}>
                                                                <option id="1">Appetizers</option>
                                                                <option id="2">Salads</option>
                                                                <option id="3">Main Course</option>
                                                                <option id="4">Desserts</option>
                                                                <option id="5">Beverages</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Row>
                                                    <Form.Group controlId="formCoverImage" className="mb-3">
                                                        <Form.Label>Upload a picture of the dish</Form.Label>
                                                        <Form.Control onChange={this.dishImageChangeHandler} type="file" />
                                                    </Form.Group>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button className="mx-auto" variant="dark" onClick={this.addNewDish}>
                                                        Add dish
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </Col>
                                        <Col xs={3} md={4}>
                                            <Image src="https://uber-eats-prototype.s3.us-west-1.amazonaws.com/dish_icon.png" className="img-fluid" style={{height: '8rem'}} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="third" title={<span className="display-6 text-dark" style={{fontSize: "1.75rem"}}>Orders</span>}>
                            <Container className="my-5">
                                <Row className="my-4">
                                    <Col xs={6}>
                                        <Form.Select onChange={this.selectedOrderFilterChangeHandler}>
                                            <option value="all">All orders</option>
                                            <option value="placed">New orders</option>
                                            <option value="delivered">Delivered orders</option>
                                            <option value="cancelled">Preparing orders</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs={1}></Col>
                                    <Col xs={1}>
                                        <Form.Select onChange={this.paginationLimitChangeHandler} defaultValue="5">
                                            <option value="2">2</option>
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row>
                                    {(this.state.fetchedOrders.length ? this.state.fetchedOrders.map(createOrderRow) : "")}
                                </Row>
                                <Row className="mx-5 mt-3 px-5">
                                    <Pagination className="mx-5  px-5" size="lg">
                                        {this.state.pageNumbers.map(createPageNumberButtons)}
                                    </Pagination>
                                </Row>
                            </Container>
                        </Tab>
                    </Tabs>
                </Container>
                {/* <Container>
                    <Row>
                        {this.state.fetchedDishes.map(createCard)}
                    </Row>
                </Container> */}
            </Container>
            
        )
    }
}

//export Login Component
export default RestaurantProfile;