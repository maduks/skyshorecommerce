const mongoose = require("mongoose");

const variationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  options: [
    {
      value: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        default: 0,
      },
      stock: {
        type: Number,
        default: 0,
      },
      sku: String,
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    brand: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        enum: [
          "new-arrival",
          "featured",
          "trending",
          "sale",
          "bestseller",
          "limited-edition",
          "eco-friendly",
          "premium",
        ],
        default: [],
      },
    ],
    variations: [variationSchema],
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    saleEndDate: Date,
  },
  {
    timestamps: true,
  }
);

// Calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = total / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  return this.save();
};

// Method to check if product is on sale
productSchema.methods.isOnSale = function () {
  if (!this.salePrice) return false;
  if (this.saleEndDate && new Date() > this.saleEndDate) return false;
  return true;
};

// Method to get current price (sale price if on sale, otherwise regular price)
productSchema.methods.getCurrentPrice = function () {
  return this.isOnSale() ? this.salePrice : this.price;
};

// Method to add tags
productSchema.methods.addTags = function (tags) {
  tags.forEach((tag) => {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  });
  return this.save();
};

// Method to remove tags
productSchema.methods.removeTags = function (tags) {
  this.tags = this.tags.filter((tag) => !tags.includes(tag));
  return this.save();
};

module.exports = mongoose.model("Product", productSchema);
