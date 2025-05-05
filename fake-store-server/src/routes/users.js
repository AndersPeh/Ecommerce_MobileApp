var express = require("express");
var router = express.Router();
const { getAllUsers } = require("../db/index");
const {
  createUserMiddleware,
  sendResponse,
  checkUserMiddleware,
  updateUserMiddleware,
} = require("../middle_ware/user");
const { setToken, auth } = require("../middle_ware/auth");
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users (Debug Only)
 *     tags: [Users]
 *     description: Fetches a list of all users in the database. This endpoint requires no authentication and is intended solely for debugging purposes. It should not be used in the fake-store client or in production environments.
 *     responses:
 *       200:
 *         description: >
 *           Returns a list of all users, including their id, name, email, and password. Note that this endpoint exposes sensitive information and is only for debug purposes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user.
 *           example: 105
 *         name:
 *           type: string
 *           description: The name of the user.
 *           example: Test User
 *         email:
 *           type: string
 *           description: The email of the user.
 *           example: test@test.com
 *         password:
 *           type: string
 *           description: The password of the user. For demonstration purposes only, real applications should never expose passwords.
 *           example: 123
 */
router.get("/", async function (req, res, next) {
  const result = await getAllUsers();
  res.json(result);
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Users]
 *     description: Registers a new user with the information provided in the request body. Always returns HTTP 200. Success or error is indicated by the response body content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's full name. Can't be empty.
 *                 example: Tom Sawyer.
 *               email:
 *                 type: string
 *                 description: The user's email address. Must be unique and valid email format.
 *                 example: tom@advanture.com
 *               password:
 *                 type: string
 *                 description: The password must contain at least one uppercase letter, one lowercase letter, and one digit. The minimum length of the password is 8 characters.
 *                 example: Abcdefg8
 *     responses:
 *       200:
 *         description: HTTP 200 returned for both success and failure cases. Check the response body for further details.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/SignupSuccessResponse'
 *                 - $ref: '#/components/schemas/SignupErrorResponse'
 * components:
 *   schemas:
 *     SignupSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: OK
 *         name:
 *           type: string
 *           example: Test User
 *         email:
 *           type: string
 *           example: test@test.com
 *         id:
 *           type: integer
 *           example: 1
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     SignupErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: The email is already used.
 */
router.post("/signup", [createUserMiddleware, setToken, sendResponse]);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Sign in an existing user
 *     tags: [Users]
 *     description: Authenticates a user with the provided email and password. Always returns HTTP 200. Success or error is indicated by the response body content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: HTTP 200 returned for both successful authentication and authentication failure. Check the response body for further details.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/SigninSuccessResponse'
 *                 - $ref: '#/components/schemas/SigninErrorResponse'
 * components:
 *   schemas:
 *     SigninSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: OK
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john.doe@example.com
 *         id:
 *           type: integer
 *           example: 1
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     SigninErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Wrong email or password.
 */
router.post("/signin", [checkUserMiddleware, setToken, sendResponse]);

/**
 * @swagger
 * /users/update:
 *   post:
 *     summary: Update user's name and password
 *     tags: [Users]
 *     description: Allows a logged-in user to update their name and password. The user must provide a valid authorization token. Email address and user ID cannot be changed. Always returns HTTP 200, with success or error indicated by the response body content.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the user.
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *     responses:
 *       200:
 *         description: >
 *           Returns status 'OK' for successful updates, or status 'error' with an appropriate message for failures
 *           (e.g., invalid token, empty name or password). Regardless of the outcome, HTTP 200 is returned.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UserUpdateSuccessResponse'
 *                 - $ref: '#/components/schemas/UserUpdateErrorResponse'
 * components:
 *   schemas:
 *     UserUpdateSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: OK
 *         name:
 *           type: string
 *           example: My New Name
 *         message:
 *           type: string
 *           example: User name and password update successfully.
 *     UserUpdateErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Wrong token.
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/update", [auth, updateUserMiddleware, sendResponse]);
module.exports = router;
