const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/userModel');
const router = new express.Router();


router.post('/user/new',async (req,res)=>{
    try{
        const user = await new User(req.body).save();
        res.status(201).send(user);
    }catch(err){
        res.send(err.message);
    }
    
});
router.post('/user/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.username, req.body.password);
        const token = await user.generateAuthToken();
        res.send({token});

    }catch(err){
        res.status(400).send(err.message)
    }
});

router.post('/user/logout', auth ,async (req,res)=>{
    try{
        const user = req.user;
        user.tokens = user.tokens.filter((token)=>{
            return token.token !==req.token;
        });
        await user.save();
        res.send('Logout successful')
    }catch(err){
        res.send(err.message);
    }
});

router.post('/user/logout-all', auth, async (req,res)=>{
    try{
        const user = req.user;
        user.tokens = [];
        await user.save();
        res.send('Logout all successful')
    }catch(err){
        res.send(err.message);
    }
});

router.patch('/user/edit', auth,async (req,res)=>{
    const validKeys = ['userName','password','email'];
    const reqKeys = Object.keys(req.body);
    for(let key of reqKeys){
        if(!validKeys.includes(key)){
            return res.status(400).send('Invalid update: '+key)
        }
    }
    try{
        const user = req.user;
        for (let key of reqKeys){
            user[key] = req.body[key];
        }
        await user.save();
        res.send(user)
    }catch(err){
        res.send(err.message);
    }
});

router.get('/user/', auth, async (req,res)=>{
    try{
        const user = await User.find({ });
        if(!user){
            return res.status(404).send({status: 404, message: 'User not found'});
        }
        res.send(user);
    }catch(err){
        res.status(500).send();
    }    
});

module.exports = router;