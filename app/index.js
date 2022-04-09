require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// public files
app.use('/', express.static('./public/'))
app.get('*', (req, res) => {
    res.redirect('/');
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// start
app.listen(process.env.PORT)
console.log(`Server started at ${process.env.URL}:${process.env.PORT}`)