const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Costumer = require('../models/costumerModel');
const secret = process.env.JWT_SECRET | '11this1is1my1secret11';
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, secret);
        let user;
        if(req.url.includes('costumer')){
            user = await Costumer.findOne({ _id: decoded._id, 'tokens.token': token });
        }else{
            user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        }
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

module.exports = auth;