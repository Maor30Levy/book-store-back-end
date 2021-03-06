const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET | '11this1is1my1secret11';

const costumerSchema = new mongoose.Schema({
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
    cart: [{
            isbn:{
                type: String
            },
            quantity:{
                type: Number
            }
        }],
    avatar: {
        type: Buffer,
    }
},
{
    timestamps: true
});


costumerSchema.statics.findByCredentials = async (userName,password)=>{
    const costumer = await Costumer.findOne({userName});
    if(!costumer){
        throw new Error('Unable to login');
    }
    const isPasswordMatch = await bcrypt.compare(password, costumer.password);
    if (!isPasswordMatch) {
        throw new Error('Unable to login');
    }

    return costumer;
};

costumerSchema.methods.generateAuthToken = async function () {
    const costumer = this;
    const token = jwt.sign({ _id: costumer._id.toString() }, secret);
    costumer.tokens = costumer.tokens.concat({ token });
    await costumer.save();
    return token;
};

costumerSchema.pre('save', async function (next) {
    const costumer = this;
    if (costumer.isModified('password')) {
        costumer.password = await bcrypt.hash(costumer.password, 8);
    }
    next();
});

const Costumer = mongoose.model('Costumer', costumerSchema);

module.exports = Costumer;