const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const Costumer = require('../models/costumerModel');
const router = new express.Router();

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
});


router.post('/costumer/new', async (req,res)=>{
    try{
        const costumer = await new Costumer(req.body);
        // costumer.avatar = req.file.buffer;
        const token = await costumer.generateAuthToken();
        res.status(201).send({costumer,token});
    }catch(err){
        res.send(err.message);
    }
    
});

router.post('/costumer/login',async (req,res)=>{
    try{
        const costumer = await Costumer.findByCredentials(req.body.userName, req.body.password);
        
        const token = await costumer.generateAuthToken();
        res.send({costumer,token});
    }catch(err){
        res.status(400).send(err.message)
    }
});

router.post('/costumer/logout', auth ,async (req,res)=>{
    try{
        const costumer = req.user;
        costumer.tokens = costumer.tokens.filter((token)=>{
            return token.token !==req.token;
        });
        await costumer.save();
        res.send('Logout successful')
    }catch(err){
        res.send(err.message);
    }
});

router.post('/costumer/logout-all', auth, async (req,res)=>{
    try{
        const costumer = req.user;
        costumer.tokens = [];
        await costumer.save();
        res.send('Logout all successful')
    }catch(err){
        res.send(err.message);
    }
});

router.patch('/costumer/edit', auth,async (req,res)=>{
    const validKeys = ['userName','password','email','cart'];
    const reqKeys = Object.keys(req.body);
    for(let key of reqKeys){
        if(!validKeys.includes(key)){
            return res.status(400).send('Invalid update: '+key)
        }
    }
    try{
        const costumer = req.user;
        for (let key of reqKeys){
            if(key==='cart'){
                costumer[key] = JSON.parse(req.body[key]);
            }else{
                costumer[key] = req.body[key];
            }
                
        }
        await costumer.save();
        res.send(costumer)
    }catch(err){
        res.send(err.message);
    }
});

router.get('/costumer/', auth, async (req,res)=>{
    try{
        const costumer = req.user;
        if(!costumer){
            return res.status(404).send({status: 404, message: 'User not found'});
        }
        res.send(costumer);
    }catch(err){
        res.status(500).send();
    }    
});

router.get('/costumer/getUserNames', async (req,res)=>{
    try{
        const users = await Costumer.find({ });
        let userNames = [];
        for(let user of users){
            userNames = userNames.concat(user.userName);
        }
        res.send(userNames);
    }catch(err){
        res.status(500).send();
    }    
});

router.get('/costumer/cart', auth, async (req,res)=>{
    try{
        const costumer = req.user;
        if(!costumer){
            return res.status(404).send({status: 404, message: 'No available details'});
        }
        res.send(costumer.cart);
    }catch(err){
        res.status(500).send();
    }    
});

router.patch('/costumer/cart/add-book', auth, async (req,res)=>{
    try{
        const costumer = req.user;
        if(!costumer){
            return res.status(404).send({status: 404, message: 'No available details'});
        }
        costumer.cart = costumer.cart.concat(req.body);
        await costumer.save();
        res.send(costumer.cart);
    }catch(err){
        res.status(500).send();
    }    
});

router.patch('/costumer/cart/remove-book', auth, async (req,res)=>{
    try{
        const costumer = req.user;
        if(!costumer){
            return res.status(404).send({status: 404, message: 'No available details'});
        }
        costumer.cart = costumer.cart.filter((book)=>{
            return book.isbn !== req.body.isbn;
        });
        await costumer.save();
        res.send(costumer.cart);
    }catch(err){
        res.status(500).send();
    }    
});

router.get('/costumer/:userName/avatar', async (req,res)=>{
    try{
        const user = await Costumer.findById(req.params.userName);
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
        }catch(err){
        res.status(404).send('Avatar not found'); 
    }
});



module.exports = router;