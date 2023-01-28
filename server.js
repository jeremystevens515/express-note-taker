const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// defines homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});
// defines notes.html
app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
    res.json(db);
});

// app.post('/api/notes', (req, res) => {

// });

// activates server on localhost:PORT
app.listen(PORT, () => {
    console.log(`Express server is listening on port ${PORT}`)
});