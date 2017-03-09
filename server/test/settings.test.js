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
  const connectionString = require('../config/config.js').TEST_DATABASE;
  global.client = new pg.Client(connectionString);
  global.client.connect();
  done();
});

//close DB connection
after(() =>{
  global.client.end();
});


describe('GET POST PUT DELETE requests FOR SETTINGS and BLACKLISTS', () => {
    //load dummy data
  beforeEach((done) =>{
    var user1 = {username: 'dummy3', email: 'example@gmail.com', auth0_id: 'auth_id3', daily_goal: 'wakeup earlier than yesterday'};
    var user2 = {username: 'dummy4', email: 'example1@gmail.com', auth0_id: 'auth_id4', daily_goal: 'wakeup before noon'};
    global.authId = 'auth_id3';
    global.authId2 = 'auth_id4';

    global.setting1 = {picture: 'Dumb', quote: 'Laconic', reflection_freq: 10, reminder: false, reminder_freq: 10, reminder_address: 'Apple Street'};
    global.setting2 = {picture: 'Dumb2', quote: 'Laconic2', reflection_freq: 20, reminder: true, reminder_freq: 20, reminder_address: 'Apple Street'};
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
            global.blacklist.auth0_id = user2.auth0_id;
            db.Url.create(blacklist).then((list)=>{
              global.blacklistId = list.id;
              done();
            });
          //  });
          });
        });
      });
    });
  });

  //clean dummy data
  afterEach((done) =>{
    //delete all users in db
    db.User.destroy({where: {}})
    .then((num) => {
      return db.Setting.destroy({where: {}});
    })
    .then(()=>{
      return db.Url.destroy({where: {}});
    })
    .then(()=>{
      done();
    });
  });


  describe('POST NEW SETTINGS and blacklist URL', () =>{
    it('/api/users/:auth0_id/setting creates settings', (done) =>{
      const dummySetting = {UserId: UserId1, picture: 'Dumb3', quote: 'Laconic3', reflection_freq: 30, reminder: false, reminder_freq: 30, reminder_address: 'Apple Street3'};
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
        done();
      });
    });
    it('/api/users/:auth0_id/blacklist adds new blacklist url', (done)=>{
      var urlInfo = {url: 'http://facebook.com', blacklist_time: 20, blacklist_type: 'warning'};
      request(app)
      .post(`/api/users/${authId2}/blacklist`)
      .send(urlInfo)
      .end((err, res)=>{
        if (err) {
          console.error('GETTING SETTINGS ERROR: \n', err);
        }
        expect(res.body.data.url).to.equal(urlInfo.url);
        expect(res.body.data.blacklist_time).to.equal(urlInfo.blacklist_time);
        expect(res.body.data.blacklist_type).to.equal(urlInfo.blacklist_type);
        expect(res.body.data.auth0_id).to.equal(authId2);
        done();
      });
    });
  });


  describe('GET all settings and Blacklist Urls', () =>{
    it('/api/users/:auth0_id/setting fetches all settings', (done) =>{
      request(app)
      .get(`/api/users/${authId2}/setting`)
      .end((err, res) =>{
        if (err) {
          console.error('GETTING SETTINGS ERROR: \n', err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body.data[0].picture).to.equal(setting2.picture);
        expect(res.body.data[0].quote).to.equal(setting2.quote);
        expect(res.body.data[0].reflection_freq).to.equal(setting2.reflection_freq);
        expect(res.body.data[0].reminder).to.equal(setting2.reminder);
        expect(res.body.data[0].reminder_address).to.equal(setting2.reminder_address);
        expect(res.body.data[0].reminder_freq).to.equal(setting2.reminder_freq);
        done();
      });
    });

    it('/api/users/:auth0_id/blacklist fetches blacklist urls', (done)=>{
      var urlInfo = {url: 'http://facebook.com', blacklist_time: 20, blacklist_type: 'warning'};
      request(app)
      .post(`/api/users/${authId2}/blacklist`)
      .send(urlInfo)
      .end((err, res)=>{
        if (err) {
          console.error('GETTING SETTINGS ERROR: \n', err);
        }
        request(app)
        .get(`/api/users/${authId2}/blacklist`)
        .end((err, res)=>{
          expect(res.body.data.some((url)=>url.url === urlInfo.url)).to.be.true;
          expect(res.body.data.some((url)=>url.blacklist_time === urlInfo.blacklist_time)).to.be.true;
          expect(res.body.data.some((url)=>url.blacklist_type === urlInfo.blacklist_type)).to.be.true;
          expect(res.body.data.some((url)=>url.url === blacklist.url)).to.be.true;
          expect(res.body.data.some((url)=>url.blacklist_time === blacklist.blacklist_time)).to.be.true;
          expect(res.body.data.some((url)=>url.blacklist_type === blacklist.blacklist_type)).to.be.true;
          expect(res.body.data.every((url)=>url.auth0_id === authId2)).to.be.true;
          done();
        });
      });
    });
  });

  describe('PUT a setting or a blacklist url ', ()=>{
    it('/api/users/:auth0_id/setting changes specified fields in an existing setting', (done)=>{
      const updatedSetting = {picture: 'UpdatePic', quote: 'UpdatedLaconic', reflection_freq: 40};
      request(app)
      .put(`/api/users/${authId2}/setting`)
      .send(updatedSetting)
      .end((err, res)=>{
        request(app)
        .get(`/api/users/${authId2}/setting`)
        .end((err, res)=>{
          expect(res.body.data[0].picture).to.equal(updatedSetting.picture);
          expect(res.body.data[0].quote).to.equal(updatedSetting.quote);
          expect(res.body.data[0].reflection_freq).to.equal(updatedSetting.reflection_freq);
          expect(res.body.data[0].reminder).to.equal(setting2.reminder);
          expect(res.body.data[0].reminder_address).to.equal(setting2.reminder_address);
          expect(res.body.data[0].reminder_freq).to.equal(setting2.reminder_freq);
          expect(res.body.data[0].UserId).to.equal(UserId2);
          done();
        });
      });
    });

    it('/api/blacklist/:url_id changes specified fields in an existing blacklist url', (done)=>{
      const updatedUrl = {blacklist_type: 'updated type', blacklist_time: 100};
      request(app)
      .put(`/api/blacklist/${blacklistId}`)
      .send(updatedUrl)
      .end((err, res)=>{
        expect(res.body.data[0]).to.equal(1);
        //we dont have a router that verifies a single blacklist, so only verifying 1 row change
        request(app)
        .get(`/api/users/${authId2}/blacklist`)
        .end((err, res)=>{
          expect(res.body.data[0].url).to.equal(blacklist.url);
          expect(res.body.data[0].auth0_id).to.equal(blacklist.auth0_id);
          expect(res.body.data[0].blacklist_time).to.equal(updatedUrl.blacklist_time);
          expect(res.body.data[0].blacklist_type).to.equal(updatedUrl.blacklist_type);
        });
        done();
      });
    });
  });

  describe('DELETE a blacklist url', ()=>{
    it('/api/blacklist/:url_id deletes a blacklist url', (done)=>{
      request(app)
      .delete(`/api/blacklist/${blacklistId}`)
      .end((err, res)=>{
        expect(res.body.numDeleted).to.equal(1);
        done();
      });
    });
  });
});

