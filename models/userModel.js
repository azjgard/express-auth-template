var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// define how the users are going to be stored in the database
var UserSchema = new Schema({
    username        : { type : String, unique : true },
    email           : String,
    hashed_password : String
});

mongoose.model('User', UserSchema);
