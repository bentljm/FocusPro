var router = require('../routers.js');
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json());
router(app, '');
const pg = require('pg');
const db = require('../databases/Schema.js');

const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

//set up DB connection
before((done)=>{
  //more on connection: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.WKyhjBIrInU
  const connectionString = process.env.TEST_DATABASE_URI || require('../config/config.js').LOCAL_DATABASE_URL;
  global.client = new pg.Client(connectionString);
  global.client.connect();

  //set up question and answer for reflection
  global.question1 = 'How did you feel about the progress towards the goal so far?';
  global.question2 = 'Any help you can get to continue pumping ahead?';
  global.question3 = 'Is the goal too stretchy? Are you able to reduce the scope or make it smarter?';
  global.answer1 = 'pretty good';
  global.answer2 = 'getting friends to hold me accountable';
  global.answer3 = 'instead of waking up 1 hr early, i will try waking up 10min early';

  //set up dummy user
  var user1 = {username: 'dummy4', auth0_id: 'auth_id4', daily_goal: 'sleep earlier than yesterday'};
  db.User.create(user1).then(function(user) {
    global.UserId = user.id;
    done();
  });
});

//close DB connection
after((done)=>{
  //delete all users in db
  db.User.destroy({where: {}}).then((num) => {
    global.client.end();
    done();
  });
});

describe('GET and POST requests to /api/users/:auth0_id/reflections', ()=>{
  beforeEach((done)=>{
    //post a reflection
    db.Reflection.create({auth0_id: 'auth_id4', answer: answer2, question: question2});
    db.Reflection.create({auth0_id: 'auth_id4', answer: answer3, question: question3}).then(()=>{ done(); });
  });

  afterEach((done)=>{
    db.Reflection.destroy({where: {}})
    .then(()=>{
      done();
    });
  });
  describe('POST a new reflection', ()=>{
    it('/api/users/:auth0_id/reflections creates user reflections', (done)=>{
      var reflection = {auth0_id: 'auth_id4', answer: answer1, question: question1};
      request(app)
      .post('/api/users/auth_id4/reflections')
      .send(reflection)
      .end((err, res)=>{
        expect(res.body.data.auth0_id).to.equal('auth_id4');
        expect(res.body.data.question).to.equal(question1);
        expect(res.body.data.answer).to.equal(answer1);
        db.Reflection.destroy({where: {}}).then(()=>{
          done();
        });
      });
    });
  });

  describe('Get reflections', ()=>{
    it('/api/users/:auth0_id/reflections fetches user reflections', (done)=>{
      request(app)
      .get('/api/users/auth_id4/reflections')
      .end((err, res)=>{
        expect(res.body.data.length).to.equal(2);
        expect(res.body.data.some((reflection) =>reflection.question === question2)).to.equal.true;
        expect(res.body.data.some((reflection) =>reflection.answer === answer3)).to.equal.true;
        done();
      });
    });
  });
});