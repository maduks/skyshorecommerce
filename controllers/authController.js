const { validationResult } = require("express-validator");
const AuthService = require("../services/authService");

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, phone, address } = req.body;
      const result = await AuthService.register({
        name,
        email,
        password,
        phone,
        address,
      });

      res.status(201).json({
        message: "User registered successfully",
        ...result,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async registerAdmin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        email,
        password,
        phone,
        address,
        role = "admin",
      } = req.body;
      const result = await AuthService.registerAdmin({
        name,
        email,
        password,
        phone,
        address,
        role,
      });

      res.status(201).json({
        message: "Admin user registered successfully",
        ...result,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });

      res.json({
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await AuthService.getProfile(req.user._id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updateData = req.body;
      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updateData.password;
      delete updateData.role;
      delete updateData.isActive;

      const user = await AuthService.updateProfile(req.user._id, updateData);
      res.json({
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
