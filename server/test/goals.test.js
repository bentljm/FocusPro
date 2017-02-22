process.env.NODE_ENV = 'test';

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
beforeEach((done)=>{
  //more on connection: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.WKyhjBIrInU
  const connectionString = process.env.DATABASE_URL || require('../config/config.js').LOCAL_DATABASE_URL;
  global.client = new pg.Client(connectionString);
  global.client.connect();
  done();
});

//load dummy data
beforeEach((done)=>{
  var user1 = {username: 'dummy1', auth0_id: 'auth_id1', daily_goal: 'wakeup early'};
  var user2 = {username: 'dummy2', auth0_id: 'auth_id2', daily_goal: 'sleep early'};
  console.log('before db');
  db.User.create(user2).then(function(user){
    db.User.create(user1).then(function(user){
      done();
    });
  });
  db.User.find({where: {username: 'dummy1'}}).then(function(user) {
    var UserId = user.id;
    var goal = "Mow Lawn";
    var progress = 10;
    var goal_picture = "Picture";
    db.Goal.create({goal: goal, progress: progress, goal_picture: goal_picture, UserId: UserId}).then(function(goal) {
      done();
    });
  });
});

//close DB connection
afterEach(()=>{
  global.client.end();
});

//clean dummy data
afterEach((done)=>{
  //delete all users in db
  db.User.destroy({where:{}}).then((num)=> {
    console.log('num',num);
    done();
  });
});

describe('POST', ()=>{
  it('/api/users/:username/goals creates a goal',(done)=>{
    const goalA = {goal: "Mow Lawn", progress: 10, goal_picture: "Picture", UserId: 1};
    request(app)
    .post('/api/users/1/goals')
    .send(goalA)
    .end((err,res)=>{
      if(err) {
        console.error('POST /api/users \n',err);
      }
      expect(res.statusCode).to.equal(201);
      expect(res.body.data.goal).to.equal(userA.goal);
      expect(res.body.data.progress).to.equal(userA.progress);
      expect(res.body.data.goal_picture).to.equal(userA.goal_picture);
      done();
    });
  });
});

describe('GET', ()=>{
  it('/api/users/:username/goals fetches all goals',(done)=>{
    request(app)
    .get('/api/users/1/goals')
    .end((err,res)=>{
      if(err) {
        console.error('GET /api/users \n',err);
      }
      expect(res.statusCode).to.equal(200);
      expect(res.body.data.length).to.equal(2);
      done();
    });
  });
});
//create a set daily_goal route