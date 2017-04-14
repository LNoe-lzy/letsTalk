"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;
(function (win) {
    "use strict";

    var instanceComment = void 0;
    var instanceReply = void 0;
    /**
     * 输入框组件
     *  1:回复输入框 0:评论输入框
     */

    var Input = function () {
        function Input(config) {
            var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            _classCallCheck(this, Input);

            var _default = void 0;
            this.state = state;

            if (this.state === 1) {
                if (instanceReply) {
                    return instanceReply;
                }
                instanceReply = this;
                //默认数据
                _default = {
                    repliedUserName: "被回复",
                    repliedUserId: "被回复ID",
                    userName: "匿名用户"
                };
            } else {
                if (instanceComment) {
                    return instanceComment;
                }
                instanceComment = this;

                _default = {
                    xpath: "",
                    userName: "匿名用户",
                    text: "原文内容"
                };
            }
            Object.assign(this, _default, config);
            this.initDoms();
        }

        _createClass(Input, [{
            key: "initDoms",
            value: function initDoms() {
                var html = void 0;
                if (this.state === 1) {
                    html = this._initAddDom(this.repliedUserName);
                } else {
                    html = this._initAddDom();
                }
                this.wrapNode = document.getElementById(this.wrap);
                this.wrapNode.insertAdjacentHTML('beforeend', html);
                this.addInputEvent();
            }

            /**
             * 添加评论  模块
             * @private
             */

        }, {
            key: "_initAddDom",
            value: function _initAddDom(user) {
                var addHtml = void 0,
                    userName = void 0,
                    headText = void 0;
                if (user) {
                    this.addText = "";
                    headText = "<div class=\"comment-username\">" + this.userName + "<span class=\"comment-reply-word\">\u56DE\u590D</span><span class=\"replyed\">" + user + "</span></div>";
                } else {
                    this.addText = "<div class=\"comment-text\">" + this.text + "</div>";
                    headText = "<div class=\"comment-username\">" + this.userName + "</div>";
                }

                this.addHead = "\n                    <div class=\"comment-head\">\n                        " + headText + "\n                        <div class=\"comment-time\">now</div>\n                    </div>\n            ";

                this.addInput = "\n                    <div id=\"content-input\" class=\"comment-input\">\n                        <input name=\"tags\" class=\"comment__input--tags\" placeholder=\"\u6DFB\u52A0\u6807\u7B7E\u2026\u2026\"/>\n                        <textarea name=\"comment\" class=\"comment__textarea--text\"></textarea>\n                        <div class=\"comment__div--control\">\n                            <div class=\"comment-inputbtn\">\u516C\u5F00\u53D1\u5E03</div>\n                            <div class=\"comment-tips\">*\u8BF7\u5148\u586B\u5199\u8BC4\u8BBA\u5185\u5BB9</div>\n                            <div class=\"comment-inputcancel\"><span class=\"icon-cancel\"></span>\u53D6\u6D88</div>\n                        </div>\n                        <p class=\"comment-rule\">\u89C4\u8303\u7F51\u7EDC\u8A00\u8BBA\uFF0C\u52A0\u5F3A\u76D1\u7763\u7BA1\u7406</p>\n                    </div>\n             ";

                addHtml = '<div class="comment-wrap"><div class="comment-form">' + this.addHead + this.addText + this.addInput + '</div></div>';
                return addHtml;
            }

            /**
             * 添加输入模块事件
             */

        }, {
            key: "addInputEvent",
            value: function addInputEvent() {
                var _this = this;

                var str = "#" + this.wrap + " .comment-form";
                this.inputNode = document.querySelector(str);

                //绑定1.点击扩展输入框 2.点击提交框 3.取消输入框事件
                this.inputNode.addEventListener("click", function (eve) {
                    var target = eve.target;
                    switch (target.classList[0]) {
                        //扩展文本框
                        case 'comment__textarea--text':
                            {
                                target.style.height = "120px";
                                target.style.maxHeight = "120px";
                                break;
                            }

                        case 'comment-inputbtn':
                            {
                                var comment = "#" + _this.wrap + " .comment__textarea--text",
                                    tag = "#" + _this.wrap + " .comment__input--tags";
                                var commentNode = document.querySelector(comment),
                                    tagNode = document.querySelector(tag);
                                var tips = target.nextElementSibling;
                                if (commentNode.value === '') {
                                    tips.style.display = "block";
                                } else {
                                    tips.style.display = "none";

                                    if (_this.state === 0) {
                                        var commentObj = {
                                            xpath: _this.xpath,
                                            userId: _this.userId,
                                            text: _this.text,
                                            comment: commentNode.value,
                                            noteTime: Date.now(),
                                            commentTags: tagNode.value
                                        };

                                        //ZXCJK
                                        Utils.sendMsg('commentAdd', commentObj);
                                        console.log("zxc", commentObj);
                                    } else {
                                        //修改成真正的ID
                                        var realCommentId = _this.commentId.slice(2);

                                        var replyObj = {
                                            commentId: realCommentId,
                                            reply: commentNode.value,
                                            replyTags: tagNode.value,
                                            userId: _this.userId,
                                            repliedUserId: _this.repliedUserId,
                                            noteTime: String(Date.now())
                                        };

                                        //ZXCJK
                                        // Utils.sendMsg('replyAdd', replyObj);
                                        console.log("zxc", replyObj);
                                    }
                                }
                                break;
                            }

                        case 'comment-inputcancel':
                            {
                                _this.deleteInput();
                                break;
                            }
                    }
                }, false);
            }

            //删除输入节点

        }, {
            key: "deleteInput",
            value: function deleteInput() {
                this.wrapNode.removeChild(this.inputNode.parentNode);
                Utils.destory(this);
                if (this.state === 1) {
                    instanceComment = null;
                } else {
                    instanceReply = null;
                }
            }
        }]);

        return Input;
    }();

    var Comment = function () {
        /**
         * 初始化评论数据
         * @param {num} state 当前组件状态: 0 - 发评论； 1 - 展示评论
         * @param {object} config 初始化评论的内容 {wrap: id}
         */
        function Comment(config) {
            _classCallCheck(this, Comment);

            var _default = void 0;
            //默认数据
            _default = {
                commentUser: "匿名用户", //用户名
                text: "原文内容", //引用内容
                comment: "我困了", //评论内容
                noteTime: "12:00", //创建时间
                commentThumps: 0, //点赞数
                tags: ["标签"], //标签
                reply: [], //回复评论
                isUser: 0, //判断是不是用户本人
                isThumped: 0 };
            Object.assign(this, _default, config);

            //修改成真正的ID, ***只在入口和出口修改
            this.realCommentId = this.commentId;
            //ID会出现数字导致无法通过document.querySelector访问,需要返回时解析
            this.commentId = "lt" + this.commentId;
            this.initDoms();
        }

        /**
         * 初始化所有节点
         */


        _createClass(Comment, [{
            key: "initDoms",
            value: function initDoms() {
                var html = void 0;
                this.wrapNode = document.getElementById(this.wrap);
                html = this._initCommentDom();
                this.wrapNode.insertAdjacentHTML('beforeend', html);
                //判断是否点过赞了
                if (this.isThumped === 1) {
                    var str = "#" + this.commentId + " .comment-thumps";
                    var node = document.querySelector(str);
                    node.style.color = "#0f88eb";
                }
                this.addCommentEvent();
            }

            /**
             * 初始化评论节点
             * 分为
             * this.commentHead
             * this.commentTags
             * this.commentText
             * this.commentComment
             * this.commentBottom
             */

        }, {
            key: "_initCommentDom",
            value: function _initCommentDom() {
                var html = void 0;
                //判断是否生成标签部分;
                if (this.tags.length !== 0) {
                    var _html = "";
                    this.commentTags = "<div class='comment-tags'>"; //'<div class="comment-tags"></div>';
                    this.tags.map(function (item) {
                        var str = "<span class=\"comment__span--tag\">" + item + "</span>";
                        _html += str;
                    });
                    this.commentTags += _html + "</div>";
                } else {
                    this.commentTags = "";
                }

                //判断是否生成引用部分
                if (this.text !== "") {
                    this.commentText = "<div class=\"comment-text\">" + this.text + "</div> ";
                } else {
                    this.commentText = "";
                }

                //评论头部 
                this.commentHead = "\n                <div class=\"comment-head\">\n                    <div class=\"comment-username\">\n                        " + this.commentUser + "\n                    </div>\n                    <div class=\"comment-time-thumps\">\n                        <span class=\"comment-thumps\">\n                            <span class=\"icon-thumbs-o-up\"></span>\n                            <span class=\"thump-num\">" + this.commentThumps + "</span>\n                        </span>\n                        <span class=\"comment-time\">" + this.noteTime + "</span>                            \n                    </div>\n                </div>\n            ";

                //评论内容
                this.commentComment = "<div class=\"comment-comment\">" + this.comment + "</div>";
                //评论底部

                //隐藏回复部分
                this.replyNum = this.reply.length;
                var replyMsg = void 0; //回复数量标记div
                var replyHtml = void 0; //整个回复模块
                if (this.replyNum !== 0) {
                    replyMsg = "<div class=\"comment__div--reply\">\n                            <a class=\"reply-toggle\">\u663E\u793A\u56DE\u590D(" + this.replyNum + ")</a>\n                        </div>";
                    this.replyShow = 0;

                    replyHtml = "";
                    for (var i = 0; i < this.replyNum; i++) {
                        replyHtml += this._initReplyDom(this.reply[i]);
                    }
                    replyHtml = "<div class=\"comment-all-replys\">" + replyHtml + "</div>";
                } else {
                    replyMsg = "<div class=\"comment__div--reply\">\n                        </div>";
                    replyHtml = "";
                }

                var cancel = "";
                if (this.isUser) {
                    cancel += "<a data-reply-id=\"" + this.commentId + "\" class=\"icon-cancel2 comment__span--option\"></a>";
                }
                this.commentBottom = "\n                <div class=\"comment-bottom\">\n                    " + replyMsg + "\n                    <div class=\"comment__div--options\">\n                        " + cancel + "\n                        <a data-user=\"" + this.commentUser + "\" data-id=\"" + this.commentUserId + "\" class=\"icon-chat comment__span--option\"></a>\n                    </div>\n                </div>\n            ";

                html = "<div class=\"comment-wrap\" data-comment-id=\"" + this.commentId + "\"><div class=\"comment-item\" id=\"" + this.commentId + "\">" + this.commentHead + this.commentTags + this.commentText + this.commentComment + this.commentBottom + "</div>" + replyHtml + "</div>";
                return html;
            }

            /**
             *
             * @param {object} replyItem
             * replyItem : {
             *  replyUser {string}
             *  replyUserId {string}
             *  repliedUserName {string}
             *  replyThumps {Number}
             *  replyTime  {string}
             *  tags {Array}
             *  reply {string}
             *  replyId {string}
             * }
             */

        }, {
            key: "_initReplyDom",
            value: function _initReplyDom(replyItem) {
                var replyHtml = void 0;
                //ID会出现数字导致无法通过document.querySelector访问,需要返回时解析
                replyItem.replyId = "lt" + replyItem.replyId;

                this.replyHead = "\n                <div class=\"comment-head\">\n                        <div class=\"comment-username\">" + replyItem.replyUser + "<span class=\"comment-reply-word\">\u56DE\u590D</span><span class=\"replyed\">" + replyItem.repliedUserName + "</span></div>\n                        <div class=\"comment-time-thumps\">\n                            <span class=\"comment-time\">" + replyItem.replyTime + "</span>                            \n                        </div>\n                    </div>\n            ";
                if (replyItem.tags.length !== 0) {
                    var tagsHtml = "";
                    this.replyTags = "<div class='comment-tags'>"; //'<div class="comment-tags"></div>';
                    replyItem.tags.map(function (item) {
                        var str = "<span class=\"comment__span--tag\">" + item + "</span>";
                        tagsHtml += str;
                    });
                    this.replyTags += tagsHtml + "</div>";
                } else {
                    this.replyTags = "";
                }

                //回复内容
                this.replyComment = "<div class=\"comment-comment\">" + replyItem.reply + "</div>";

                //判断是不是本人
                var cancel = "";
                if (replyItem.isUser === 1) {
                    cancel += "<a data-reply-id=\"" + replyItem.replyId + "\" class=\"icon-cancel2 comment__span--option\"></a>";
                }

                this.replyBottom = "\n                    <div class=\"comment-bottom\">\n                        <div class=\"comment__div--reply\">\n                        </div>\n                        <div class=\"comment__div--options\">\n                            " + cancel + "\n                            <a data-id=\"" + replyItem.replyUserId + "\" data-user=\"" + replyItem.replyUser + "\" class=\"icon-chat comment__span--option\"></a>\n                        </div>\n                    </div>\n            ";

                replyHtml = "<div class=\"comment-reply\" id=\"" + replyItem.replyId + "\">" + this.replyHead + this.replyTags + this.replyComment + this.replyBottom + "</div>";
                return replyHtml;
            }

            /**
             * 添加评论模块事件
             */

        }, {
            key: "addCommentEvent",
            value: function addCommentEvent() {
                var _this2 = this;

                var node = document.getElementById(this.commentId);

                node.addEventListener("click", function (eve) {
                    var target = eve.target;

                    //绑定1.显示回复 和 收起回复 2.评论删除事件
                    switch (target.classList[0]) {
                        case 'reply-toggle':
                            {
                                var replys = node.nextElementSibling;
                                var str = "#" + node.id + " a";
                                var change = document.querySelector(str);
                                if (_this2.replyShow === 0) {
                                    replys.style.display = "block";
                                    change.textContent = "\u6536\u8D77\u56DE\u590D(" + _this2.replyNum + ")";
                                    _this2.replyShow = 1;
                                } else {
                                    replys.style.display = "none";
                                    change.textContent = "\u663E\u793A\u56DE\u590D(" + _this2.replyNum + ")";
                                    _this2.replyShow = 0;
                                }
                                break;
                            }
                        case 'icon-cancel2':
                            {
                                _this2.deleteComment();
                                break;
                            }
                    }
                }, false);

                //绑定1.点赞，2.回复删除，3.添加回复事件
                this.wrapNode.addEventListener("click", function (eve) {
                    var node = document.getElementById(_this2.commentId);
                    var target = eve.target;

                    switch (target.classList[0]) {

                        case 'icon-cancel2':
                            {
                                //防止被异常触发
                                if (node !== null && !Utils.contains(node, target)) {
                                    var replyId = target.getAttribute("data-reply-id");
                                    _this2.deleteReply(replyId);
                                }
                                break;
                            }

                        //点击点赞
                        case 'icon-thumbs-o-up':
                            {}
                        case 'thump-num':
                            {
                                var thumpNode = target.parentNode;
                                var preNum = Number(thumpNode.textContent);
                                var thumpObj = void 0;
                                if (_this2.isThumped === 1) {
                                    thumpNode.style.color = "#000";
                                    thumpNode.children[1].textContent = "" + (preNum - 1);
                                    _this2.isThumped = 0;

                                    thumpObj = {
                                        commentId: _this2.realCommentId,
                                        state: -1
                                    };
                                } else {
                                    thumpNode.style.color = "#0f88eb";
                                    thumpNode.children[1].textContent = "" + (preNum + 1);
                                    _this2.isThumped = 1;

                                    thumpObj = {
                                        commentId: _this2.realCommentId,
                                        state: +1
                                    };
                                }
                                //ZXCJK
                                // Utils.sendMsg('commentLike', thumpObj);
                                console.log("thumped", thumpObj);
                                break;
                            }

                        case 'icon-chat':
                            {
                                var user = target.getAttribute("data-user");
                                var repliedId = target.getAttribute("data-id");
                                //*****
                                var addHtml = new Input({
                                    userId: _this2.userId,
                                    commentId: _this2.commentId,
                                    wrap: _this2.wrap,
                                    userName: _this2.userName,
                                    repliedUserName: user,
                                    repliedUserId: repliedId
                                }, 1);
                            }
                    }
                }, false);
            }

            // 删除评论节点

        }, {
            key: "deleteComment",
            value: function deleteComment() {

                //ZXCJK
                // Utils.sendMsg('commentRemove', {commentId: this.realCommentId});
                console.log("remove comment:", this.realCommentId);

                var str = "div[data-comment-id=\"" + this.realCommentId + "\"]";
                var removeNode = document.querySelector(str);
                console.log(this.wrapNode);
                this.wrapNode.removeChild(removeNode);
                Utils.destory(this);
            }

            // 删除回复节点

        }, {
            key: "deleteReply",
            value: function deleteReply(replyId) {
                //修改成真正的ID
                var realReplyId = replyId.slice(2);
                //ZXCJK
                //ZXCJK
                // Utils.sendMsg('replyRemove', {replyId: realReplyId});
                console.log("remove reply:", realReplyId);

                var str = "#" + replyId;
                var removeNode = document.querySelector(str);
                var replys = this.wrapNode.children[0].lastChild;
                replys.removeChild(removeNode);
                this.changeCommentShow(-1);
            }

            /**
             * 添加或删除回复后 标签内的按钮样子的变化
             */

        }, {
            key: "changeCommentShow",
            value: function changeCommentShow(changeNum) {
                var str = "#" + this.commentId + " .reply-toggle";
                var preNode = document.querySelector(str),
                    nowNum = Number(preNode.textContent.match(/\d+/g));
                var lastNum = nowNum + changeNum;
                if (nowNum + changeNum <= 0) {
                    preNode.textContent = "";
                } else {
                    this.replyNum = lastNum;
                    preNode.textContent = "\u6536\u8D77\u56DE\u590D(" + lastNum + ")";
                }
            }
        }]);

        return Comment;
    }();

    //实例化模版对象
    let letstalkmodel = new LetsTalkModel();
    var Utils = {
        //比较ele1 与ele2 的位置
        contains: function contains(ele1, ele2) {
            return ele1.contains ? ele1 != ele2 && ele1.contains(ele2) : !!(ele1.compareDocumentPosition(ele2) & 16);
        },


        //清楚对象属性
        destory: function destory(obj) {
            for (var i in obj) {
                obj[i] = null;
            }
        },
        sendMsg: function sendMsg(type, dataObj) {
            var promise = letstalkmodel.fireMessageEvent(type, dataObj);
            promise.then(function (data) {
                console.log(data + "/comment.js");
            }, function (error) {
                console.log(error);
            });
        }
    };

    window.zzp = 1;
    window.Comment = Comment;
    window.Input = Input;
})(window);

// let a = new Comment({
//     wrap : "ltCommits1",
//     userId : "1",
//     userName: "zzp",
//     commentId: "c11",
//     commentUser: "lwl",
//     commentUserId: "19",
//     commentThumps: 12,
//     noteTime: "11:20",
//     text: "数据层交互 使用发布-订阅模式",
//     comment: "数据真烂",
//     isThumped: 1,
//     isUser: 1,
//     reply: [{
//         replyId: "c22",
//         replyUser: "lzy",
//         replyUserId: "12",
//         replyUserId: "12",
//         replyTime: "10:00",
//         tags: ["sdaf"],
//         reply: "何鲁丽asdfdsafasd",
//         repliedUserName: 'lwl',
//         isUser: 1,
//     },{
//         replyId: "c3",
//         replyUser: "zxc",
//         replyUserId: "13",
//         replyTime: "10:00",
//         tags: ["sdaf"],
//         reply: "何鲁丽",
//         repliedUserName: 'lwl',
//         isUser: 1,
//     }],
// });

// let b = new Input(0, {
//     xpath: "http://www.baidu.com",
//     userId: "23",
//     userName: "realZZP",
//     text: "我真是日了狗了",
//     wrap : "ltCommits2"
// });