const { validationResult } = require("express-validator");
const OrderService = require("../services/orderService");

class OrderController {
  static async createOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await OrderService.createOrder(req.user._id, req.body);
      res.status(201).json({
        message: "Order created successfully",
        order,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getOrderById(req, res) {
    try {
      const order = await OrderService.getOrderById(
        req.params.id,
        req.user._id
      );
      res.json(order);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getUserOrders(req, res) {
    try {
      const result = await OrderService.getUserOrders(req.user._id, req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const result = await OrderService.getAllOrders(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status } = req.body;
      const order = await OrderService.updateOrderStatus(req.params.id, status);
      res.json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updatePaymentStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { paymentResult } = req.body;
      const order = await OrderService.updatePaymentStatus(
        req.params.id,
        paymentResult
      );
      res.json({
        message: "Payment status updated successfully",
        order,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = OrderController;
