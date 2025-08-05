const jwt = require("jsonwebtoken");
const User = require("../models/User");

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "7d",
    });
  }

  static async register(userData) {
    try {
      const { email, password, name, phone, address } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        phone,
        address,
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        user: user.toJSON(),
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static async registerAdmin(userData) {
    try {
      const {
        email,
        password,
        name,
        phone,
        address,
        role = "admin",
      } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create new admin user
      const user = new User({
        name,
        email,
        password,
        phone,
        address,
        role,
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        user: user.toJSON(),
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(credentials) {
    try {
      const { email, password } = credentials;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error("Account is deactivated");
      }

      // Generate token
      const token = this.generateToken(user._id);

      return {
        user: user.toJSON(),
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
