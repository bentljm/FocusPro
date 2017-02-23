var router = require('../routers.js');
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json());
var routes = router(app, '');
const request = require('supertest');
const pg = require('pg');
const db = require('../databases/Schema.js');

const chai = require('chai');

const expect = chai.expect;

//set up DB connection
before((done)=>{
  //more on connection: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.WKyhjBIrInU
  const connectionString = process.env.DATABASE_URL || require('../config/config.js').LOCAL_DATABASE_URL;
  global.client = new pg.Client(connectionString);
  global.client.connect();
  done();
});

/*
 quote: Sequelize.STRING,
  reflection_freq: Sequelize.INTEGER,
  reminder: Sequelize.BOOLEAN,
  reminder_type: Sequelize.STRING,
  reminder_freq: Sequelize.INTEGER,
  reminder_address: Sequelize.STRING
  */

//load dummy data
beforeEach((done)=>{
  var setting1 = {picture: 'picture1', quote: 'ian', reflection_freq: '1', reminder: 'false',
  reminder_freq: '2', reminder_address: 'maplestreet'};
  var setting2 = {picture: 'picture2', quote: 'ian', reflection_freq: '1', reminder: 'true',
  reminder_freq: '2', reminder_address: 'applestreet'};

  var user1 = {username: 'dummy1', auth0_id: 'auth_id1', daily_goal: 'wakeup early'};
  var user2 = {username: 'dummy2', auth0_id: 'auth_id2', daily_goal: 'sleep early'};
  db.User.create(user2).then(function(user){
  	db.Setting.create(setting2).then(function (setting) {
  		done();
  	});
  });
    db.User.create(user1).then(function(user){
     	db.Setting.create(setting2).then(function (setting) {
  		done();
  	})
     });
});


after(()=>{
  global.client.end();
});

//clean dummy data
afterEach((done)=>{
  //delete all users in db
  db.User.destroy({where:{}}).then((num)=> {
    done();
  });
});

describe('POST', ()=>{
  it('/api/users/:username/setting creates a user',(done)=>{
    const dummySetting = {picture: 'picture2', quote: 'ian', reflection_freq: '1', reminder: 'true',
  reminder_freq: '2', reminder_address: 'applestreet'};
    request(app)
    .post('/api/users/:username/setting')
    .send(dummySetting)
    .end((err,res)=>{
      if(err) {
        console.error('POST /api/users \n',err);
      }
      expect(res.statusCode).to.equal(201);
      expect(res.body.data.username).to.equal(userA.username);
      expect(res.body.data.auth0_id).to.equal(userA.auth0_id);
      expect(res.body.data.daily_goal).to.equal(userA.daily_goal);
      done();
    });
  });
});