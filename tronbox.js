require("dotenv").config({ path: "./.env" });

const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const address = process.env.REACT_APP_ADDRESS;
const address2 = process.env.REACT_APP_ADDRESS2;

module.exports = {
    networks: {
        compilers: {
            solc: {
                version: '0.8.0'
            }
        },
        development: {
            from: address,
            privateKey: privateKey,
            consume_user_resource_percent: 30,
            fee_limit: 100000000,
            fullNode: "https://api.shasta.trongrid.io",
            solidityNode: "https://api.shasta.trongrid.io", 
            network_id: "*"
        },
        production: {
            from: address2,
            privateKey: privateKey,
            consume_user_resource_percent: 30,
            fee_limit: 100000000,
            fullNode: "https://api.shasta.trongrid.io",
            solidityNode: "https://api.shasta.trongrid.io", 
            network_id: "*"
        },
    },
    solc: {
        optimizer: {
            enabled: false,
            runs: 200
        },
    }
};