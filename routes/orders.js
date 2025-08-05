const express = require("express");
const { body } = require("express-validator");
const OrderController = require("../controllers/orderController");
const { auth, admin } = require("../middleware/auth");

const router = express.Router();

// Validation middleware
const orderValidation = [
  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("At least one order item is required"),
  body("orderItems.*.product")
    .isMongoId()
    .withMessage("Please provide valid product IDs"),
  body("orderItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("shippingAddress.street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),
  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),
  body("shippingAddress.zipCode")
    .trim()
    .notEmpty()
    .withMessage("Zip code is required"),
  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required"),
];

const statusValidation = [
  body("status")
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid status"),
];

const paymentValidation = [
  body("paymentResult.id")
    .trim()
    .notEmpty()
    .withMessage("Payment ID is required"),
  body("paymentResult.status")
    .trim()
    .notEmpty()
    .withMessage("Payment status is required"),
];

// User routes
router.post("/", auth, orderValidation, OrderController.createOrder);
router.get("/my", auth, OrderController.getUserOrders);
router.get("/:id", auth, OrderController.getOrderById);

// Admin routes
router.get("/", auth, admin, OrderController.getAllOrders);
router.put(
  "/:id/status",
  auth,
  admin,
  statusValidation,
  OrderController.updateOrderStatus
);
router.put(
  "/:id/payment",
  auth,
  admin,
  paymentValidation,
  OrderController.updatePaymentStatus
);

module.exports = router;
