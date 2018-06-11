var express = require('express')
var fs = require('fs');
var cors = require('cors')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var app = express();

const MongoClient = require('mongodb').MongoClient;
var configdata = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
global.config = configdata.config;
var ObjectID = require('mongodb').ObjectID;

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
    let user = await db.collection("users").findOne({ 'email': req.body.email, 'pass': req.body.pass });
    if (user) {
        delete user.pass;
        user['token'] = jwt.sign({
            data: user.email
        }, global.config.secret, { expiresIn: 60 * 60 });
    }
    res.json(user)
})

app.post('/register', async function (req, res) {
    let dbo = await MongoClient.connect(global.config.mongourl);
    let db = dbo.db();
    let saveddata = await db.collection("users").insertOne(req.body);
    res.json(saveddata)
})

app.post('/gettickets', async function (req, res) {
    let dbo = await MongoClient.connect(global.config.mongourl);
    let db = dbo.db();
    console.log(req.body)
    if (req.body.user) {
        res.json(await db.collection("tickets").find({ 'user': req.body.user }).toArray())
    } else {
        res.json(await db.collection("tickets").find({}).toArray())
    }
})

app.post('/changeticketstatus', async function (req, res) {
    let dbo = await MongoClient.connect(global.config.mongourl);
    let db = dbo.db();
    console.log(req.body)
    res.json(await db.collection("tickets").update({ "_id": ObjectID(req.body.ticket) },
        {
            $set: { 'status': 'done' }
        }))
})

app.post('/addticket', async function (req, res) {
    let dbo = await MongoClient.connect(global.config.mongourl);
    let db = dbo.db();
    let data = req.body;
    data.status = 'pending'
    let saveddata = await db.collection("tickets").insert(data);
    res.json(saveddata)
})

app.listen(global.config.port)