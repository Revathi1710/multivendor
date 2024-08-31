const mongoose = require('mongoose');

// Updated VendorSchema without cpassword
const VendorSchema = new mongoose.Schema({
    fname: String,
    email: { type: String, unique: true },
    number: String,
    businessName: String,
    lname: String,
    alterEmail: String,
    alterNumber: String,
    whatsappNumber: String,
    jobTitle: String,
    password:String,
    
   
    OfficeContact:String,
    FaxNumber:String,
    Ownership:String,
    AnnualTakeover:String,
    establishment:String,
    NoEmployee:String,
    selectType:String,
    Address:String,
    City:String,
    State:String,
    Country:String,
    Pincode:String
}, { collection: 'vendor' });

module.exports = mongoose.model('Vendor', VendorSchema);
