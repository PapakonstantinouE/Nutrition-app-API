const express = require('express')
var cors = require('cors');


var app = express();
var port = 8000;

app.use(cors());

app.get('/hello', (req, res) => res.send('Hello World!'))
app.get('/hellooo', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
