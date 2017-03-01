var controller = require('./controllers/controllers.js');
var notification = require('./controllers/notificationControllers.js');

// Connect controller methods to their respective routes

module.exports = function(app, express) {
  app.get('/api/users', controller.getAllUsers); // Get all user info
  app.post('/api/users', controller.postUser); //Post a user
  app.get('/api/users/:auth0_id', controller.getSingleUser); // Get individual name
  app.put('/api/users/:auth0_id', controller.updateUser); //Update individual user
  app.put('/api/users/:auth0_id/username', controller.updateUsername); //Update individual user

  app.get('/api/users/:auth0_id/setting', controller.getSettings); // Get individual settings
  app.post('/api/users/:auth0_id/setting', controller.postSettings); // Post individual settings
  app.put('/api/users/:auth0_id/setting', controller.updateSettings); //Update settings
  app.get('/api/users/:auth0_id/blacklist', controller.getBlackList); // Get individual blacklist
  app.post('/api/users/:auth0_id/blacklist', controller.postBlackList); // Post or update individual blacklist
  app.delete('/api/blacklist/:url_id', controller.removeBlackList); // Delete individual blacklist
  app.put('/api/blacklist/:url_id', controller.updateBlackList); // Delete individual blacklist


  app.get('/api/users/:auth0_id/extension_data', controller.getExtension); // Get all extention data
  app.post('/api/users/:auth0_id/extension_data', controller.upsertExtension); // Upsert individual extention data

  app.get('/api/users/:auth0_id/reflections', controller.getReflections); // Get all reflection data
  app.post('/api/users/:auth0_id/reflections', controller.postReflectionId); // Post individual reflection id

  app.get('/api/users/:auth0_id/goals', controller.getAllGoals); // Get all goals
  app.get('/api/goals/:goal_id', controller.getSingleGoal); // Get single goal
  app.post('/api/users/:auth0_id/goals', controller.postSingleGoal); // Post single goal
  app.delete('/api/goals/:goal_id', controller.removeSingleGoal); // Delete single goal
  app.put('/api/goals/:goal_id', controller.updateSingleGoal); // Change a subgoal of a single goal

  app.get('/api/goals/:goal_id/subgoals', controller.getSubGoals); // Get all subgoals of a single goal
  app.post('/api/goals/:goal_id/subgoals', controller.postSubGoal); // Post all subgoals of a single goal

  app.delete('/api/subgoals/:subgoal_id', controller.removeSubGoal); // Delete a subgoal of a single goal
  app.put('/api/subgoals/:subgoal_id', controller.updateSubgoal); // Change a subgoal of a single goal
  app.get('/api/subgoals/:subgoal_id', controller.getSingleSubgoal); // Get a subgoal of a single goal

  app.post('/api/users/:auth0_id/sendNotification', notification.sendNotification); // Send email
};