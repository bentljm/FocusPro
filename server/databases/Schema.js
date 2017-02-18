var Sequelize = require('sequelize');
var pg = require('pg');
var DB_URL = '';

if(PROCESS.ENV.NODE_ENV === 'production') {
  DB_URL = PROCESS.ENV.DATABASE_URL;
} else {
  // var config = require('../config/config.js');
  // DB_URL = config.LOCAL_DATABASE_URL;
}

pg.defaults.ssl = true;
var db = new Sequelize(DB_URL + '?&ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory');
console.log('Successfully connected to PostgreSQL database');

var User = db.define('User', {
  username: {type: Sequelize.STRING, unique: true},
  password: Sequelize.STRING,
  daily_goal: Sequelize.STRING
});

var Goal = db.define('Goal', {
  goal: Sequelize.STRING,
  progress: Sequelize.INTEGER,
  goal_picture: Sequelize.STRING
});

var Subgoal = db.define('Subgoal', {
  subgoal: Sequelize.STRING,
  status: Sequelize.BOOLEAN
});

var Setting = db.define('Setting', {
  picture: Sequelize.STRING,
  quote: Sequelize.STRING,
  reflection_freq: Sequelize.INTEGER,
  reminder: Sequelize.BOOLEAN,
  reminder_type: Sequelize.STRING,
  reminder_freq: Sequelize.INTEGER,
  reminder_address: Sequelize.STRING
});

var Extension = db.define('Extension', {
  url: {type: Sequelize.STRING, unique: true},
  time_spent: Sequelize.INTEGER,
  freq: Sequelize.INTEGER
});

var Reflection = db.define('Reflection', {
  answer: Sequelize.STRING
});

var Question = db.define('Question', {
  question: Sequelize.STRING
});

var Url = db.define('Url', {
  url: {type: Sequelize.STRING, unique: true},
  blacklist_type: Sequelize.STRING,
  blacklist_time: Sequelize.INTEGER
});

var Friendship = db.define('Friendship', {
  isFriends: Sequelize.BOOLEAN
});

User.hasMany(Goal);
User.hasOne(Setting);
User.hasMany(Extension);
Goal.hasMany(Subgoal);
Goal.hasMany(Reflection);
Reflection.hasOne(Question);
Setting.hasMany(Url);
User.belongsToMany(User, {as: 'user1', through: 'Friendship', foreignKey: 'user1_id' });
User.belongsToMany(User, {as: 'user2', through: 'Friendship', foreignKey: 'user2_id' });

db.sync();

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





