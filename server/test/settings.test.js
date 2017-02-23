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

//load dummy data
beforeEach((done)=>{
  var setting1 = {picture: 'picture1', quote: 'ian', reflection_freq: '1', reminder: 'false',
  reminder_freq: '2', reminder_address: 'maplestreet'};
  var setting2 = {picture: 'picture2', quote: 'ian', reflection_freq: '1', reminder: 'true',
  reminder_freq: '2', reminder_address: 'applestreet'};

  var user1 = {username: 'dummy1', auth0_id: 'auth_id1', daily_goal: 'wakeup early'};
  var user2 = {username: 'dummy2', auth0_id: 'auth_id2', daily_goal: 'sleep early'};

  var extension1 = {url: 'www.blah.com', time_spent: 2, freq: 30}
  var extension2 = {url: 'www.bloh.com', time_spent: 3, freq: 15}

  var url1 =
  var url2 =  

  db.User.create(user2).then(function(user){
  	db.Setting.create(setting2).then(function (setting) {
  		done();
    });
    db.Url.create(url2).then(function(site) {
    	done();
    });
    db.Extension
  });
    db.User.create(user1).then(function(user){
     	db.Setting.create(setting2).then(function (setting) {
  		done();
  	});
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

describe('POST New Settings', ()=>{
  it('/api/users/:username/setting creates a user',(done)=>{
    const dummySetting = {picture: 'picture2', quote: 'ian', reflection_freq: '1', reminder: 'true',
  reminder_freq: '2', reminder_address: 'applestreet'};
    request(app)
    .post('/api/users/:username/setting')
    .send(dummySetting)
    .end((err,res)=>{
      if(err) {
        console.error('POST /api/users/:username/setting \n',err);
      }
      expect(res.statusCode).to.equal(201);
      expect(res.body.data.picture).to.equal(userA.picture);
      expect(res.body.data.quote).to.equal(userA.quote);
      expect(res.body.data.reflection_freq).to.equal(userA.reflection_freq);
      expect(res.body.data.reminder).to.equal(userA.reminder);
      expect(res.body.data.reminder_freq).to.equal(userA.reminder_freq);
      expect(res.body.data.reminder_address).to.equal(userA.reminder_address);
      done();
    });
  });
});


describe('GET All Settings', ()=>{
  it('/api/users/:username/setting fetches all settings',(done)=>{
    request(app)
    .post('/api/users/:username/setting')
    .end((err,res)=>{
      if(err) {
        console.error('GET /api/users/:username/setting \n',err);
      }
      expect(res.statusCode).to.equal(200);
      expect(res.body.data.length).to.equal(2);
      expect(res.body.data.some((user)=>user.username==='setting1')).to.be.true;
      expect(res.body.data.some((user)=>user.username==='setting2')).to.be.true;
      done();
    });
  });
});



describe('POST New Blacklist Websites', ()=>{
  it('/api/users/:username/setting/blacklist creates a new blacklisted website',(done)=>{
    const dummySetting = {picture: 'picture2', quote: 'ian', reflection_freq: '1', reminder: 'true',
  reminder_freq: '2', reminder_address: 'applestreet'};
    request(app)
    .post('/api/users/:username/setting')
    .send(dummySetting)
    .end((err,res)=>{
      if(err) {
        console.error('POST /api/users/:username/setting \n',err);
      }
      expect(res.statusCode).to.equal(201);
      expect(res.body.data.picture).to.equal(userA.picture);
      expect(res.body.data.quote).to.equal(userA.quote);
      expect(res.body.data.reflection_freq).to.equal(userA.reflection_freq);
      expect(res.body.data.reminder).to.equal(userA.reminder);
      expect(res.body.data.reminder_freq).to.equal(userA.reminder_freq);
      expect(res.body.data.reminder_address).to.equal(userA.reminder_address);
      done();
    });
  });
});


describe('GET All Blacklisted Websites', ()=>{
  it('/api/users/:username/setting fetches all blacklisted websites',(done)=>{
    request(app)
    .post('/api/users/:username/setting')
    .end((err,res)=>{
      if(err) {
        console.error('GET /api/users/:username/setting \n',err);
      }
      expect(res.statusCode).to.equal(200);
      expect(res.body.data.length).to.equal(2);
      expect(res.body.data.some((user)=>user.username==='setting1')).to.be.true;
      expect(res.body.data.some((user)=>user.username==='setting2')).to.be.true;
      done();
    });
  });
});

describe('GET All Extension Data', ()=>{
  it('/api/users/:username/extension_data fetches all extension data',(done)=>{
    request(app)
    .post('/api/users/:username/setting')
    .end((err,res)=>{
      if(err) {
        console.error('GET /api/users/:username/setting \n',err);
      }
      expect(res.statusCode).to.equal(200);
      expect(res.body.data.length).to.equal(2);
      expect(res.body.data.some((user)=>user.username==='setting1')).to.be.true;
      expect(res.body.data.some((user)=>user.username==='setting2')).to.be.true;
      done();
    });
  });
});