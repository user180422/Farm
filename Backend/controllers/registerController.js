const { connectToCluster } = require('../database/connect');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    // console.log("Hello eee", req);

    // validation functions
    function validateFields(username, email, phone, paymentMethod, paymentId, password, confirmPassword) {
        console.log("inner");
        if (!username) {
            return 'Username is required.';
        }

        if (!email) {
            return 'Email is required.';
        } else if (!validateEmail(email)) {
            return 'Invalid email format.';
        }

        if (!phone) {
            return 'Phone number is required.';
        } else if (!validatePhoneNumber(phone)) {
            return 'Invalid phone number format.';
        }

        if (!paymentMethod) {
            return 'Payment Method required.';
        }

        if (!paymentId) {
            return 'Payment id required.';
        }

        if (!password) {
            return 'Password is required.';
        }

        if (!confirmPassword) {
            return 'Confirm password is required.';
        }

        if (password !== confirmPassword) {
            return 'Passwords do not match.';
        }

        return null;
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhoneNumber(phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return phoneRegex.test(phone);
    }

    // sending email
    async function sendWelcomeEmail(userEmail, user) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const verificationLink = `http://localhost:4000/verification.html?token=${user.verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: 'Welcome to Farm! Verify Your Email to Get Started',
            text: `Hi ${user.username}, Welcome to Farm! We're thrilled to have you on board. To get started, please click the button below to verify your email address: ${verificationLink}`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending welcome email:', error.message);
            return false;
        }
    }

    // token generator
    const generateUniqueToken = () => {
        const tokenLength = 32;
        const buffer = require('crypto').randomBytes(tokenLength);
        return buffer.toString('hex');
    };

    console.log("req.body", req.body);

    // data handler
    const { username, email, phone, paymentMethod, paymentId, password, confirmPassword } = req.body;
    const validationError = validateFields(username, email, phone, paymentMethod, paymentId, password, confirmPassword);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const client = await connectToCluster();
        const database = client.db("Farm");
        const usersCollection = database.collection('Users');

        const existingEmail = await usersCollection.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        const userToInsert = {
            username: username,
            email: email,
            phone: phone,
            role: "user",
            paymentMethod: paymentMethod,
            paymentId: paymentId,
            password: hashedPassword,
            verificationToken: generateUniqueToken(),
            isEmailVerified: false,
            priceUsed: 0
        };

        console.log("userdata", userToInsert);

        const emailSent = await sendWelcomeEmail(email, userToInsert);

        if (!emailSent) {
            return res.status(500).json({ error: 'Error sending welcome email. Please try again later.' });
        }

        const result = await usersCollection.insertOne(userToInsert);
        res.status(201).json({ success: 'User Registration Successful. Check your mailbox to verify your email.' });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }
};

// email verification
exports.verifyEmail = async (req, res) => {

    const token = req.query.token;
    const client = await connectToCluster();
    const database = client.db("Farm");
    const usersCollection = database.collection('Users');

    const result = await usersCollection.updateOne(
        { verificationToken: token },
        { $set: { isEmailVerified: true, verificationToken: null } }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Invalid verification token' });
    }
    return res.status(200).json({ message: 'Email successfully verified' });

}

// login user
exports.loginUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        const client = await connectToCluster();
        const database = client.db("Farm");
        const usersCollection = database.collection('Users');

        const user = await usersCollection.findOne({ email: email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ error: 'Email not verified. Please activate your email.' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_TOKEN, { expiresIn: '1h' });
        res.cookie('farm', token);
        res.status(200).json({ success: 'Login successful', userId: user._id, email: user.email, token: token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

// forget-password request
exports.fargetPassword = async (req, res) => {
    const { email } = req.body;

    const client = await connectToCluster();
    const database = client.db("Farm");
    const usersCollection = database.collection('Users');

    const user = await usersCollection.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: '1h' });

    // sending email
    async function sendWelcomeEmail(userEmail, user) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const resetURL = `http://localhost:4000/newPassword.html?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: 'Password Reset Request',
            text: `Click the following link to reset your password: ${resetURL}`,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending welcome email:', error.message);
            return false;
        }
    }

    const emailSent = await sendWelcomeEmail(email, user);

    if (emailSent) {
        res.status(200).json({ "success": 'Password reset email sent successfully' });
    } else {
        res.status(500).json({ "error": 'Error sending password reset email' });
    }

};

exports.checktoken = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the token
        jwt.verify(token, process.env.JWT_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            const { email } = decoded;

            const client = await connectToCluster();
            const database = client.db("Farm");
            const usersCollection = database.collection('Users');

            const user = await usersCollection.findOne({ email });

            if (!user) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            // Token is valid
            res.status(200).json({ success: 'Token is valid' });
        });
    } catch (error) {
        console.error('Error checking token validity:', error);
        res.status(500).json({ error: 'Internal server error', status: 500 });
    }
};

exports.newPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        // Verify the token
        jwt.verify(token, process.env.JWT_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            const { email } = decoded;

            const client = await connectToCluster();
            const database = client.db("Farm");
            const usersCollection = database.collection('Users');
            const user = await usersCollection.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await usersCollection.updateOne(
                { email: email },
                { $set: { password: hashedPassword } }
            );

            if (result.modifiedCount === 1) {
                res.status(200).json({ success: 'Password reset successful' });
            } else {
                res.status(404).json({ error: 'User not found or password not updated' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
