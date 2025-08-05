const express = require("express");
const { body } = require("express-validator");
const Category = require("../models/Category");
const { auth, admin } = require("../middleware/auth");

const router = express.Router();

// Validation middleware
const categoryValidation = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
];

// Public routes
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate("parent", "name")
      .sort({ name: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parent",
      "name"
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.post("/", auth, admin, categoryValidation, async (req, res) => {
  try {
    const errors = require("express-validator").validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", auth, admin, categoryValidation, async (req, res) => {
  try {
    const errors = require("express-validator").validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
