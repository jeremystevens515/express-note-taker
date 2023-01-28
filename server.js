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

app.post('/api/notes', (req, res) => {
    // res.send(`${req.method} request received!`)
    console.log(`${req.method} request received!`)

    // random number generator to get a string of 5 random numbers to use as the id
    let id = [];
    for (let i = 0; i < 5; i++) {
        id.push(Math.floor(Math.random()* 10));
    };

    // this sets the first property of req.body as the value of title, and the second as text
    const { title, text} = req.body

    // create a new object to be sent back to the front-end and saved in db.json
    const newNote = {
        title,
        text,
        note_id: id.join("")
    };

    fs.appendFile('./db/db.json', JSON.stringify(newNote), (err) => {
        err ? console.error(err) : console.log("new note appended successfully!")
    });
    
    res.json(newNote);
    console.log(newNote)
});

// activates server on localhost:PORT
app.listen(PORT, () => {
    console.log(`Express server is listening on port ${PORT}`)
});