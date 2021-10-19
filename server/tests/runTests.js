const { makeGETRequest, makePOSTRequest } = require('./makeRequest.js');
const chai = require('chai');
const assert = chai.assert;

describe('#testCustomerDetailsAPI', () => {
    it('Should return the correct customers details', async () => {
        const response = await makeGETRequest('http://localhost:3001/customers/26')
        assert.isObject(response);
        assert.strictEqual(typeof response, "object")
        assert.strictEqual(response.customer_ID, 26)
        assert.isString(response.first_name)
        assert.strictEqual(response.first_name, "Lando")
        assert.isString(response.last_name)
        assert.strictEqual(response.last_name, "Norris")
        assert.strictEqual(response.email_id, "lando@gmail.com")
        assert.strictEqual(response.city, "San Jose")
        assert.strictEqual(response.address_ID, 15)
    })
})

describe('#testaddFavouritesAPI', () => {
    it('should add a favourite restaurant for customer', async () => {
        const customer_ID = 26;
        const restaurant_ID = 2;
        const data = {
            customer_ID: customer_ID,
            restaurant_ID: restaurant_ID
        }
        const response = await makePOSTRequest('http://localhost:3001/favourites', data)
        assert.isObject(response);
        assert.isAbove(response.favourite_id, 35);
        assert.strictEqual(response.customer_ID, customer_ID);
        assert.strictEqual(response.restaurant_ID, restaurant_ID);
    })
})

describe('#testGetFavouritesAPI', () => {
    it("Should return the customer's favourite restaurants", async () => {
        const response = await makeGETRequest('http://localhost:3001/favourites/26')
        assert.isArray(response);
        assert.isAtLeast(response.length, 1);
        assert.isObject(response[1]);
    })
})

describe('#testRestaurantsAPI', () => {
    it('Should return all the details of a restaurant', async () => {
        const response = await makeGETRequest('http://localhost:3001/restaurants/1')
        assert.isObject(response);
        assert.strictEqual(response.restaurant_ID, 1);
        assert.strictEqual(response.cover_image.slice(0,5), 'https')
        assert.isBelow(response.vegan, 2)
        assert.strictEqual(response.zipcode.toString().length, 5)
    })
})

describe('#testDishAPI', () => {
    it('Should return details of a dish given the ID', async () => {
        const response = await makeGETRequest('http://localhost:3001/dish/3')
        assert.isObject(response);
        assert.isNotNull(response.dish_ID);
        assert.isNumber(response.dish_ID);
        assert.isString(response.dish_name);
        assert.strictEqual(response.dish_image.slice(0,5), 'https')
    })
})