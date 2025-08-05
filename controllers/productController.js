const { validationResult } = require("express-validator");
const ProductService = require("../services/productService");

class ProductController {
  static async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await ProductService.createProduct(req.body);
      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const result = await ProductService.getAllProducts(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getFeaturedProducts(req, res) {
    try {
      const { limit = 8 } = req.query;
      const products = await ProductService.getFeaturedProducts(
        parseInt(limit)
      );
      res.json({
        message: "Featured products retrieved successfully",
        products,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getNewArrivals(req, res) {
    try {
      const { limit = 8 } = req.query;
      const products = await ProductService.getNewArrivals(parseInt(limit));
      res.json({
        message: "New arrivals retrieved successfully",
        products,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSaleProducts(req, res) {
    try {
      const { limit = 8 } = req.query;
      const products = await ProductService.getSaleProducts(parseInt(limit));
      res.json({
        message: "Sale products retrieved successfully",
        products,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getProductsByTag(req, res) {
    try {
      const { tag } = req.params;
      const { limit = 10 } = req.query;
      const products = await ProductService.getProductsByTag(
        tag,
        parseInt(limit)
      );
      res.json({
        message: `Products with tag '${tag}' retrieved successfully`,
        products,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const product = await ProductService.deleteProduct(req.params.id);
      res.json({
        message: "Product deleted successfully",
        product,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async addRating(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { rating, review } = req.body;
      const product = await ProductService.addRating(
        req.params.id,
        req.user._id,
        { rating, review }
      );

      res.json({
        message: "Rating added successfully",
        product,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async addTags(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tags } = req.body;
      const product = await ProductService.addTags(req.params.id, tags);

      res.json({
        message: "Tags added successfully",
        product,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async removeTags(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tags } = req.body;
      const product = await ProductService.removeTags(req.params.id, tags);

      res.json({
        message: "Tags removed successfully",
        product,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateSpecifications(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { specifications } = req.body;
      const product = await ProductService.updateSpecifications(
        req.params.id,
        specifications
      );

      res.json({
        message: "Specifications updated successfully",
        product,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getSpecifications(req, res) {
    try {
      const specifications = await ProductService.getSpecifications(
        req.params.id
      );
      res.json({
        message: "Specifications retrieved successfully",
        specifications,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = ProductController;
