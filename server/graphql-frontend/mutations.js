import { gql } from "apollo-boost";

const loginUser = gql`
	mutation ($email_id: String, $pass: String) {
		login(email_id: $email_id, pass: $pass) {
			token
		}
	}
`;

const updateOrder = gql`
	mutation ($orderId: ID, $status: String, $filter: String) {
		orderUpdate(orderId: $orderId, status: $status, filter: $filter) {
			message
		}
	}
`;

const updateDish = gql`
	mutation ($restaurant_ID: ID, $dish: Object) {
		editDish(restaurant_ID: $restaurant_ID, dish: $dish) {
			dish
		}
	}
`;

const addDish = gql`
	mutation ($restaurant_ID: ID, $dish: Object) {
		addDish(restaurant_ID: $restaurant_ID, dish: $dish) {
			message
		}
	}
`;

const custUpdate = gql`
	mutation ($id: ID, $toUpdate: Object) {
		custUpdate(id: $id, toUpdate: $toUpdate) {
			message
		}
	}
`;
const restUpdate = gql`
	mutation ($id: ID, $toUpdate: Object) {
		restUpdate(id: $id, toUpdate: $toUpdate) {
			message
		}
	}
`;

export { loginUser, updateOrder, updateDish, addDish, custUpdate, restUpdate };
