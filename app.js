const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookiePaser = require('cookie-parser');
dotenv.config({path:'./.env'});
const app = express();
const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
})
const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookiePaser());
console.log(__dirname);
app.set('view engine','hbs');
db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("mysql connected....")
    }
})

app.use(cors());
// parse application/json
app.use(bodyParser.json());
//Define Routes
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));
app.listen()
