var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentLikeSchema = new Schema({
    commentId: String,
    userId: String,
    isLike: Boolean
});

var CommentLike = mongoose.model('commentLike', CommentLikeSchema);

module.exports = CommentLike;