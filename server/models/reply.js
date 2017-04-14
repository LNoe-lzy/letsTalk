var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReplySChema = new Schema({
    commentId: String,
    userId: String,
    repliedUserId: String,
    noteTime: String,
    text: String,
    likeNum: Number
});

var Reply = mongoose.model('reply', ReplySChema);

module.exports = Reply;