const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const phones = require('./phones.json');


app.use(cors());

app.get('/', (req, res) => {
    res.send('my phones server coming soon')
});

app.get('/phones', (req, res) => {
    res.send(phones);
})

app.get('/phones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log('i need data for id: ', id);
    const phone = phones.find(phone => phone.id === id) || {};
    res.send(phone);
})

app.listen(port, () => {
    console.log(`My phone server is running on port: ${port}`);
})