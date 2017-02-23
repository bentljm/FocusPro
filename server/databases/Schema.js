//Import sequelize and postgres
var Sequelize = require('sequelize');
var pg = require('pg');

//set environment variables
var DB_URL = process.env.DATABASE_URL || require('../config/config.js').LOCAL_DATABASE_URL;

//connect to new sequelize database
pg.defaults.ssl = true;
var db = new Sequelize(DB_URL + '?&ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory', {logging: false});
console.log('Successfully connected to PostgreSQL database');

//User schema
var User = db.define('User', {
  username: Sequelize.STRING,
  auth0_id: {type: Sequelize.STRING, unique: true},
  daily_goal: Sequelize.STRING
});

//Goal schema
var Goal = db.define('Goal', {
  goal: Sequelize.STRING,
  progress: Sequelize.INTEGER,
  goal_picture: Sequelize.STRING
});

//Subgoal schema
var Subgoal = db.define('Subgoal', {
  subgoal: Sequelize.STRING,
  status: Sequelize.BOOLEAN
});

//Setting schema
var Setting = db.define('Setting', {
  picture: Sequelize.STRING,
  quote: Sequelize.STRING,
  reflection_freq: Sequelize.INTEGER,
  reminder: Sequelize.BOOLEAN,
  reminder_type: Sequelize.STRING,
  reminder_freq: Sequelize.INTEGER,
  reminder_address: Sequelize.STRING
});

//Extension schema
var Extension = db.define('Extension', {
  url: {type: Sequelize.STRING, unique: true},
  time_spent: Sequelize.INTEGER,
  freq: Sequelize.INTEGER
});

//Reflection schema
var Reflection = db.define('Reflection', {
  answer: Sequelize.STRING
});

//Question schema
var Question = db.define('Question', {
  question: Sequelize.STRING
});

//Url schema
var Url = db.define('Url', {
  url: {type: Sequelize.STRING, unique: true},
  blacklist_type: Sequelize.STRING,
  blacklist_time: Sequelize.INTEGER
});

//Friendship schema
var Friendship = db.define('Friendship', {
  isFriends: Sequelize.BOOLEAN
});

//Instantiate relations
User.hasMany(Goal);
User.hasOne(Setting);
User.hasMany(Extension);
User.hasMany(Subgoal);
User.hasMany(Reflection);
Goal.hasMany(Subgoal);
Goal.hasMany(Reflection);
Reflection.hasOne(Question);
Setting.hasMany(Url);
User.belongsToMany(User, {as: 'user1', through: 'Friendship', foreignKey: 'user1_id' });
User.belongsToMany(User, {as: 'user2', through: 'Friendship', foreignKey: 'user2_id' });

//create new database if it doens't already exist
db.sync();

//Export schemas
exports.Sequelize = db;
exports.User = User;
exports.Goal = Goal;
exports.Subgoal = Subgoal;
exports.Setting = Setting;
exports.Extension = Extension;
exports.Reflection = Reflection;
exports.Question = Question;
exports.Friendship = Friendship;
exports.Url = Url;





