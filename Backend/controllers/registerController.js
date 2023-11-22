const { connectToCluster } = require('../database/connect');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {

    console.log("request");

    // validation functions

    function validateFields(username, email, phone, password, confirmPassword) {
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

    // data handler

    const { username, email, phone, password, confirmPassword } = req.body;
    const validationError = validateFields(username, email, phone, password, confirmPassword);
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
            password: hashedPassword,
        };
        const result = await usersCollection.insertOne(userToInsert);
        res.status(201).json({ success: 'User Registeration Successfull' });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
};
