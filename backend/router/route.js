import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';



/** POST Methods */
router.route('/register').post(controller.register); // register User
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate User
router.route('/login').post(controller.verifyUser,controller.login); // login in app
router.route('/createitem').post(controller.createItem); //create Item

/** GET Methods */
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables
router.route('/getitem').get(controller.getItem); // get item information
router.route('/getuser/:username').get(controller.alphasrequestforgetuser); // get user information
router.route('/:username').get(controller.getUser); // get user information

/** PUT Methods */
router.route('/updateuser').put(Auth, controller.updateUser); // is use to update the User profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password

export default router;