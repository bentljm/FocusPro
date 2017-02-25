var controller = require('./controllers/controllers.js');

// Connect controller methods to their respective routes

module.exports = function(app, express) {
  app.get('/api/users', controller.getAllUsers); // Get all user info
  app.post('/api/users', controller.postUser); //Post a user
  app.get('/api/users/:auth0_id', controller.getSingleUser); // Get individual name
  app.put('/api/users/:auth0_id', controller.updateUser); //Update individual user

  app.get('/api/users/:auth0_id/setting', controller.getSettings); // Get individual settings
  app.post('/api/users/:auth0_id/setting', controller.postSettings); // Post individual settings
  app.put('/api/users/:auth0_id/setting', controller.updateSettings); //Update settings
  app.get('/api/users/:auth0_id/setting/blacklist', controller.getBlackList); // Get individual blacklist
  app.post('/api/users/:auth0_id/setting/blacklist', controller.postBlackList); // Post or update individual blacklist
  app.delete('/api/users/:auth0_id/setting/blacklist/:url_id', controller.removeBlackList); // Get individual blacklist


  app.get('/api/users/:auth0_id/extension_data', controller.getExtension); // Get individual extention data


  app.get('/api/users/:auth0_id/reflections', controller.getReflections); // Get all reflection data
  app.post('/api/users/:auth0_id/reflections', controller.postReflectionId); // Post individual reflection id
  // app.get('/api/users/:auth0_id/reflections/:reflection_id', controller.getReflectionId); // Get individual reflection id

  app.get('/api/users/:auth0_id/goals', controller.getAllGoals); //Get all goals
  app.get('/api/users/:auth0_id/goals/:goal_id', controller.getSingleGoal); //Get single goal
  app.post('/api/users/:auth0_id/goals', controller.postSingleGoal); //Post single goal
  app.delete('/api/users/:auth0_id/goals/:goal_id', controller.removeSingleGoal); //Delete single goal

  app.get('/api/goals/:goal_id/subgoals', controller.getSubGoals); //Get all subgoals of a single goal

  app.post('/api/goals/:goal_id/subgoals', controller.postSubGoal); //Post all subgoals of a single goal

  app.delete('/api/users/:auth0_id/goals/:goal_id/subgoals/:subgoal_id', controller.removeSubGoal); //Delete a subgoal of a single goal

  // app.post('/api/users/:auth0_id/sendMail', controller.sendEmail); // Send email
};