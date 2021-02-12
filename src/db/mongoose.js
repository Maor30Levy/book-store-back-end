const mongoose = require('mongoose');

const mongo = 'mongodb+srv://myuser:mongoPass@cluster0.7okwl.mongodb.net/book-store-backend?retryWrites=true&w=majority'

mongoose.connect(mongo, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true
});

