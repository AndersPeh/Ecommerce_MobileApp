var express = require("express");
var router = express.Router();
const {
  getCartMiddleware,
  updateCartMiddleware,
} = require("../middle_ware/cart");
const { auth } = require("../middle_ware/auth");
const { sendResponse } = require("../middle_ware/user");
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve the user's cart items.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's cart items or an error message.Error message is like {status:'error',message:'Wrong token'}
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         example: 9.50
 *                       count:
 *                         type: integer
 *                         example: 1
 */
router.get("/", [auth, getCartMiddleware, sendResponse]);
/**
 * @swagger
 * /cart:
 *   put:
 *     summary: Add or update items in the user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 18.50
 *                     count:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       200:
 *         description: Cart items were successfully added or updated, or an error occurred. In error it will return {status:'error',message:'Wrong token'}.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 */
router.put("/", [auth, updateCartMiddleware, sendResponse]);

module.exports = router;
