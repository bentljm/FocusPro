process.env.NODE_ENV === 'test'

var chai = require('chai');
var chaiHttp = require('chai-http');

const db = require('../databases/Schema.js');

var should = chai.should();
chai.use(chaiHttp);

beforeEach((done)=>{
  //more on connection: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.WKyhjBIrInU
  const connectionString = process.env.DATABASE_URL || require('../config/config.js').LOCAL_TEST_DATABASE_URL;
  global.client = new pg.Client(connectionString);
  global.client.connect();
  done();
});

//load dummy data
beforeEach((done)=>{
  db.Goal.create({
    UserId: 1, 
    goal: "Haircut",
    progress: 2,
    goal_picture: "Hello"
  });
    done();
});

//close DB connection
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

describe('Goals', function() {
  it('should get all goals on /api/users/username/goals', function(done) {
    chai.request('http://localhost:7777')
      .get('/api/users/Bat/goals')
      .end(function(err, res){
        console.log("RESPONSE", res.body.data);
        expect(res.status).toEqual(200);
        expect(res.body.data[0].goal).toEqual('Haircut');
        //expect(res.body.data[0].progress).toEqual(2);
        //expect(res.body.data[0].goal_picture).toEqual('Hello');
        done();
      });
  });

});
