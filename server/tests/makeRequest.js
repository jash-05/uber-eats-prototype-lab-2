const axios = require('axios');

makeGETRequest = async (url) => {
    axios.defaults.headers.common['authorization'] = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcl9JRCI6ImY5OGU1NWRhLTU4OWMtNDVlYi1iNmNmLTdlOWNmYzBkMmRhZSIsImlhdCI6MTYzNjcxNjMwNiwiZXhwIjoxNjM3NzI0MzA2fQ.BqxbeeVLJnlW1WdR4Z2VhnN0pzC3lIxBlBijKodcSCI";
    const response = await axios.get(url);
    return response.data
}

makePOSTRequest = async (url, data) => {
    axios.defaults.headers.common['authorization'] = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcl9JRCI6ImY5OGU1NWRhLTU4OWMtNDVlYi1iNmNmLTdlOWNmYzBkMmRhZSIsImlhdCI6MTYzNjcxNjMwNiwiZXhwIjoxNjM3NzI0MzA2fQ.BqxbeeVLJnlW1WdR4Z2VhnN0pzC3lIxBlBijKodcSCI";
    const response = await axios.post(url, data);
    return response.data
}

// makePOSTRequest('http://localhost:3001/favourites', {customer_ID: 26, restaurant_ID: 2})

module.exports = {makeGETRequest, makePOSTRequest}