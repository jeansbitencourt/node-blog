const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Category = new Schema({
    name: {
        type: String,
        required: true,
        unique: true 
    },
    description: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        max: Date.now,
        default: Date.now
    }
},{
    collection: 'categories'
});

module.exports = function(){
    return mongoose.model('Category', Category);
}