//Chrome Extension
describe('POST and GET request for Chrome extension', ()=>{
  beforeEach((done)=>{
    //set up a dummy user
    var user5 = {username: 'dummy5', email: 'example@gmail.com', auth0_id: 'auth_id5', daily_goal: 'sleep earlier than yesterday'};
    //get dummy user's id
    global.authId5 = user5.auth0_id;

    global.extensionData = {
      url: 'facebook.com',
      time_spent: 39,
      history: [['2017-03-01',128],['2017-03-07',39]]
    };

    //insert Chrome extension data to that dummy user {url, time_spent, history, UserId}
    db.User.create(user5).then(function(user) {
      return extensionData.UserId = user.id; //change to auth0ID
    }).then(() => {
      return db.Extension.upsert(extensionData);
    }).then((ext) =>{
      done();
    }).catch((err)=>{
      console.error('ERROR CREATING EXTENSION', err);
    });

  });
  afterEach((done)=>{
    //destroy the dummy user and chrome extension
    db.Extension.destroy({where:{}})
    .then(()=>{
      db.User.destroy({where:{}})
    })
    .then(()=>{
      done();
    });
  });
  it('GET /api/users/:auth0_id/extension_data get data from chrome extension', (done)=>{
    request(app)
    .get(`/api/users/${authId5}/extension_data`)
    .end((err, res)=>{
      if (err) {console.error('ERROR GETTING EXTENSION', err);}
      expect(res.body.data[0].history[0][0]).to.equal(extensionData.history[0][0]);
      expect(res.body.data[0].history[0][1]).to.equal(extensionData.history[0][1].toString());
      expect(res.body.data[0].history[1][0]).to.equal(extensionData.history[1][0]);
      expect(res.body.data[0].history[1][1]).to.equal(extensionData.history[1][1].toString());
      done();
    });
  });
  //not sure how to mock upsert
  it('POST /api/users/:auth0_id/extension_data upsert extension data');
});



