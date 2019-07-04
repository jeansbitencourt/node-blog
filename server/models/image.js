const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Image = new Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: Buffer,
        required: true  
    },
    contentType: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
},{
    collection: 'images'
});

module.exports = function(){
    return mongoose.model('Image', Image);
}