const express = require('express');
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));
const cors = require("cors");

const path = require('path');

const app = express()
const port = 3000

app.listen(port, () => console.log("Server started"))

const db = new PouchDB("exerciseDB")

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/Client'));



app.get('/exercise', function(req, res){
  if (req.query.user != null){
    findUser(req.query.user).then(function(data){
      res.send(data);
    });
  }
});

async function findUser(userName){
  await db.createIndex({
    index: {fields: ['user']}
  });
  return db.find({
    selector: { user: userName },
    fields: ['user', 'description', 'duration', 'date'],
  });  
}


app.post("/exercise", async (req, res) => {
  db.post({
    description: req.body.description,
    user: req.body.user,
    duration: req.body.duration,
    date: req.body.date,
    type: "exercise"
  }).then(function (response) {
    res.send(response);
  }).catch(function (err) {
    console.log(err);
  });
});





app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'Client/index.html'));
})