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

describe('GET and POST requests to /api/users/:auth0_id/goals', () => {
    //load dummy data
  beforeEach((done) =>{
    var user1 = {username: 'dummy3', auth0_id: 'auth_id3', daily_goal: 'wakeup earlier than yesterday'};
    db.User.create(user1).then(function(user) {
      global.UserId = user.id;
      global.authId = user.auth0_id;
      done();
    });
  });

  //clean dummy data
  afterEach((done) =>{
    // delete all users in db
    db.User.destroy({where: {}}).then((num) => {
      return db.Goal.destroy({where: {}});
    })
    .then(()=>{
      return db.Subgoal.destroy({where: {}});
    })
    .then(()=>{
      done();
    });
    // done();
  });

  describe('POST a new goal', () =>{
    it('/api/users/:auth0_id/goals creates a goal', (done) =>{
      const goalA = {goal: 'Mow Lawn', progress: 10, goal_picture: 'Picture'};
      request(app)
      .post('/api/users/auth_id3/goals')
      .send(goalA)
      .end((err, res) =>{
        if (err) {
          console.error('POST /api/users/username/goals \n', err);
        }
        expect(res.statusCode).to.equal(201);
        expect(res.body.data.goal).to.equal(goalA.goal);
        expect(res.body.data.progress).to.equal(goalA.progress);
        expect(res.body.data.goal_picture).to.equal(goalA.goal_picture);
        done();
      });
    });

    it('/api/goals/:goal_id/subgoals creates a subgoal', (done) =>{
      const goalA = {goal: 'Mow Lawn', progress: 5, goal_picture: 'Picture', UserId: UserId};
      db.Goal.create(goalA)
      .then((goal)=>{
        var subgoalAPI = '/api/goals/' + goal.id + '/subgoals';
        var subgoalReq = {subgoal:'front yard', status: false};
        // console.log('subgoalAPI',subgoalAPI);
        // console.log('subgoalReq',subgoalReq);
        request(app)
        .post(subgoalAPI)
        .send(subgoalReq)
        .end((err, res)=>{
          if (err) {
            console.error('POST /subgoal \n', err);
          }
          // console.log(res.body);
          expect(res.statusCode).to.equal(201);
          expect(res.body.data.GoalId).to.equal(goal.id);
          expect(res.body.data.subgoal).to.equal(subgoalReq.subgoal);
          expect(res.body.data.status).to.equal(subgoalReq.status);
        });
        done();
      });
    });
  });

  describe('GET all goals', () =>{
    it('/api/users/:auth0_id/goals fetches all goals given user has goals', (done) =>{
      var goal = {goal: 'Mow Lawn', progress: 10, goal_picture: 'Picture', UserId: UserId};
      // console.log('goal obj',goal);
      var reqAPI = `/api/users/${authId}/goals`;
      // console.log('auth API', reqAPI);
      db.Goal.create(goal).then(function(goal) {
        // console.log('goal created',goal.goal); //UserID not created
        request(app)
        .get(reqAPI)
        .end((err, res) =>{
          if (err) {
            console.error('GET /api/users \n', err);
          }
          // console.log('get res', res.body.data);
          expect(res.statusCode).to.equal(200);
          expect(res.body.data.some((goal) =>goal.goal === 'Mow Lawn')).to.be.true;
          done();
        });
      });
    });
  });

  it('/api/users/:auth0_id/goals fetches no goal given user has no goals', (done) =>{
    request(app)
    .get('/api/users/auth_id3/goals')
    .end((err, res) =>{
      if (err) {
        console.error('GET /api/users \n', err);
      }
      expect(res.statusCode).to.equal(200);
      expect(res.body.data.length).to.equal(0);
      done();
    });
  });

  it('/api/goals/:goal_id/subgoals', (done)=>{
    var goal = {goal: 'Mow Lawn', progress: 30, goal_picture: 'Picture', UserId: UserId};
    var goalId, endpoint;
    db.Goal.create(goal).then(function(goal) {
      // console.log('goal in subgoal', goal);
      goalId = goal.id;
      endpoint = `/api/goals/${goalId}/subgoals`;
      // console.log('endpt', endpoint);
    })
    .then(()=>{
      db.Subgoal.create({subgoal:'front yard', status: false, GoalId: goalId})
      .then((subgoal)=>{
        request(app)
        .get(endpoint)
        .end((err, res)=>{
          // console.log('subgoal', res.body,subgoal);
          done();
        });

      });
    });

  });

});

