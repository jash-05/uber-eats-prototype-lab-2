const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLInputObjectType,
	GraphQLFloat,
	GraphQLID,
} = require("graphql");

const {
	getEditDish,
	findAllRestaurants,
	findOneRestaurant,
	getDishesbyRest,
	getRestIdsFromDish,
	getRestIdsFromType,
	getAddresses,
	findAllCustomers,
	findOneCustomer,
	getRestaurantsOrders,
	getCustomersOrders,
	getRestaurantsOrdersCount,
	getCustomerOrdersCount,
} = require("./queries");

const {
	orderUpdate,
	editDish,
	addDish,
	restUpdate,
	custUpdate,
	updateAddress,
	addAddress,
} = require("./mutations");

const Customer = new GraphQLObjectType({
	name: "customer",
	fields: () => ({
		_id: { type: GraphQLID },
		first_name: { type: GraphQLString },
		last_name: { type: GraphQLString },
		email_id: { type: GraphQLString },
		pass: { type: GraphQLString },
		country: { type: GraphQLString },
		phone_numer: { type: GraphQLString },
		about: { type: GraphQLString },
		profile_picture: { type: GraphQLString },
		dob: { type: GraphQLString },
		nickname: { type: GraphQLString },
		addresses: { type: new GraphQLList(Address) },
		favourites: { type: new GraphQLList(Favourite) },
	}),
});

const Address = new GraphQLObjectType({
	name: "address",
	fields: () => ({
		address_type: { type: GraphQLString },
		line1: { type: GraphQLString },
		line2: { type: GraphQLString },
		city: { type: GraphQLString },
		state_name: { type: GraphQLString },
		country: { type: GraphQLString },
		zipcode: { type: GraphQLString },
	}),
});

const Favourite = new GraphQLObjectType({
	name: "favourite",
	fields: () => ({
		restaurant_ID: { type: GraphQLString },
	}),
});

const Order = new GraphQLObjectType({
	name: "order",
	fields: () => ({
		order_status: { type: GraphQLString },
		order_type: { type: GraphQLString },
		order_placed_timestamp: { type: GraphQLString },
		specialInstructions: { type: GraphQLString },
		total_amount: { type: GraphQLFloat },
		order_items: { type: new GraphQLList(orderItem) },
	}),
});

const orderItem = new GraphQLObjectType({
	name: "orderItem",
	fields: () => ({
		dish_ID: { type: GraphQLString },
		dish_name: { type: GraphQLString },
		quantity: { type: GraphQLInt },
		price: { type: GraphQLFloat },
	}),
});

const Restaurant = new GraphQLObjectType({
	name: "restaurant",
	fields: () => ({
		email_id: { type: GraphQLString },
		pass: { type: GraphQLString },
		restaurant_name: { type: GraphQLString },
		owner_name: { type: GraphQLString },
		country: { type: GraphQLString },
		phone_number: { type: GraphQLString },
		vegetarian: { type: GraphQLBoolean },
		non_vegetarian: { type: GraphQLBoolean },
		vegan: { type: GraphQLBoolean },
		delivery: { type: GraphQLBoolean },
		pickup: { type: GraphQLBoolean },
		cover_image: { type: GraphQLString },
		about: { type: GraphQLString },
		opening_time: { type: GraphQLString },
		closing_time: { type: GraphQLString },
		line1: { type: GraphQLString },
		line2: { type: GraphQLString },
		city: { type: GraphQLString },
		state: { type: GraphQLString },
		country: { type: GraphQLString },
		zipcode: { type: GraphQLString },
		dishes: { type: new GraphQLList(dish) },
	}),
});

const dish = new GraphQLObjectType({
	name: "dish",
	fields: () => ({
		dish_name: { type: GraphQLString },
		category_ID: { type: GraphQLString },
		main_ingredients: { type: GraphQLString },
		price: { type: GraphQLFloat },
		about: { type: GraphQLString },
		dish_image: { type: GraphQLString },
	}),
});

