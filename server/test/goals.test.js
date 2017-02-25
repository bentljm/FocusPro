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

describe('GET and POST and DELETE requests to /api/users/:auth0_id/goals', () => {
    //load dummy data
  beforeEach((done) =>{
    var user1 = {username: 'dummy3', email: 'example@gmail.com', auth0_id: 'auth_id3', daily_goal: 'wakeup earlier than yesterday'};
    db.User.create(user1).then(function(user) {
      global.UserId = user.id;
      global.authId = user.auth0_id;
    })
    .then(()=>{
      const goalA = {goal: 'Mow Lawn', progress: 5, goal_picture: 'Picture', UserId: UserId};
      return db.Goal.create(goalA)
      .then((goal)=>{
        global.goalId = goal.id;
        global.subgoalAPI = '/api/goals/' + goal.id + '/subgoals';
        global.subgoalPOSTReq = {subgoal: 'front yard', status: false};
      });
    })
    .then(()=>{
      done();
    });
  });

  //clean dummy data
  afterEach((done) =>{
    db.Subgoal.destroy({where: {}})
    .then(()=>{
      return db.Goal.destroy({where: {}});
    })
    .then(()=>{
      return db.User.destroy({where: {}});
    })
    .then(()=>{
      done();
    });
  });

  describe('POST a new goal or subgoal', () =>{
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
      request(app)
      .post(subgoalAPI)
      .send(subgoalPOSTReq)
      .end((err, res)=>{
        if (err) {
          console.error('POST /subgoal \n', err);
        }
        expect(res.statusCode).to.equal(201);
        expect(res.body.data.GoalId).to.equal(goalId);
        expect(res.body.data.subgoal).to.equal(subgoalPOSTReq.subgoal);
        expect(res.body.data.status).to.equal(subgoalPOSTReq.status);
        done();
      });
    }); //end it
  });

  describe('GET all goals or subgoals', () =>{
    it('/api/users/:auth0_id/goals fetches all goals given user has goals', (done) =>{
      var reqAPI = `/api/users/${authId}/goals`;
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

    it('/api/users/:auth0_id/goals fetches no goal given user has no goals', (done) =>{
      db.Goal.destroy({where:{}}).then(()=>{
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
    });

    it('/api/goals/:goal_id/subgoals fetches all subgoals', (done)=>{
      db.Subgoal.create({subgoal: 'front yard', status: false, GoalId: goalId})
      .then((subgoal)=>{
        request(app)
        .get(subgoalAPI)
        .end((err, res)=>{
          expect(res.body.data.length).to.equal(1);
          expect(res.body.data[0].subgoal).to.equal('front yard');
          expect(res.body.data[0].status).to.equal.false;
          done();
        });
      });
    });

    it('/api/goals/:goal_id/subgoals fetches no subgoal given no subgoal present', (done)=>{
      db.Subgoal.destroy({where: {}})
      .then(()=>{
        request(app)
        .get(subgoalAPI)
        .end((err, res)=>{
          expect(res.body.data.length).to.equal(0);
          done();
        });
      });
    });
  });//end describe GET

  describe('DELETE a goal or a subgoal', ()=>{
    //when a goal is removed, all subgoals get removed too
  });

});//end describe GET POST DELETE

