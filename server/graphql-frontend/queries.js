import { gql } from "apollo-boost";

const findAllRestaurants = gql`
	query ($city: String) {
		findAllRestaurants(city: $city) {
			_id
			name
			phone_number
			about
			image
			street
			city
			state_name
			country
			zipcode
			opening_time
			closing_time
			vegetarian
			non_vegetarian
			vegan
			delivery
			pickup
			dishes
		}
	}
`;
const findOneRestaurant = gql`
	query ($restaurantId: ID) {
		findOneRestaurant(restaurantId: $restaurantId) {
			_id
			name
			phone_number
			about
			image
			street
			city
			state
			country
			zipcode
			opening_time
			closing_time
			vegetarian
			non_vegetarian
			vegan
			delivery
			pickup
			dishes
		}
	}
`;
const getDishesbyRest = gql`
	query ($restId: ID) {
		getDishesbyRest(restId: $restId) {
			dish_ID
			dish_name
			main_ingredients
			price
			quantity
			category_ID
			dish_image
			about
		}
	}
`;

const getRestaurantsOrders = gql`
	query ($restId: ID, $pageLimit: Int) {
		getRestaurantsOrders(restId: $restId, pageLimit: $pageLimit) {
			order_ID
			restaurant_info
			customer_info
			order_placed_timestamp
			order_stats
			order_filter
			total_amount
			order_items
			specialInnstructions
		}
	}
`;

const getCustomersOrders = gql`
	query ($custId: ID, $pageLimit: Int, $pageNumber: Int) {
		getCustomersOrders(
			custId: $custId
			pageLimit: $pageLimit
			pageNumber: $pageNumber
		) {
			order_ID
			restaurant_info
			customer_info
			order_placed_timestamp
			order_stats
			order_filter
			total_amount
			order_items
			specialInnstructions
		}
	}
`;

export {
	findAllRestaurants,
	findOneRestaurant,
	findOneCustomers,
	findAllCustomers,
	getAddresses,
	getDishesbyRest,
	getRestaurantsOrders,
	getCustomersOrders,
};
