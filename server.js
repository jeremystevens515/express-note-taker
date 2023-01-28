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
    const {title, text} = req.body

    // create a new object to be sent back to the front-end and saved in db.json
    const newNote = {
        title,
        text,
        note_id: id.join("")
    };
    console.log('new note after object created:', newNote)

    // get data of current DB file, parse (make json string into JS array) data, push new object into array, stringify array, append file with new array
    fs.readFile('./db/db.json', 'UTF-8', (err, data) => {
        if (err) {
            console.log(err)
        }
        
        let dbArr = JSON.parse(data) //convert json string into JS array
        // console.log('after parsing data:', dbArr)
        dbArr.push(newNote) // push newNote to array
        // console.log('after pushing newNote: ', dbArr)
        let newDbArr = JSON.stringify(dbArr) //stringify new array
        console.log('data to be written: ', newDbArr)

        // append file with new array
        fs.writeFile('./db/db.json', newDbArr, (err) => {
            err ? console.error(err) : console.log("db file written successfully!")
        });
    });
    
    // how to send most updated db.json?
    // currently this is one version behind
    res.json(db);
});


// activates server on localhost:PORT
app.listen(PORT, () => {
    console.log(`Express server is listening on port ${PORT}`)
});