const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Costumer = require('../models/costumerModel');

const userAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Not authenticated' });
    }
};

const costumerAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Costumer.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Not authenticated' });
    }
};

module.exports = {userAuth,costumerAuth};