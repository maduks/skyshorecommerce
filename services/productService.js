const Product = require("../models/Product");
const Category = require("../models/Category");

class ProductService {
  static async createProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async getAllProducts(query = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        search,
        minPrice,
        maxPrice,
        sortBy = "createdAt",
        sortOrder = "desc",
        tags,
        featured,
        newArrival,
        onSale,
      } = query;

      const filter = { isActive: true };

      if (category) {
        filter.category = category;
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ];
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }

      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        filter.tags = { $in: tagArray };
      }

      if (featured === "true") {
        filter.featured = true;
      }

      if (newArrival === "true") {
        filter.newArrival = true;
      }

      if (onSale === "true") {
        filter.salePrice = { $exists: true, $ne: null };
        filter.$or = [
          { saleEndDate: { $exists: false } },
          { saleEndDate: { $gt: new Date() } },
        ];
      }

      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      const products = await Product.find(filter)
        .populate("category", "name")
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Product.countDocuments(filter);

      return {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getFeaturedProducts(limit = 8) {
    try {
      const products = await Product.find({
        isActive: true,
        featured: true,
      })
        .populate("category", "name")
        .limit(limit)
        .sort({ createdAt: -1 });

      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getNewArrivals(limit = 8) {
    try {
      const products = await Product.find({
        isActive: true,
        newArrival: true,
      })
        .populate("category", "name")
        .limit(limit)
        .sort({ createdAt: -1 });

      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getSaleProducts(limit = 8) {
    try {
      const products = await Product.find({
        isActive: true,
        salePrice: { $exists: true, $ne: null },
        $or: [
          { saleEndDate: { $exists: false } },
          { saleEndDate: { $gt: new Date() } },
        ],
      })
        .populate("category", "name")
        .limit(limit)
        .sort({ createdAt: -1 });

      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getProductById(productId) {
    try {
      const product = await Product.findById(productId)
        .populate("category", "name")
        .populate("ratings.user", "name");

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(productId, updateData) {
    try {
      const product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async addRating(productId, userId, ratingData) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      // Check if user already rated
      const existingRating = product.ratings.find(
        (rating) => rating.user.toString() === userId
      );

      if (existingRating) {
        // Update existing rating
        existingRating.rating = ratingData.rating;
        existingRating.review = ratingData.review;
        existingRating.date = new Date();
      } else {
        // Add new rating
        product.ratings.push({
          user: userId,
          rating: ratingData.rating,
          review: ratingData.review,
        });
      }

      await product.calculateAverageRating();
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async updateStock(productId, quantity, variationId = null) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (variationId) {
        // Update stock for specific variation
        const variation = product.variations.id(variationId);
        if (!variation) {
          throw new Error("Variation not found");
        }

        const option = variation.options.id(variationId);
        if (!option) {
          throw new Error("Variation option not found");
        }

        if (option.stock < quantity) {
          throw new Error("Insufficient stock for this variation");
        }

        option.stock -= quantity;
      } else {
        // Update main product stock
        if (product.stock < quantity) {
          throw new Error("Insufficient stock");
        }

        product.stock -= quantity;
      }

      await product.save();
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async addTags(productId, tags) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      await product.addTags(tags);
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async removeTags(productId, tags) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      await product.removeTags(tags);
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async getProductsByTag(tag, limit = 10) {
    try {
      const products = await Product.find({
        isActive: true,
        tags: tag,
      })
        .populate("category", "name")
        .limit(limit)
        .sort({ createdAt: -1 });

      return products;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
