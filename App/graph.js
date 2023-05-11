const { Client } = require('@microsoft/microsoft-graph-client');
const axios = require('axios');


const getGraphClient = (accessToken) => {
    const graphClient = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });

    return graphClient;
};

module.exports = getGraphClient;

