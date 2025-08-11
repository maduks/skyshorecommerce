const Order = require("../models/Order");
const Product = require("../models/Product");
const ProductService = require("./productService");

class OrderService {
  static async createOrder(userId, orderData) {
    try {
      const { orderItems, shippingAddress, paymentMethod } = orderData;

      // Validate order items
      if (!orderItems || orderItems.length === 0) {
        throw new Error("Order items are required");
      }

      // Calculate prices
      let itemsPrice = 0;
      const processedOrderItems = [];

      for (const item of orderItems) {
        const product = await Product.findById(item.product);

        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }

        if (!product.isActive) {
          throw new Error(`Product ${product.name} is not available`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const price = product.price;
        itemsPrice += price * item.quantity;

        processedOrderItems.push({
          product: item.product,
          quantity: item.quantity,
          price,
          name: product.name,
          image: product.images[0] || "",
        });

        // Update stock
        await ProductService.updateStock(item.product, item.quantity);
      }

      // Calculate tax and shipping (simplified)
      const taxPrice = 0; // 10% tax
      const shippingPrice = 0; // Free shipping over $100
      const totalPrice = itemsPrice + shippingPrice;

      const order = new Order({
        user: userId,
        orderItems: processedOrderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  }

  static async getOrderById(orderId, userId) {
    try {
      const order = await Order.findById(orderId)
        .populate("user", "name email")
        .populate("orderItems.product", "name images");

      if (!order) {
        throw new Error("Order not found");
      }

      // Check if user owns the order or is admin
      if (order.user._id.toString() !== userId) {
        throw new Error("Not authorized to view this order");
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  static async getUserOrders(userId, query = {}) {
    try {
      const { page = 1, limit = 10 } = query;

      const orders = await Order.find({ user: userId })
        .populate("orderItems.product", "name images")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Order.countDocuments({ user: userId });

      return {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAllOrders(query = {}) {
    try {
      const { page = 1, limit = 10, status } = query;

      const filter = {};
      if (status) {
        filter.status = status;
      }

      const orders = await Order.find(filter)
        .populate("user", "name email")
        .populate("orderItems.product", "name images")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Order.countDocuments(filter);

      return {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      order.status = status;

      if (status === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }

      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  }

  static async updatePaymentStatus(orderId, paymentResult) {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = paymentResult;

      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderService;
