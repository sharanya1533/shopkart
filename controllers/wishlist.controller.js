const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToWishlist = async (req, res) => {
try {
const { productId } = req.params;


if (!mongoose.Types.ObjectId.isValid(productId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid product ID",
  });
}

const product = await Product.findById(productId);

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}

    const customer = await Customer.findById(req.user.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!customer.wishlist) {
      customer.wishlist = [];
    }

    const isAlreadyInWishlist = customer.wishlist.some(
      (id) => id.toString() === productId
    );

    if (isAlreadyInWishlist) {
      return res.status(409).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    customer.wishlist.push(productId);

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
    });


  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.customerId)
      .populate({
        path: "wishlist",
        select: "name price category image stock description",
      });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const wishlistItems = (customer.wishlist || []).filter((item) => item !== null);

    res.status(200).json({
      success: true,
      count: wishlistItems.length,
      wishlist: wishlistItems,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const customer = await Customer.findById(req.user.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!customer.wishlist || customer.wishlist.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    const productIndex = customer.wishlist.findIndex(
      (id) => id && id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    customer.wishlist.splice(productIndex, 1);

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });


  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
addToWishlist,
getWishlist,
removeFromWishlist,
};
