//Import routes from another file
var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var app = express();

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '../client')));


var port = process.env.PORT || 7777;
app.listen(port, function() {
  console.log('Listening on ', port);
});