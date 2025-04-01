const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;



// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

app.get('/', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/2-42750920?properties=name,description,price,foodid';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Records | Integrating With HubSpot | Practicum', data });
    } catch (error) {
        console.error(error);
    }
});



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here


app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot | Practicum'
    });
});



// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/update-cobj', async (req, res) => {
    try {

        const batchContactData = {
            "inputs": [
                {
                    "idProperty": "foodid",
                    "id": req.body.foodid,
                    "properties": {
                        "foodid": req.body.foodid,
                        "name": req.body.name,
                        "description": req.body.description,
                        "price": req.body.price
                    }
                }
            ]
        }

        const response = await axios.post(`https://api.hubspot.com/crm/v3/objects/2-42750920/batch/upsert`, batchContactData,
            {
                headers:
                {
                    'Authorization': `Bearer ${PRIVATE_APP_ACCESS}`,
                    'Content-Type': 'application/json'
                }
            })
        if (response) {
            res.redirect('/');
        } else {
            res.redirect('/error');
        }
    } catch (error) {
        console.error('Error creating custom object record:', error);
        res.status(500).send('Error creating custom object record');
    }
});



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));