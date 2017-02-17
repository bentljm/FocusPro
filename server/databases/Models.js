'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV;
var config = require(__dirname + '???'); 
var db ={};

// Create a sequelize connection to the database using the URL in ???
if (config.use_env_variable) {
	
} else {

}



var models = require('./Models');
models.sequelize.authenticate().then(function () { // Test connection
	console.log('Connection successful');
}).catch(function (err) { // Error handling
	console.log('ERROR CREATING CONNECTION:', error); 
})