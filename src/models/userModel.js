const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET | '11this1is1my1secret11';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        minlength: 7,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate(value){
            return (validator.isEmail(value))
        },
        unique: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer,
    }
},
{
    timestamps: true
});


userSchema.statics.findByCredentials = async (username,password)=>{
    const user = await User.findOne({username});
    if(!user){
        throw new Error('Unable to login');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, secret);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;