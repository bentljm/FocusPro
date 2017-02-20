var controller = require('./controllers/controllers.js');

// Connect controller methods to their respective routes

module.exports = function(app, express) {
  app.get('/api/users', controller.getAllUsers); // Get all user info

  app.get('/api/users/:username', controller.getSingleUser); // Get individual name

  app.get('/api/users/:username/setting', controller.getSetting); // Get individual settings

  app.get('/api/users/:username/setting/blacklist', controller.getBlackList); // Get individual blacklist

  app.post('/api/users/:username/setting/blacklist', controller.postBlackList); // Post or update individual blacklist

  app.get('/api/users/:username/extension_data', controller.getExtension); // Get individual extention data

  app.get('/api/users/:username/reflections', controller.getReflections); // Get individual reflection data

  app.get('/api/users/:username/:reflection_id', controller.getReflectionId) // Get individual reflection id

  app.post('/api/users/:username/:reflection_id', controller.postgetReflectionId) // Post individual reflection id

  app.get('/api/users/:username/goals', controller.getAllGoals) //Get all goals

  app.post('/api/users/:username/goals', controller.postAllGoals) //Post all goals

  app.get('/api/users/:username/goals/:goal_id', controller.getSingleGoal) //Get single goal

  app.post('/api/users/:username/goals/:goal_id', controller.postSingleGoal) //Post single goal

  app.get('/api/users/:username/goals/:goal_id/subgoals', controller.getSubGoals) //Get all subgoals of a single goal

  app.post('/api/users/:username/goals/:goal_id/subgoals', controller.postSubGoals) //Post all subgoals of a single goal

}