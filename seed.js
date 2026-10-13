const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/product.model");

const products = [
  // Electronics (2 products)
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-cancelling over-ear headphones with 30-hour battery life, deep bass, and crystal-clear audio. Perfect for music, calls, and gaming.",
    price: 2499,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    stock: 25,
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof portable speaker with 360° surround sound, 12-hour playtime, and built-in microphone for hands-free calls.",
    price: 1799,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    stock: 40,
  },

  // Clothing (2 products)
  {
    name: "Classic Denim Jacket",
    description:
      "Timeless medium-wash denim jacket with button closure, two chest pockets, and a relaxed fit. Ideal for layering in all seasons.",
    price: 1999,
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    stock: 30,
  },
  {
    name: "Cotton Crew-Neck T-Shirt",
    description:
      "Soft 100% organic cotton t-shirt in a classic crew-neck style. Breathable, comfortable, and available in multiple sizes.",
    price: 599,
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    stock: 100,
  },

  // Home (2 products)
  {
    name: "Scented Soy Wax Candle Set",
    description:
      "Set of 3 hand-poured soy wax candles with lavender, vanilla, and eucalyptus scents. Burns for up to 45 hours each.",
    price: 899,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600",
    stock: 50,
  },
  {
    name: "Ceramic Indoor Plant Pot",
    description:
      "Minimalist matte-finish ceramic pot with drainage hole and saucer. Perfect for succulents, herbs, and small indoor plants.",
    price: 749,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600",
    stock: 35,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const inserted = await Product.insertMany(products);
    console.log(`Successfully seeded ${inserted.length} products:`);
    inserted.forEach((p) => {
      console.log(`  - [${p.category}] ${p.name} (₹${p.price})`);
    });
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
