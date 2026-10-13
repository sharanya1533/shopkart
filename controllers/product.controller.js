const mongoose = require("mongoose");
const Product = require("../models/product.model");

const createProduct = async (req, res) => {
try {
const { name, description, price, category, image, stock } = req.body;


if (!name || !description || !price || !category || !image || stock === undefined) {
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
}

const product = await Product.create({
  name,
  description,
  price,
  category,
  image,
  stock,
});

res.status(201).json({
  success: true,
  message: "Product created successfully",
  product,
});


} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

const getProducts = async (req, res) => {
try {
const { search, category } = req.query;


let filter = {};

if (search) {
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  filter.name = {
    $regex: escapedSearch,
    $options: "i",
  };
}

if (category) {
  filter.category = category;
}

const products = await Product.find(filter);

res.status(200).json({
  success: true,
  products,
});


} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

const getProductById = async (req, res) => {
try {
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid product ID",
  });
}

const product = await Product.findById(req.params.id);


if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}

res.status(200).json({
  success: true,
  product,
});


} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

const deleteProduct = async (req, res) => {
try {
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid product ID",
  });
}

const product = await Product.findByIdAndDelete(req.params.id);


if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}

res.status(200).json({
  success: true,
  message: "Product deleted successfully",
});


} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};


module.exports = {
createProduct,
getProducts,
getProductById,
deleteProduct,
};
