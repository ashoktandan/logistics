var express = require('express')
var fs = require('fs');
var cors = require('cors')
var bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
var app = express();
var configdata = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
global.config = configdata.config;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async function (req, res) {
    let dbo = await MongoClient.connect(global.config.mongourl);
    let db = dbo.db();
    let data = await db.collection("users").find().toArray();
    res.json(data)
})
app.post('/login', async function (req, res) {
    console.info(req.body)
    let dbo = await MongoClient.connect(global.config.mongourl);
    let db = dbo.db();
    let user = await db.collection("users").findOne({'email':req.body.email,'pass':req.body.pass});
    res.json(user)
})
app.post('/insert', async function (req, res) {
    let dbo = await MongoClient.connect(global.config.mongourl);
    let db = dbo.db();
    let saveddata = await db.collection("users").insertOne(req.body);
    res.json(saveddata)
})

app.listen(global.config.port)