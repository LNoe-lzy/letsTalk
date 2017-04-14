var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReplyLikeSchema = new Schema({
    replyId: String,
    userId: String,
    isLike: Boolean
});

var ReplyLike = mongoose.model('replyLike', ReplyLikeSchema);

module.exports = ReplyLike;