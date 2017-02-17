var models = require('../server/databases/Models')
var url = require('url');
var express = require('express');
var app = express();
var parser  = require('body-parser');


function getAllUsers(req, res, next) {

}


module.exports = {
	getAllUsers: getAllUsers
}