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

describe('GET and POST requests to /api/users', () =>{

  //load dummy data
  beforeEach((done) =>{
    var user1 = {username: 'dummy1', email: 'example@gmail.com', auth0_id: 'auth_id1', daily_goal: 'wakeup early'};
    var user2 = {username: 'dummy2', email: 'example2@gmail.com', auth0_id: 'auth_id2', daily_goal: 'sleep early'};
    db.User.create(user2).then(function(user) {
      db.User.create(user1).then(function(user) {
        global.UserId = user.id;
        var goal = {goal: 'Mow Lawn', progress: 10, goal_picture: 'Picture', UserId: UserId};
        db.Goal.create(goal).then(function(goal) {
          done();
      });
    });
  });

  //clean dummy data
  afterEach((done) =>{
    //delete all users in db
    db.User.destroy({where: {}}).then((num) => {
      done();
    });
  });

  describe('POST a new user', () =>{
    it('/api/users creates a user', (done) =>{
      const userA = {username: 'dummyA', email: 'example@gmail.com', auth0_id: 'auth_idA', daily_goal: 'pushup x10'};
      request(app)
      .post('/api/users')
      .send(userA)
      .end((err, res) =>{
        if (err) {
          console.error('POST /api/users \n', err);
        }
        expect(res.statusCode).to.equal(201);
        expect(res.body.data.username).to.equal(userA.username);
        expect(res.body.data.auth0_id).to.equal(userA.auth0_id);
        expect(res.body.data.daily_goal).to.equal(userA.daily_goal);
        done();
      });
    });
  });

  describe('GET all users', () =>{
    it('/api/users fetches all users', (done)=>{
      request(app)
      .get('/api/users')
      .end((err, res) =>{
        if (err) {
          console.error('GET /api/users \n', err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.some((user) =>user.username === 'dummy1')).to.be.true;
        expect(res.body.data.some((user) =>user.username === 'dummy2')).to.be.true;
        done();
      });
    });

    it('/api/users/:auth0_id fetches a user given user exists', (done) =>{
      request(app)
      .get('/api/users/auth_id1')
      .end((err, res) =>{
        if (err) {
          console.error('GET /api/users \n', err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body.data[1]).to.equal.false;
        expect(res.body.data[0].username).to.equal('dummy1');
        done();
      });
    });

    it('/api/users/:auth0_id creates a user given user does not exist', (done) =>{
      request(app)
      .get('/api/users/auth_id_NA')
      .end((err, res) =>{
        if (err) {
          console.error('GET /api/users \n', err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.length).to.equal(2);
        expect(res.body.data[1]).to.equal.true;
        expect(res.body.data[0].auth0_id).to.equal('auth_id_NA');
        done();
      });
    });
  });
});


//create a set daily_goal route