const RootQueryType = new GraphQLObjectType({
	name: "query",
	description: "Root Query",
	fields: () => ({
		getEditDish: {
			type: dish,
			description: "Get details for the dish to be edited",
			args: {
				dishId: { type: GraphQLID },
				restId: { type: GraphQLID },
			},
			resolve: (parent, args) => {
				return getEditDish(args);
			},
		},
		findAllRestaurants: {
			type: Restaurant,
			description: "Getting all restaurant details",
			args: {
				city: { type: GraphQLString },
			},
			resolve: (parent, args) => {
				return findAllRestaurants(args);
			},
		},
		findOneRestaurant: {
			type: Restaurant,
			description: "Getting single restaurant details",
			args: {
				restaurantId: { type: GraphQLID },
			},
			resolve: (parent, args) => {
				return findOneRestaurant(args);
			},
		},
		getDishesbyRest: {
			type: dish,
			description: "Getting all restaurant details",
			args: {
				restId: { type: GraphQLID },
			},
			resolve: (parent, args) => {
				return getDishesbyRest(args);
			},
		},
		getAddresses: {
			type: Address,
			description: "Getting addresses for customer",
			args: {
				custId: { type: GraphQLID },
			},
			resolve: (parent, args) => {
				return getAddresses(args);
			},
		},
		findAllCustomers: {
			type: Customer,
			description: "Getting all customers",
			args: {},
			resolve: (parent, args) => {
				return findAllCustomers(args);
			},
		},
		findOneCustomer: {
			type: Customer,
			description: "Getting all customers",
			args: {
				id: { type: GraphQLID },
			},
			resolve: (parent, args) => {
				return findOneCustomer(args);
			},
		},
		getRestaurantsOrders: {
			type: Order,
			description: "Getting Restaurant Orders",
			args: {
				restId: { type: GraphQLID },
				pageLimit: { type: GraphQLInt },
				pageNumber: { type: GraphQLInt },
			},
			resolve: (parent, args) => {
				return getRestaurantsOrders(args);
			},
		},
		getRestaurantsOrdersCount: {
			type: Order,
			description: "Getting Restaurant Orders Count",
			args: {
				restId: { type: GraphQLID },
				pageLimit: { type: GraphQLInt },
			},
			resolve: (parent, args) => {
				return getRestaurantsOrdersCount(args);
			},
		},
		getCustomersOrders: {
			type: Order,
			description: "Getting Customer Orders",
			args: {
				custId: { type: GraphQLID },
				pageLimit: { type: GraphQLInt },
				pageNumber: { type: GraphQLInt },
			},
			resolve: (parent, args) => {
				return getCustomersOrders(args);
			},
		},
		getCustomerOrdersCount: {
			type: Order,
			description: "Getting Customer Orders",
			args: {
				custId: { type: GraphQLID },
				pageLimit: { type: GraphQLInt },
			},
			resolve: (parent, args) => {
				return getCustomerOrdersCount(args);
			},
		},
	}),
});

const Message = new GraphQLObjectType({
	name: "message",
	fields: () => ({
		message: { type: GraphQLString },
	}),
});

const RootMutationType = new GraphQLObjectType({
	name: "mutation",
	description: "Mutation Query",
	fields: () => ({
		orderUpdate: {
			type: Message,
			description: "Update order details ",
			args: {
				orderId: { type: GraphQLID },
				status: { type: GraphQLString },
				filter: { type: GraphQLString },
			},
			resolve: (parent, args) => {
				return orderUpdate(args);
			},
		},
		editDish: {
			type: dish,
			description: "Update dish details ",
			args: {
				restId: { type: GraphQLID },
				dish: { type: GraphQLObjectType },
			},
			resolve: (parent, args) => {
				return editDish(args);
			},
		},
		addDish: {
			type: Message,
			description: "Add dish details ",
			args: {
				restId: { type: GraphQLID },
				dish: { type: GraphQLObjectType },
			},
			resolve: (parent, args) => {
				return addDish(args);
			},
		},
		restUpdate: {
			type: Message,
			description: "Update restaurant details ",
			args: {
				restId: { type: GraphQLID },
				toUpdate: { type: GraphQLObjectType },
			},
			resolve: (parent, args) => {
				return restUpdate(args);
			},
		},
		custUpdate: {
			type: Message,
			description: "Update customer details ",
			args: {
				id: { type: GraphQLID },
				toUpdate: { type: GraphQLObjectType },
			},
			resolve: (parent, args) => {
				return custUpdate(args);
			},
		},
		updateAddress: {
			type: Message,
			description: "Update address details ",
			args: {
				custId: { type: GraphQLID },
				address: { type: GraphQLObjectType },
			},
			resolve: (parent, args) => {
				return updateAddress(args);
			},
		},
		addAddress: {
			type: Message,
			description: "add address details ",
			args: {
				custId: { type: GraphQLID },
				address: { type: GraphQLObjectType },
			},
			resolve: (parent, args) => {
				return addAddress(args);
			},
		},
	}),
});
const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType,
});

module.exports = schema;
