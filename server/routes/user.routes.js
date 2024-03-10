import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/users').get(userCtrl.list).post(userCtrl.create);

router.route('/api/users/:userId').get(authCtrl.requireSignin, userCtrl.read).put(authCtrl.requireSignin, authCtrl.hasAthorization, userCtrl.update).delete(authCtrl.requireSignin, authCtrl.hasAthorization, userCtrl.remove);

router.param('userId', userCtrl.userByID);

router.route('/api/users/photo/:userId').get(userCtrl.photo, userCtrl.defaultPhoto);

router.route('/api/user/defaultphoto/').get(userCtrl.defaultPhoto);

router.route('/api/user/follow/').put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower);

router.route('/api/user/unfollow/').put(authCtrl.requireSignin, userCtrl.removeFollowing, userCtrl.removeFollower);

router.route('/api/users/findpeople/:userId').get(authCtrl.requireSignin, userCtrl.findPeople);

export default router;