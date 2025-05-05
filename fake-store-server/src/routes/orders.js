var express = require("express");
var router = express.Router();
const { getAllOrders } = require("../db/index");
const {
  createOrderMiddleware,
  getOrderByUserMiddleware,
  updateOrderMiddleware,
} = require("../middle_ware/order");
const { auth } = require("../middle_ware/auth");
const { sendResponse } = require("../middle_ware/user");

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders (Debug Only)
 *     tags: [Orders]
 *     description: Fetches a list of all orders in the database. This endpoint requires no authentication and is intended solely for debugging purposes. It should not be used in the fake-store client or in production environments. Exposes order details including ID, user ID, item numbers, payment and delivery status, total price, and order items.
 *     responses:
 *       200:
 *         description: >
 *           Returns a list of all orders with their detailed information. This endpoint is for debug purposes only and exposes sensitive order details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the order.
 *           example: 1
 *         uid:
 *           type: integer
 *           description: The user ID associated with the order.
 *           example: 8
 *         item_numbers:
 *           type: integer
 *           description: The number of items in the order.
 *           example: 3
 *         is_paid:
 *           type: integer
 *           description: Indicates whether the order has been paid (1) or not (0).
 *           example: 0
 *         is_delivered:
 *           type: integer
 *           description: Indicates whether the order has been delivered (1) or not (0).
 *           example: 0
 *         total_price:
 *           type: number
 *           description: The total price of the order.
 *           example: 1775
 *         order_items:
 *           type: string
 *           description: A JSON string containing the details of the items ordered. Needs to be parsed to be used.
 *           example: '[{"prodID":1,"price":3.5,"quantity":2}]'
 */
router.get("/", async function (req, res, next) {
  const result = await getAllOrders();
  res.json(result);
});

/**
 * @swagger
 * /orders/all:
 *   get:
 *     summary: Retrieve all orders of the logged-in user
 *     tags: [Orders]
 *     description: Fetches a list of all orders placed by the currently logged-in user. A valid authorization token must be provided in the request headers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: >
 *           Always returns HTTP 200. On success, returns status 'OK' and an array of the user's orders.
 *           Each order includes user ID, number of items, total price, and order items details. Ensure to provide a valid authorization token to access this endpoint.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserOrder'
 * components:
 *   schemas:
 *     UserOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the order.
 *         uid:
 *           type: integer
 *           description: The user ID associated with the order.
 *         item_numbers:
 *           type: integer
 *           description: The number of items in the order.
 *         total_price:
 *           type: number
 *           description: The total price of the order.
 *         order_items:
 *           type: string
 *           description: A JSON string containing the details of the items ordered. Needs to be parsed to be used.
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * securityRequirements:
 *   - bearerAuth: []
 */
router.get("/all", [auth, getOrderByUserMiddleware, sendResponse]);
/**
 * @swagger
 * /orders/neworder:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     description: Allows a logged-in user to create a new order with the specified items. The user must provide a valid authorization token. Returns HTTP 200 with success or error indicated by the response body content.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 description: The list of items to include in the order.
 *                 items:
 *                   type: object
 *                   required:
 *                     - prodID
 *                     - price
 *                     - quantity
 *                   properties:
 *                     prodID:
 *                       type: integer
 *                       description: The product ID of the item.
 *                       example: 2
 *                     price:
 *                       type: number
 *                       description: The price of the item.
 *                       example: 1.57
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the item.
 *                       example: 1
 *     responses:
 *       200:
 *         description: >
 *           Always returns HTTP 200. For a successful order creation, returns status 'OK' with an order ID.
 *           For failure (e.g., wrong token), returns status 'error' with an appropriate message.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/NewOrderSuccessResponse'
 *                 - $ref: '#/components/schemas/NewOrderErrorResponse'
 * components:
 *   schemas:
 *     NewOrderSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: OK
 *         id:
 *           type: integer
 *           description: The ID of the newly created order.
 *           example: 1
 *     NewOrderErrorResponse:
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
router.post("/neworder", [auth, createOrderMiddleware, sendResponse]);
/**
 * @swagger
 * /orders/updateorder:
 *   post:
 *     summary: Update order status
 *     tags: [Orders]
 *     description: Allows setting an order as paid, delivered, or both. Requires a valid authorization token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderID
 *             properties:
 *               orderID:
 *                 type: integer
 *                 description: The ID of the order to update.
 *               isPaid:
 *                 type: integer
 *                 description: Set to 1 to mark the order as paid, 0 otherwise.
 *               isDelivered:
 *                 type: integer
 *                 description: Set to 1 to mark the order as delivered, 0 otherwise.
 *     responses:
 *       200:
 *         description: >
 *           Always returns HTTP 200. On successful update, returns status 'OK' and an object indicating the updated order ID and the number of changes.
 *           For failures (e.g., invalid token or order ID), returns status 'error' with an appropriate message.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/OrderUpdateSuccessResponse'
 *                 - $ref: '#/components/schemas/OrderUpdateErrorResponse'
 * components:
 *   schemas:
 *     OrderUpdateSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: OK
 *         result:
 *           type: object
 *           properties:
 *             lastID:
 *               type: integer
 *               description: The ID of the updated order.
 *             changes:
 *               type: integer
 *               description: The number of changes made.
 *     OrderUpdateErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Wrong token or invalid order ID.
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/updateorder", [auth, updateOrderMiddleware, sendResponse]);

module.exports = router;
