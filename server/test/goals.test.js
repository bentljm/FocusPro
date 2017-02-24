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
before((done) =>{
  //more on connection: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.WKyhjBIrInU
  const connectionString = process.env.DATABASE_URL || require('../config/config.js').LOCAL_DATABASE_URL;
  global.client = new pg.Client(connectionString);
  global.client.connect();
  done();
});

//close DB connection
after(() =>{
  global.client.end();
});

describe('GET and POST requests to /api/users/username/goals', () => {
    //load dummy data
  beforeEach((done) =>{
    var user1 = {username: 'dummy3', email: 'example@gmail.com', auth0_id: 'auth_id3', daily_goal: 'wakeup earlier than yesterday'};
    var user2 = {username: 'dummy2', email: 'example1@gmail.com', auth0_id: 'auth_id4', daily_goal: 'wakeup before noon'};

    db.User.create(user1).then(function(user){
      global.UserId = user.id;
      db.User.create(user2).then(function(user){
        var goal = {goal: 'Mow Lawn', progress: 10, goal_picture: "Picture", UserId: UserId};
        db.Goal.create(goal).then(function(goal){
          done();
        });
      });
    });
  });

  //clean dummy data
  afterEach((done) =>{
    //delete all users in db
    db.User.destroy({where:{}}).then((num) => {
      done();
    });
  });

  describe('POST a new goal', () =>{
    it('/api/users/:auth0_id/goals creates a goal',(done) =>{
      console.log('POST in goals', UserId);
      const goalA = {goal: 'Mow Lawn', progress: 10, goal_picture: "Picture", UserId: UserId};
      request(app)
      .post('/api/users/auth_id3/goals')
      .send(goalA)
      .end((err,res) =>{
        if(err) {
          console.error('POST /api/users/username/goals \n',err);
        }
        expect(res.statusCode).to.equal(201);
        expect(res.body.data.goal).to.equal(goalA.goal);
        expect(res.body.data.progress).to.equal(goalA.progress);
        expect(res.body.data.goal_picture).to.equal(goalA.goal_picture);
        done();
      });
    });
  });

  describe('GET all goals', () =>{
    it('/api/users/:auth0_id/goals fetches all goals given user has goals',(done) =>{
      var goal = {goal: 'Mow Lawn', progress: 10, goal_picture: "Picture", UserId: UserId};
        db.Goal.create(goal).then(function(goal){
      });
      request(app)
      .get('/api/users/auth_id3/goals')
      .end((err,res) =>{
        if(err) {
          console.error('GET /api/users \n',err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.some((goal) =>goal.goal==='Mow Lawn')).to.be.true;
        done();
      });
    });
  });

  describe('GET all goals', () =>{
    it('/api/users/:auth0_id/goals fetches no goal given user has no goals',(done) =>{
      request(app)
      .get('/api/users/auth_id4/goals')
      .end((err,res) =>{
        if(err) {
          console.error('GET /api/users \n',err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.length).to.equal(0);
        done();
      });
    });
  });
})
