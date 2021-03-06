const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const skillController = require('../../controllers/skill.controller');
const reportUserController = require('../../controllers/reportUser.controller');
const preferredLocation = require('../../controllers/preferredLocation.controller');
const paymentController = require('../../controllers/payment.controller');
const serviceController = require('../../controllers/service.controller');

const faqController = require('../../controllers/faq.controller');
const notificationController = require('../../controllers/notification.controller');
const howItWorksController = require('../../controllers/howItWorks.controller');
const termsAndConditionController = require('../../controllers/termsAndCondition.controller');
const privacyAndPolicyController = require('../../controllers/privacyAndPolicy.controller');
const aboutUsController = require('../../controllers/aboutUs.controller');

const router = express.Router();

router.get('/logout', auth('getUsers'), userController.logout);

router.get('/skills', skillController.getSkillsForUser);

router.get('/preferredLocation', preferredLocation.getPreferredLocations);

router.get('/termsAndCondition', termsAndConditionController.getTermsAndCondition);

router.get('/privacyAndPolicy', privacyAndPolicyController.getPrivacyAndPolicy);

router.get('/aboutUs', aboutUsController.getAboutUs);

// router.get('/myEarningByPayment', auth('getUsers'), paymentController.helpingAgentEarning);

router.get('/myEarningByPayment', auth('getUsers'), serviceController.helpingAgentEarning);

router.get('/homeData', auth('getUsers'), serviceController.homeData);

router.get('/faq/:faqId', faqController.getFaqById);
router.get('/faq', faqController.getFaqs);

router.get('/howItWorks/:howItWorksId', howItWorksController.getHowItWorksById);
router.get('/howItWorks', howItWorksController.getHowItWorks);

router.route('/reportUser').post(reportUserController.saveReportUser);

router.post('/webhooksUpdate', userController.updateUserByWebhooks);
router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * path:
 *  /users/{id}:
 *    get:
 *      summary: Get a user
 *      description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: User id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a user
 *      description: Logged in users can only update their own information. Only admins can update other users.
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: User id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *              example:
 *                name: fake name
 *                email: fake@example.com
 *                password: password1
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
