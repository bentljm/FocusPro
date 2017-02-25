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


describe('GET and POST requests FOR SETTINGS', () => {
    //load dummy data
  beforeEach((done) =>{
    var user1 = {username: 'dummy3', email: 'example@gmail.com', auth0_id: 'auth_id3', daily_goal: 'wakeup earlier than yesterday'};
    var user2 = {username: 'dummy2', email: 'example1@gmail.com', auth0_id: 'auth_id4', daily_goal: 'wakeup before noon'};
    global.authId = 'auth_id3';
    global.authId2 = 'auth_id4';

    global.setting1 = {picture: 'Dumb', quote: 'Laconic', reflection_freq: 10, reminder: false, reminder_type: 'Regular', reminder_freq: 10, reminder_address: 'Apple Street'};
    global.setting2 = {picture: 'Dumb2', quote: 'Laconic2', reflection_freq: 20, reminder: true, reminder_type: 'Regular2', reminder_freq: 20, reminder_address: 'Apple Street'};
    global.blacklist = {url: 'www.gmail@com', blacklist_type: 'Infrequent', blacklist_time: 10};


    db.User.create(user1).then(function(user) {
      global.UserId1 = user.id;
      setting1.UserId = UserId1;
      db.User.create(user2).then(function(user2) {
        global.UserId2 = user2.id;
        setting2.UserId = UserId2;
        db.Setting.create(setting1).then(function(setting) {
          // global.SettingId1 = setting.id;
          db.Setting.create(setting2).then(function(setting2) {
            // global.SettingId2 = setting2.id;
            done();
          //  });
          });
        });
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


  describe('POST NEW SETTINGS and blacklist URL', () =>{
    it('/api/users/:auth0_id/setting creates settings', (done) =>{
      const dummySetting = {UserId: UserId, picture: 'Dumb3', quote: 'Laconic3', reflection_freq: 30, reminder: false, reminder_type: 'Regula3r', reminder_freq: 30, reminder_address: 'Apple Street3'};
      request(app)
      .post('/api/users/auth_id3/setting')
      .send(dummySetting)
      .end((err, res) =>{
        if (err) {
          console.error('POSTING TO SETTINGS ERROR: \n', err);
        }
        expect(res.statusCode).to.equal(201);
        expect(res.body.data.picture).to.equal(dummySetting.picture);
        expect(res.body.data.quote).to.equal(dummySetting.quote);
        expect(res.body.data.reflection_freq).to.equal(dummySetting.reflection_freq);
        expect(res.body.data.reminder).to.equal(dummySetting.reminder);
        expect(res.body.data.reminder_address).to.equal(dummySetting.reminder_address);
        expect(res.body.data.reminder_freq).to.equal(dummySetting.reminder_freq);
        expect(res.body.data.reminder_type).to.equal(dummySetting.reminder_type);
        done();
      });
    });
    // it('/api/users/:auth0_id/setting/blacklist adds new blacklist url', (done)=>{
    //   request(app)
    //   .get(`/api/users/${authId2}/setting`)
    //   .end((err,res)=>{
    //     if (err) {
    //       console.error('GETTING SETTINGS ERROR: \n', err);
    //     }

    //   });
    //   done();
    // });
  });


  describe('GET all settings', () =>{
    it('/api/users/:auth0_id/setting fetches all settings', (done) =>{
      request(app)
      .get(`/api/users/${authId2}/setting`)
      .end((err, res) =>{
        if (err) {
          console.error('GETTING SETTINGS ERROR: \n', err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.picture).to.equal(setting2.picture);
        expect(res.body.data.quote).to.equal(setting2.quote);
        expect(res.body.data.reflection_freq).to.equal(setting2.reflection_freq);
        expect(res.body.data.reminder).to.equal(setting2.reminder);
        expect(res.body.data.reminder_address).to.equal(setting2.reminder_address);
        expect(res.body.data.reminder_address).to.equal(setting2.reminder_address);
        expect(res.body.data.reminder_address).to.equal(setting2.reminder_address);
        expect(res.body.data.reminder_freq).to.equal(setting2.reminder_freq);
        expect(res.body.data.reminder_type).to.equal(setting2.reminder_type);
        done();
      });
    });
  });

});
  /// BLACKLISTS
// describe('GET and POST Chrome extension data', ()=>{
//   beforeEach();
//   afterEach();
// });

/*
    describe('POST NEW BLACKLISTS', () =>{
    it('/api/users/:auth0_id/setting/blacklist creates settings',(done) =>{
      console.log('POST in BLACKLISTS', SettingId);
      const dummyBlackList = {SettingId: SettingId, url: 'www.gmail@com', blacklist_type: 'Infrequent', blacklist_time: 10}
      request(app)
      .post('/api/users/auth_id3/setting/blacklist')
      .send(dummyBlacklist)
      .end((err,res) =>{
        if(err) {
          console.error('POSTING TO BLACKLIST ERROR: \n',err);
        }
        console.log(res.body.data);
        expect(res.statusCode).to.equal(201);
        expect(res.body.data.url).to.equal(dummySetting.url);
        expect(res.body.data.blacklist_time).to.equal(dummySetting.blacklist_time);
        expect(res.body.data.blacklist_type).to.equal(dummySetting.blacklist_type);
        done();
      });
    });
  });

});


  describe('GET all blacklists', () =>{
    it('/api/users/:auth0_id/setting fetches all goals given user has goals',(done) =>{
      const dummyBlackList = {UserId: UserId, url: 'www.gmail@com', blacklist_type: 'Infrequent', blacklist_time: 10}
        db.Url.create(blacklist).then(function(url){
      });
      request(app)
      .get('/api/users/auth_id3/setting/blacklist'
      .end((err,res) =>{
        if(err) {
          console.error('GETTING SETTINGS ERROR: \n',err);
        }
        expect(res.statusCode).to.equal(200);
        console.log(res.body.data);
        done();
      });
    });
  });

  describe('GET all extended data', () =>{
    it('/api/users/:auth0_id/extension_data fetches all goals given user has goals',(done) =>{

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

  */

