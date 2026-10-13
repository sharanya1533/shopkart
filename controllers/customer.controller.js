const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.model");

const registerCustomer = async (req, res) => {
try {
const { fullName, email, password, phone } = req.body;


    if (!fullName || !email || !password || !phone) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingCustomer = await Customer.findOne({ email: normalizedEmail });

    if (existingCustomer) {
        return res.status(409).json({
            success: false,
            message: "Email already registered"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone.trim()
    });

    res.status(201).json({
        success: true,
        message: "Customer registered successfully",
        customer: {
            _id: customer._id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone
        }
    });

} catch (error) {
    res.status(500).json({
        success: false,
        message: "Server error"
    });
}


};

const loginCustomer = async (req, res) => {
try {
const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const customer = await Customer.findOne({ email: normalizedEmail });

    if (!customer) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        customer.password
    );

    if (!isPasswordCorrect) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        { customerId: customer._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("authToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    });

    res.status(200).json({
        success: true,
        message: "Login successful"
    });

} catch (error) {
    res.status(500).json({
        success: false,
        message: "Server error"
    });
}


};

const getMyProfile = async (req, res) => {
try {
const customer = await Customer.findById(req.user.customerId)
.select("-password");


    if (!customer) {
        return res.status(404).json({
            success: false,
            message: "Customer not found"
        });
    }

    res.status(200).json({
        success: true,
        customer: {
            _id: customer._id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone
        }
    });

} catch (error) {
    res.status(500).json({
        success: false,
        message: "Server error"
    });
}


};

const logoutCustomer = (req, res) => {
    res.clearCookie("authToken", {
        path: "/",
        httpOnly: true,
        sameSite: "lax"
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

module.exports = {
registerCustomer,
loginCustomer,
getMyProfile,
logoutCustomer
};
