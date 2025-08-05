const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/authController");
const { auth, admin } = require("../middleware/auth");

const router = express.Router();

// Validation middleware
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("address.street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),
  body("address.city").trim().notEmpty().withMessage("City is required"),
  body("address.state").trim().notEmpty().withMessage("State is required"),
  body("address.zipCode").trim().notEmpty().withMessage("Zip code is required"),
  body("address.country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
];

const adminRegisterValidation = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("address.street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),
  body("address.city").trim().notEmpty().withMessage("City is required"),
  body("address.state").trim().notEmpty().withMessage("State is required"),
  body("address.zipCode").trim().notEmpty().withMessage("Zip code is required"),
  body("address.country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),
  body("address.street")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),
  body("address.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  body("address.state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State is required"),
  body("address.zipCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Zip code is required"),
  body("address.country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
];

// Routes
router.post("/register", registerValidation, AuthController.register);
router.post(
  "/register/admin",
  auth,
  admin,
  adminRegisterValidation,
  AuthController.registerAdmin
);
router.post("/login", loginValidation, AuthController.login);
router.get("/profile", auth, AuthController.getProfile);
router.put(
  "/profile",
  auth,
  updateProfileValidation,
  AuthController.updateProfile
);

module.exports = router;
