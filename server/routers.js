var router = require('express').Router();
var controller = require('../controllers/controller');

// Connect controller methods to their respective routes
router.get('api/users', controller.getAllUsers); // Get all user info

router.get('api/users/:username', controller.getSingleUser); // Get individual name

router.get('api/users/:username/setting', controller.getSetting); // Get individual settings

router.get('api/users/:username/setting/blacklist', controller.getBlackList); // Get individual blacklist

router.post('api/users/:username/setting/blacklist', controller.postBlackList); // Post or update individual blacklist

router.get('api/users/:username/extension_data', controller.getExtension); // Get individual extention data

router.get('api/users/:username/reflections', controller.getReflections); // Get individual reflection data

router.get('api/users/:username/:reflection_id', controller.getReflectionId) // Get individual reflection id

router.post('api/users/:username/:reflection_id', controller.postgetReflectionId) // Post individual reflection id

router.get('api/users/:username/goals', controller.getAllGoals) //Get all goals

router.get('api/users/:username/goals', controller.postAllGoals) //Post all goals

router.get('api/users/:username/goals/:goal_id', controller.getSingleGoal) //Get single goal

router.post('api/users/:username/goals/:goal_id', controller.postSingleGoal) //Post single goal

router.get('api/users/:username/goals/:goal_id/subgoals', controller.getSubGoals) //Get all subgoals of a single goal

router.post('api/users/:username/goals/:goal_id/subgoals', controller.postSubGoals) //Post all subgoals of a single goal

module.exports = router;