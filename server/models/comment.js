var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    pageUrl: String,
    userId: String,
    text: String,
    noteTime: String,
    commentTag: String,
    xpath:  String,
    likeNum: Number,
    comment: String
});

var Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;