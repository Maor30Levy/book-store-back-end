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
    comments: [{
     comment: {
        type: String
     }   
    }],
    isbn: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    image: {
        type: String,

    },
    tags: [String]
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

bookSchema.methods.renderTags = function (){
    const book = this;
    book.tags = [];
    book.tags = book.title.toLowerCase().split(' ');
    book.tags = book.tags.concat(book.author.toLowerCase().split(' '));
    book.tags = book.tags.concat(book.category.toLowerCase().split(' '));
    console.log(book.tags);
}

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;