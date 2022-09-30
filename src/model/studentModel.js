const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    fname: {type: String, required:"First Name is Required",trim:true},
    lname: {type: String, required:"Last Name is Required",trim:true},
    email: {type: String, required:"Email is Required", unique:true,trim:true,lowercase:true},
    phone: {type: String, required:"Mobile is Required",unique:true,trim:true}, 
    password: {type: String, required:"Password is Required",trim:true}, // encrypted password
    address: {
        street: {type: String, required:"Street is Required",trim:true},
        city: {type: String, required:"City is Required",trim:true},
        pincode: {type: Number, required:"Pin Code is Required",trim:true}
    } 
}, { timestamps: true })


module.exports = mongoose.model('Student', studentSchema);