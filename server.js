const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// defines url to load index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

// defines url to load notes.html
app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
    res.json(db);
});

app.post('/api/notes', (req, res) => {
    res.send(`${req.method} request received!`)
    console.log(`${req.method} request received!`)

    // random number generator to get a string of 5 random numbers to use as the id
    let id = [];
    for (let i = 0; i < 5; i++) {
        id.push(Math.floor(Math.random()* 10));
    };

    // this sets the first property of req.body as the value of title, and the second as text
    const {title, text} = req.body

    if (title && text && id) {
        // create a new object to be sent back to the front-end and saved in db.json
        const newNote = {
            title,
            text,
            note_id: id.join("")
        };
        console.log('new object to be pushed:', newNote)

        // get data of current DB file, parse (make json string into JS array) data, push new object into array, stringify array, append file with new array
        fs.readFile('./db/db.json', 'UTF-8', (err, data) => {
            if (err) {
                console.log(err);
            }
            
            let notesArr = JSON.parse(data); //convert json string into JS array
            notesArr.push(newNote); // push newNote to array
            
            let newNotesArr = JSON.stringify(notesArr, null, 4); //stringify new array
            console.log('data to be written: ', newNotesArr);

            // append file with new array
            fs.writeFile('./db/db.json', newNotesArr, (err) => {
                err ? console.error(err) : console.log("db file written successfully!");
            });
        });
    } else {
        console.log(`Unable to ${req.method}`)
    }
});

app.delete('/api/notes/:id', (req, res) => {
    res.send(`${req.method} request received`)
    console.log(`${req.method} request received`)
    const idParam = req.params.id
    // read and parse file
    fs.readFile('./db/db.json', (err, data) => {
        let notesArr = JSON.parse(data)
       
        // iterate through the array and check for an object with the id that matches req.params.id
        for (note of notesArr) {
            // if the note has an id that equals the id of the url parameter
            if (note.note_id == idParam) {
                let i = notesArr.indexOf(note); // get the index of that note in the array
                notesArr.splice(i, 1); // use the index to splice that note from the array
            }
        };
        
        let newNotesArr = JSON.stringify(notesArr, null, 4)
        console.log('data to be written: ', newNotesArr);

        fs.writeFile('./db/db.json', newNotesArr, (err) => {
            err ? console.error(err) : console.log('deletion complete and db file written')
        });
    });
});

// activates server on localhost:PORT
app.listen(PORT, () => {
    console.log(`Express server is listening on port ${PORT}`)
});