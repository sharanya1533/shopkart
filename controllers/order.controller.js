const mongoose = require("mongoose");
const crypto = require("crypto");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const razorpay = require("../config/razorpay");

const createPaymentOrder = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            addressLine1,
            city,
            state,
            pincode,
        } = req.body;

        if (
            !fullName ||
            !phone ||
            !addressLine1 ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "All shipping fields are required",
            });
        }

        if (
            !fullName.trim() ||
            !phone.trim() ||
            !addressLine1.trim() ||
            !city.trim() ||
            !state.trim() ||
            !pincode.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Shipping fields cannot contain only whitespace",
            });
        }

        if (!/^\d{10}$/.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be 10 digits",
            });
        }

        if (!/^\d{6}$/.test(pincode.trim())) {
            return res.status(400).json({
                success: false,
                message: "Pincode must be 6 digits",
            });
        }

        const customer = await Customer.findById(req.user.customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const cartItem of customer.cart) {
            if (!mongoose.Types.ObjectId.isValid(cartItem.product)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product in cart",
                });
            }

            const product = await Product.findById(cartItem.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            const itemTotal =
                product.price * cartItem.quantity;

            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image,
            });
        }

        const order = await Order.create({
            user: customer._id,
            items: orderItems,
            shippingAddress: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                addressLine1: addressLine1.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim(),
            },
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT",
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString(),
        });

        order.razorpayOrderId = razorpayOrder.id;

        await order.save();

        res.status(201).json({
            success: true,
            message: "Payment order created",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            items: orderItems,
            shippingAddress: order.shippingAddress,
            totalAmount,
        });

    } catch (error) {
        console.log("Create payment order error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            orderId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        } = req.body;

        if (
            !orderId ||
            !razorpayOrderId ||
            !razorpayPaymentId ||
            !razorpaySignature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification details are required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        if (order.paymentStatus === "PAID") {
    return res.status(400).json({
        success: false,
        message: "Payment has already been verified",
    });
}

        if (
            order.user.toString() !==
            req.user.customerId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to verify this order",
            });
        }

        if (order.razorpayOrderId !== razorpayOrderId) {
            return res.status(400).json({
                success: false,
                message: "Razorpay order ID does not match",
            });
        }

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpayOrderId}|${razorpayPaymentId}`
            )
            .digest("hex");

        if (generatedSignature !== razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        // Final stock validation and stock update
        for (const item of order.items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.name} is no longer available`,
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}`,
                });
            }

            product.stock -= item.quantity;

            await product.save();
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpayPaymentId;

        await order.save();

        const customer = await Customer.findById(
            req.user.customerId
        );

        if (customer) {
            customer.cart = [];
            await customer.save();
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            orderId: order._id,
        });

    } catch (error) {
        console.log("Verify payment error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.customerId,
        })
            .populate({
                path: "items.product",
                select: "name price image category",
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.log("Get orders error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const order = await Order.findOne({
            _id: id,
            user: req.user.customerId,
        }).populate({
            path: "items.product",
            select: "name price image category description",
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.log("Get order error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrderById,
};