const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
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

    if (!customer.cart) {
      customer.cart = [];
    }

    const cartItem = customer.cart.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (cartItem) {
      const newQuantity = cartItem.quantity + 1;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }

      cartItem.quantity = newQuantity;
    } else {
      if (product.stock < 1) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock",
        });
      }

      customer.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    await customer.save();

    const updatedCustomer = await Customer.findById(customer._id)
      .populate({
        path: "cart.product",
        select: "name description price category image stock",
      });

    const validCart = (updatedCustomer.cart || []).filter(
      (item) => item && item.product !== null
    );

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: validCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.customerId)
      .populate({
        path: "cart.product",
        select: "name description price category image stock",
      });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const validCart = (customer.cart || []).filter(
      (item) => item && item.product !== null
    );

    res.status(200).json({
      success: true,
      cart: validCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be an integer greater than 0",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    const customer = await Customer.findById(req.user.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!customer.cart) {
      customer.cart = [];
    }

    const cartItem = customer.cart.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cartItem.quantity = quantity;

    await customer.save();

    const updatedCustomer = await Customer.findById(customer._id)
      .populate({
        path: "cart.product",
        select: "name description price category image stock",
      });

    const validCart = (updatedCustomer.cart || []).filter(
      (item) => item && item.product !== null
    );

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: validCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const removeFromCart = async (req, res) => {
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

    if (!customer.cart) {
      customer.cart = [];
    }

    const cartItemIndex = customer.cart.findIndex(
      (item) => item.product && item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    customer.cart.splice(cartItemIndex, 1);

    await customer.save();

    const updatedCustomer = await Customer.findById(customer._id)
      .populate({
        path: "cart.product",
        select: "name description price category image stock",
      });

    const validCart = (updatedCustomer.cart || []).filter(
      (item) => item && item.product !== null
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: validCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
};