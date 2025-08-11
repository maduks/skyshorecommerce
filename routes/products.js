const express = require("express");
const { body } = require("express-validator");
const ProductController = require("../controllers/productController");
const { auth, admin } = require("../middleware/auth");

const router = express.Router();

// Validation middleware
const productValidation = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters long"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .isMongoId()
    .withMessage("Please provide a valid category ID"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("sku").trim().notEmpty().withMessage("SKU is required"),
  body("images")
    .isArray({ min: 1 })
    .withMessage("At least one image is required"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .isIn([
      "new-arrival",
      "featured",
      "carton",
      "trending",
      "sale",
      "bestseller",
      "limited-edition",
      "eco-friendly",
      "premium",
    ])
    .withMessage("Invalid tag value"),
  body("variations")
    .optional()
    .isArray()
    .withMessage("Variations must be an array"),
  body("salePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Sale price must be a positive number"),
  body("saleEndDate")
    .optional()
    .isISO8601()
    .withMessage("Sale end date must be a valid date"),
  body("specifications")
    .optional()
    .isString()
    .withMessage("Specifications must be a string"),
];

const ratingValidation = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Review must be at least 10 characters long"),
];

const tagValidation = [
  body("tags").isArray({ min: 1 }).withMessage("At least one tag is required"),
  body("tags.*")
    .isIn([
      "new-arrival",
      "featured",
      "carton",
      "trending",
      "sale",
      "bestseller",
      "limited-edition",
      "eco-friendly",
      "premium",
    ])
    .withMessage("Invalid tag value"),
];

const specificationsValidation = [
  body("specifications")
    .isString()
    .withMessage("Specifications must be a string"),
];

// Public routes
router.get("/", ProductController.getAllProducts);
router.get("/featured", ProductController.getFeaturedProducts);
router.get("/new-arrivals", ProductController.getNewArrivals);
router.get("/sale", ProductController.getSaleProducts);
router.get("/tag/:tag", ProductController.getProductsByTag);
router.get("/:id", ProductController.getProductById);
router.get("/:id/specifications", ProductController.getSpecifications);
router.post("/:id/rating", auth, ratingValidation, ProductController.addRating);

// Admin routes
router.post(
  "/",
  auth,
  admin,
  productValidation,
  ProductController.createProduct
);
router.put(
  "/:id",
  auth,
  admin,
  productValidation,
  ProductController.updateProduct
);
router.delete("/:id", auth, admin, ProductController.deleteProduct);
router.post("/:id/tags", auth, admin, tagValidation, ProductController.addTags);
router.delete(
  "/:id/tags",
  auth,
  admin,
  tagValidation,
  ProductController.removeTags
);
router.put(
  "/:id/specifications",
  auth,
  admin,
  specificationsValidation,
  ProductController.updateSpecifications
);

module.exports = router;
