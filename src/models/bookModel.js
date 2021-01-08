const mongoose = require('mongoose');
const validator = require('validator');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    author: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numOfRatings:{
        type: Number,
        default: 0
    },
    comments: [{
        type: String
     }   
    ],
    isbn: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    summary: {
        type: String,
    },
    image: {
        type: String,

    },
    
    
},
{
    timestamps: true
}
);

bookSchema.methods.toJSON = function () {
    const book = this;
    const bookObject = book.toObject();

    delete bookObject._id;
    delete bookObject.createdAt;
    delete bookObject.updatedAt;
    delete bookObject.__v;
    

    return bookObject;
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;