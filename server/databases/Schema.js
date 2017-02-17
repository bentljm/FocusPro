var Sequelize = require('sequelize');
var db = new Sequelize('database', 'root', '');

var User = db.define('User', {
  id: Sequelize.INTEGER,
  goal_id: Sequelize.INTEGER,
  setting_id: Sequelize.INTEGER,
  extension_id: Sequelize.INTEGER
});

var Friendship = db.define('Friendship', {
  friend_id: Sequelize.INTEGER,
  user1_id: Sequelize.INTEGER,
  user2_id: Sequelize.INTEGER,
  isFriends: Sequelize.BOOLEAN
})


var Goal = db.define('Goal' {
  goal_id: Sequelize.INTEGER,
  progress: Sequelize.INTEGER,
  subgoal_id: Sequelize.INTEGER,
  goal_picture: Sequelize.STRING,
  goal: Sequelize.STRING,
  reflection_id: Sequelize.INTEGER
})

var Subgoal = db.define('Subgoal', {
  subgoal_id: Sequelize.INTEGER,
  status: Sequelize.BOOLEAN,
  subgoal: Sequelize.STRING
})

var Reflection = db.define('Reflection', {
  reflection_id: Sequelize.NUMBER,
  question_id: Sequelize.NUMBER,
  answer: Sequelize.STRING
})

var Question = db.define('Question', {
  question_id: Sequelize.NUMBER,
  question: Sequelize.STRING
})

var Url = db.define('Url' {
  url_id: Sequelize.NUMBER,
  blacklist_type: Sequelize.NUMBER,
  blacklist_time: Sequelize.NUMBER,
  url: Sequelize.String
});

var Settings = db.define('Setting' {
  setting_id: Sequelize.NUMBER,
  url_id: Sequelize.NUMBER,
  picture: Sequelize.STRING,
  quote: Sequelize.STRING,
  reflection_freq: Sequelize.NUMBER,
  reminder: Sequelize.BOOLEAN,
  reminder_type: Sequelize.STRING,
  reminder_freq: Sequelize.NUMBER,
  reminder_address: Sequelize.STRING
})

var Extension = db.define('Extension' {
  url: Sequelize.STRING,
  time_spent: Sequelize.NUMBER,
  freq: Sequelize.NUMBER,
  e_id: Sequelize.NUMBER
})