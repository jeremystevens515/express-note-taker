const express = require('express');
const fs = require('fs');
const db = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname,'./public/index.html');
})

app.listen(PORT, () => {
    console.log(`Express server is listening on port ${PORT}`)
});