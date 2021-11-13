const { makeGETRequest, makePOSTRequest } = require('./makeRequest.js');
const chai = require('chai');
const assert = chai.assert;

describe('#testCustomerDetailsAPI', () => {
    it('Should return the correct customers details', async () => {
        const response = await makeGETRequest('http://localhost:3001/customers/f98e55da-589c-45eb-b6cf-7e9cfc0d2dae')
        assert.isObject(response);
        assert.strictEqual(typeof response, "object")
    })
})

describe('#testaddFavouritesAPI', () => {
    it('should add a favourite restaurant for customer', async () => {
        const customer_ID = "f98e55da-589c-45eb-b6cf-7e9cfc0d2dae";
        const restaurant_ID = "457d2d5c-a87e-4da2-bca0-0370a7d500ed";
        const data = {
            customer_ID: customer_ID,
            restaurant_ID: restaurant_ID
        }
        const response = await makePOSTRequest('http://localhost:3001/favourites', data)
        assert.isObject(response);
    })
})

describe('#testGetFavouritesAPI', () => {
    it("Should return the customer's favourite restaurants", async () => {
        const response = await makeGETRequest('http://localhost:3001/favourites/f98e55da-589c-45eb-b6cf-7e9cfc0d2dae')
        assert.isArray(response);
        assert.isAtLeast(response.length, 1);
    })
})

describe('#testRestaurantsAPI', () => {
    it('Should return all the details of a restaurant', async () => {
        const response = await makeGETRequest('http://localhost:3001/restaurants/b1d40890-36e2-4bf4-bb2f-f8b4d94f6350')
        assert.isObject(response);
    })
})

describe('#testDishAPI', () => {
    it('Should return details of a dish given the ID', async () => {
        const response = await makeGETRequest('http://localhost:3001/dish/292a0628-c1a8-4051-b2e8-3aede33defc8')
        assert.isObject(response);
    })
})