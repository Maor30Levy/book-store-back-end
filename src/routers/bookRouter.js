const express = require('express');
const qs = require('qs');
const auth = require('../middleware/auth');
const Book = require('../models/bookModel');
const router = new express.Router();

router.post('/books/new', auth, async (req,res)=>{
    
    try{
        const book = await new Book(req.body);
        await book.save();
        res.status(201).send(book);
    }catch(err){
        res.status(400).send(err.message);  
    }
});

router.delete('/books/delete-book/:isbn', auth, async (req,res)=>{
    try{
        const isbn = req.params.isbn;
        const book = await Book.findOneAndDelete({isbn});
        if(!book){
            return res.status(404).send('Book not found!');
        }
        res.send(book);
    }catch(err){
        res.send(err.message); 
    }
});

router.patch('/books/edit/:isbn', auth,async (req,res)=>{
    const isbn = req.params.isbn;
    const book = await Book.findOne({isbn});
    if(!book){
        return res.status(404).send('Book not found!');
    }
    const validKeys = [
        'title',
        'author',
        'category',
        'price',
        'isbn',
        'image',
        'summary'
    ];
    const reqKeys = Object.keys(req.body);
    for(let key of reqKeys){
        if(!validKeys.includes(key)){
            return res.status(400).send('Invalid update: '+key)
        }
    }
    try{
        for (let key of reqKeys){
            book[key] = req.body[key];
        }
        await book.save();
        res.send(book);
    }catch(err){
        res.send(err.message);
    }
});

router.get('/books',async (req,res)=>{
    const match={};
    let tags=[];
    const sort={};
    const priceRangeQuery = {};
    let queryKeys = Object.keys(req.query);
    queryKeys = queryKeys.filter((key)=>{
        if(key==='sortBy'|| key==='limit' || key==='skip'){
            return false;
        }
        return true;
    });
    for(let key of queryKeys){
        const value = req.query[key];
        if(key==='title'||key==='author'||key==='category'){            
            tags = tags.concat(value.toLowerCase().split(' '));
        }else if(key==='fromPrice'||key==='toPrice'){
            if(key==='fromPrice'){
                priceRangeQuery.$gte=parseInt(value);
            }else{
                priceRangeQuery.$lte=parseInt(value);  
            }
       }else{
            match[key] = value;
       }
        
    }
    if(tags.length>0){
        match.tags = {$all:tags};
    }
    if(priceRangeQuery.$gte||priceRangeQuery.$lte){
        match.price = priceRangeQuery;
    }
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1;
    }
    try{
        const books = await Book
        .find(match)
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        .sort(sort);
        res.send(books);
    }catch(err){
        res.send(err);
    }
});

router.get('/books/:isbn',async (req,res)=>{
    try{
        const isbn = req.params.isbn;
        const book = await Book.findOne({isbn});
        if(!book){
            return res.status(404).send('Book not found!');
        }
        res.send(book);
    }catch(err){
        res.send(err.message); 
    }
});

router.post('/books/add-comment', async (req,res)=>{
    try{
        const isbn = req.body.isbn;
        const book = await Book.findOne({isbn});
        if(req.body.rating){
            let rating = (book.rating)*book.numOfRatings;
            book.numOfRatings++;
            book.rating = Math.round(( (rating + req.body.rating) / book.numOfRatings )*100 )/100;
        }
        if(req.body.comment){
            book.comments.push(req.body.comment);
        }
        await book.save();
        res.send(book); 
    }catch(err){
        res.send({message: err.message}); 
    }

});

module.exports = router;