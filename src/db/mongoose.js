const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true
});

// /Users/לוי/Desktop/nodejs/mongodb/bin/mongod.exe --dbpath=/Users/לוי/Desktop/nodejs/mongodb-data