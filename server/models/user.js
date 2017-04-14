var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String
});

var User = mongoose.model('user', UserSchema);

module.exports = User;