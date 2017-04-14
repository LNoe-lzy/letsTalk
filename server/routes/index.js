var express = require('express');
var router = express.Router();

// 引入数据库模型
var Comment = require('../models/comment');
var CommentLike = require('../models/commentLike');
var Reply = require('../models/reply');
var ReplyLike = require('../models/replyLike');


// 引入工具模块
var Utils = require('../models/Utils');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'home'
  });
  // res.json({
  //   title: '123',
  //   msg: '123'
  // });
});

// 根页面url获取对应的comment
router.get('/api/url', function (req, res) {
  var currentUrl = req.query.url;
  Comment.find({
    pageUrl: currentUrl
  }, function (err, c) {
    if (err) {
      console.log(err);
    }
    res.json(c);
  });
});

// 保存评论
router.post('/api/savecomment', function (req, res) {
  var data = req.body;
  var time = Utils.getTime();
  var newComment = new Comment({
    pageUrl: data.pageUrl,
    userId: data.userId,
    text: data.text,
    noteTime: time.day,
    commentTag: data.commentTag,
    xpath: data.xpath,
    likeNum: 0,
    comment: data.comment
  });
  newComment.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.json({
      errno: 0
    });
  });
});

// 保存回复
router.post('/api/savereply', function (req, res) {
  var data = req.body;
  var time = Utils.getTime();
  var newReply = new Reply({
    commentId: data.commentId,
    userId: data.userId,
    repliedUserId: data.repliedUserId,
    noteTime: time.day,
    text: data.text,
    likeNum: 0
  });
  newReply.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.json({
      errno: 0
    });
  });
});
// 删除评论
router.post('/api/removecomment', function (req, res) {
  var data = req.body;
  Comment.remove({
    _id: data.commentId
  }, function (err) {
    if (err) {
      console.log(err);
    }
    Reply.remove({
      commentId: data.commentId
    }, function (err) {
      if (err) {
        console.log(err);
      }
      res.json({
        errno: 0
      });
    });
  });
});
// 删除回复
router.post('/api/removereply', function (req, res) {
  var data = req.body;
  Reply.remove({
    _id: data.replyId
  }, function (err) {
    if (err) {
      console.log(err);
    }
    res.json({
      errno: 0
    });
  });
});

// 获取reply
router.get('/api/getreply', function (req, res) {
  var userId = req.query.userId;
  var commentId = req.query.commentId;
  Reply.get({
    userId: userId,
    commentId: commentId
  }, function (err, r) {
    if (err) {
      console.log(err);
    }
    res.json(r);
  })
});

// comment点赞
router.post('/api/commentlike', function (req, res) {
  var data = req.body;
  Comment.update({
    _id: data.commentId
  }, {
    $inc: {
      likeNum: 1
    }
  }, function (err) {
    if (err) {
      console.log(err);
    }
    var newCommentLike = new CommentLike({
      commentId: data.commentId,
      userId: data.userId,
      isLike: true
    });
    newCommentLike.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.json({
        errno: 0
      });
    });
  });
});

// comment取消点赞
router.post('/api/uncommentlike', function (req, res) {
  var data = req.body;
  Comment.update({
    _id: data.commentId
  }, {
    $inc: {
      likeNum: -1
    }
  }, function (err) {
    if (err) {
      console.log(err);
    }
    CommentLike.remove({
      commentId: data.commentId,
      userId: data.userId
    }, function (err) {
      if (err) {
        console.log(err);
      }
      res.json({
        errno: 0
      });
    });
  });
});

// reply点赞
router.post('/api/replylike', function (req, res) {
  var data = req.body;
  Reply.update({
    commentId: data.commentId
  }, {
    $inc: {
      likeNum: 1
    }
  }, function (err) {
    if (err) {
      console.log(err);
    }
    var newReplyLike = new ReplyLike({
      replyId: data.replyId,
      userId: data.userId,
      isLike: true
    });
    newCommentLike.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.json({
        errno: 0
      });
    });
  });
});

// reply取消点赞
router.post('/api/unreplylike', function (req, res) {
  var data = req.body;
  Reply.update({
    _id: data.replyId
  }, {
    $inc: {
      likeNum: -1
    }
  }, function (err) {
    if (err) {
      console.log(err);
    }
    ReplyLike.remove({
      replyId: data.replyId,
      userId: data.userId
    }, function (err) {
      if (err) {
        console.log(err);
      }
      res.json({
        errno: 0
      });
    });
  });
});

//  站内模糊搜索
router.get('/api/search', function (req, res) {
  var pattern = new RegExp("^.*" + req.query.keyword + ".*$", "i");
  Comment.find({
    text: pattern
  }, function (err, s) {
    if (err) {
      console.log(err);
    }
    res.json(s);
  });
});


module.exports = router;