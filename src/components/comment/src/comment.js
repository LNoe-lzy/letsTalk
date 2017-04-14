;
(function(win) {
    "use strict";

    let instanceComment;
    let instanceReply;
    /**
     * 输入框组件
     *  1:回复输入框 0:评论输入框
     */
    class Input {
        constructor(config, state = 0) {
            let _default;
            this.state = state;

            if(this.state === 1) {
                if(instanceReply) {
                    return instanceReply;
                }
                instanceReply = this;
                //默认数据
                _default = {
                    repliedUserName: "被回复",
                    repliedUserId: "被回复ID",
                    userName: "匿名用户",
                };
            } else {
                if(instanceComment) {
                    return instanceComment;
                }
                instanceComment = this;

                _default = {
                    xpath: "",
                    userName: "匿名用户",
                    text: "原文内容",
                };
            }
            Object.assign(this, _default, config);
            this.initDoms();
        }


        initDoms() {
            let html;
            if(this.state === 1) {
                html = this._initAddDom(this.repliedUserName);
            } else {
                html = this._initAddDom();
            }
            this.wrapNode = document.getElementById(this.wrap);
            this.wrapNode.insertAdjacentHTML('beforeend',html);
            this.addInputEvent();
        }

        /**
         * 添加评论  模块
         * @private
         */
        _initAddDom(user) {
            let addHtml, userName, headText;
            if(user) {
                this.addText = "";
                headText = `<div class="comment-username">${this.userName}<span class="comment-reply-word">回复</span><span class="replyed">${user}</span></div>`;
            } else {
                this.addText = `<div class="comment-text">${this.text}</div>`;
                headText = `<div class="comment-username">${this.userName}</div>`;
            }

            this.addHead = `
                    <div class="comment-head">
                        ${headText}
                        <div class="comment-time">now</div>
                    </div>
            `;

            this.addInput = `
                    <div id="content-input" class="comment-input">
                        <input name="tags" class="comment__input--tags" placeholder="添加标签……"/>
                        <textarea name="comment" class="comment__textarea--text"></textarea>
                        <div class="comment__div--control">
                            <div class="comment-inputbtn">公开发布</div>
                            <div class="comment-tips">*请先填写评论内容</div>
                            <div class="comment-inputcancel"><span class="icon-cancel"></span>取消</div>
                        </div>
                        <p class="comment-rule">规范网络言论，加强监督管理</p>
                    </div>
             `;

            addHtml = '<div class="comment-wrap"><div class="comment-form">' + this.addHead + this.addText + this.addInput + '</div></div>'
            return addHtml;
        }

        /**
         * 添加输入模块事件
         */
        addInputEvent() {
            let str = `#${this.wrap} .comment-form`;
            this.inputNode = document.querySelector(str);

            //绑定1.点击扩展输入框 2.点击提交框 3.取消输入框事件
            this.inputNode.addEventListener("click",(eve) => {
                let target = eve.target;
                switch (target.classList[0]) {
                    //扩展文本框
                    case 'comment__textarea--text' : {
                        target.style.height = "120px";
                        target.style.maxHeight = "120px";
                        break;
                    }

                    case 'comment-inputbtn' : {
                        let comment = `#${this.wrap} .comment__textarea--text`,
                            tag = `#${this.wrap} .comment__input--tags`;
                        let commentNode = document.querySelector(comment),
                            tagNode = document.querySelector(tag);
                        let tips = target.nextElementSibling;
                        if(commentNode.value === '') {
                            tips.style.display = "block";
                        } else {
                            tips.style.display = "none";

                            if(this.state === 0) {
                                let commentObj = {
                                    xpath: this.xpath,
                                    userId: this.userId,
                                    text: this.text,
                                    comment: commentNode.value,
                                    noteTime: Date.now(),
                                    commentTags: tagNode.value
                                };

                                //ZXCJK
                                // Utils.sendMsg('commentAdd', commentObj);
                                console.log("zxc",commentObj);
                            } else {
                                //修改成真正的ID
                                let realCommentId = this.commentId.slice(2);

                                let replyObj = {
                                    commentId: realCommentId,
                                    reply: commentNode.value,
                                    replyTags: tagNode.value,
                                    userId: this.userId,
                                    repliedUserId: this.repliedUserId,
                                    noteTime: String(Date.now()),
                                };

                                //ZXCJK
                                // Utils.sendMsg('replyAdd', replyObj);
                                console.log("zxc",replyObj);
                            }
                        }
                        break;
                    }

                    case 'comment-inputcancel' : {
                        this.deleteInput();
                        break;
                    }
                }
            },false);
        }

        //删除输入节点
        deleteInput() {
            this.wrapNode.removeChild(this.inputNode.parentNode);
            Utils.destory(this);
            if(this.state === 1) {
                instanceComment = null;
            } else {
                instanceReply= null;
            }
        }


    }


    class Comment {
        /**
         * 初始化评论数据
         * @param {num} state 当前组件状态: 0 - 发评论； 1 - 展示评论
         * @param {object} config 初始化评论的内容 {wrap: id}
         */
        constructor(config) {
            let _default;
            //默认数据
            _default = {
                commentUser: "匿名用户",         //用户名
                text: "原文内容",                //引用内容
                comment: "我困了",               //评论内容
                noteTime: "12:00",              //创建时间
                commentThumps: 0,               //点赞数
                tags: ["标签"],                  //标签
                reply: [],                      //回复评论
                isUser: 0,                      //判断是不是用户本人
                isThumped : 0,                  //
                // imgs: [],                    //评论截图
            };
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
        initDoms() {
            let html;
            this.wrapNode = document.getElementById(this.wrap);
            html = this._initCommentDom();
            this.wrapNode.insertAdjacentHTML('beforeend',html);
            //判断是否点过赞了
            if(this.isThumped === 1) {
                let str = `#${this.commentId} .comment-thumps`;
                let node = document.querySelector(str);
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
        _initCommentDom() {
            let html;
            //判断是否生成标签部分;
            if(this.tags.length !== 0) {
                let html = "";
                this.commentTags = `<div class='comment-tags'>`; //'<div class="comment-tags"></div>';
                this.tags.map((item) => {
                    let str = `<span class="comment__span--tag">${item}</span>`;
                    html += str;
                });
                this.commentTags += html + `</div>`;
            } else {
                this.commentTags = "";
            }

            //判断是否生成引用部分
            if(this.text !== "") {
                this.commentText = `<div class="comment-text">${this.text}</div> `;
            } else {
                this.commentText = "";
            }

            //评论头部 
            this.commentHead = `
                <div class="comment-head">
                    <div class="comment-username">
                        ${this.commentUser}
                    </div>
                    <div class="comment-time-thumps">
                        <span class="comment-thumps">
                            <span class="icon-thumbs-o-up"></span>
                            <span class="thump-num">${this.commentThumps}</span>
                        </span>
                        <span class="comment-time">${this.noteTime}</span>                            
                    </div>
                </div>
            `;

            //评论内容
            this.commentComment = `<div class="comment-comment">${this.comment}</div>`;
            //评论底部

            //隐藏回复部分
            this.replyNum = this.reply.length;
            let replyMsg;                  //回复数量标记div
            let replyHtml;              //整个回复模块
            if(this.replyNum !== 0) {
                replyMsg = `<div class="comment__div--reply">
                            <a class="reply-toggle">显示回复(${this.replyNum})</a>
                        </div>`;
                this.replyShow = 0;

                replyHtml = "";
                for(let i = 0 ; i < this.replyNum ; i++) {
                    replyHtml += this._initReplyDom(this.reply[i]);
                }
                replyHtml = `<div class="comment-all-replys">${replyHtml}</div>`;

            } else {
                replyMsg = `<div class="comment__div--reply">
                        </div>`
                replyHtml = ``;
            }

            let cancel = "";
            if(this.isUser) {
                cancel += `<a data-reply-id="${this.commentId}" class="icon-cancel2 comment__span--option"></a>`;
            }
            this.commentBottom = `
                <div class="comment-bottom">
                    ${replyMsg}
                    <div class="comment__div--options">
                        ${cancel}
                        <a data-user="${this.commentUser}" data-id="${this.commentUserId}" class="icon-chat comment__span--option"></a>
                    </div>
                </div>
            `;

            html = `<div class="comment-wrap" data-comment-id="${this.commentId}"><div class="comment-item" id="${this.commentId}">` + this.commentHead + this.commentTags + this.commentText + this.commentComment + this.commentBottom + `</div>` + replyHtml + `</div>`;
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
        _initReplyDom(replyItem) {
            let replyHtml;
            //ID会出现数字导致无法通过document.querySelector访问,需要返回时解析
            replyItem.replyId = "lt" + replyItem.replyId;

            this.replyHead = `
                <div class="comment-head">
                        <div class="comment-username">${replyItem.replyUser}<span class="comment-reply-word">回复</span><span class="replyed">${replyItem.repliedUserName}</span></div>
                        <div class="comment-time-thumps">
                            <span class="comment-time">${replyItem.replyTime}</span>                            
                        </div>
                    </div>
            `;
            if(replyItem.tags.length !== 0) {
                let tagsHtml = "";
                this.replyTags =  `<div class='comment-tags'>`; //'<div class="comment-tags"></div>';
                replyItem.tags.map((item) => {
                    let str = `<span class="comment__span--tag">${item}</span>`;
                    tagsHtml += str;
                });
                this.replyTags += tagsHtml + "</div>";
            } else {
                this.replyTags = "";
            }

            //回复内容
            this.replyComment = `<div class="comment-comment">${replyItem.reply}</div>`;

            //判断是不是本人
            let cancel = "";
            if(replyItem.isUser === 1) {
                cancel += `<a data-reply-id="${replyItem.replyId}" class="icon-cancel2 comment__span--option"></a>`;
            }

            this.replyBottom = `
                    <div class="comment-bottom">
                        <div class="comment__div--reply">
                        </div>
                        <div class="comment__div--options">
                            ${cancel}
                            <a data-id="${replyItem.replyUserId}" data-user="${replyItem.replyUser}" class="icon-chat comment__span--option"></a>
                        </div>
                    </div>
            `;

            replyHtml = `<div class="comment-reply" id="${replyItem.replyId}">` + this.replyHead + this.replyTags + this.replyComment + this.replyBottom + `</div>`;
            return replyHtml;
        }

        /**
         * 添加评论模块事件
         */
        addCommentEvent() {
            let node = document.getElementById(this.commentId);

            node.addEventListener("click",(eve) => {
                let target = eve.target;

                //绑定1.显示回复 和 收起回复 2.评论删除事件
                switch (target.classList[0]) {
                    case 'reply-toggle': {
                        let replys = node.nextElementSibling;
                        let str = `#${node.id} a`;
                        let change = document.querySelector(str);
                        if(this.replyShow === 0) {
                            replys.style.display = "block";
                            change.textContent = `收起回复(${this.replyNum})`;
                            this.replyShow = 1;
                        } else {
                            replys.style.display = "none";
                            change.textContent = `显示回复(${this.replyNum})`;
                            this.replyShow = 0;
                        }
                        break;
                    }
                    case 'icon-cancel2' : {
                        this.deleteComment();
                        break;
                    }
                }
            },false);

            //绑定1.点赞，2.回复删除，3.添加回复事件
            this.wrapNode.addEventListener("click",(eve) => {
                let node = document.getElementById(this.commentId);
                let target = eve.target;

                switch (target.classList[0]) {

                    case 'icon-cancel2' : {
                        //防止被异常触发
                        if(node !== null && !Utils.contains(node, target)) {
                            let replyId = target.getAttribute("data-reply-id");
                            this.deleteReply(replyId);
                        }
                        break;
                    }

                    //点击点赞
                    case 'icon-thumbs-o-up' : {}
                    case 'thump-num' : {
                        let thumpNode = target.parentNode;
                        let preNum = Number(thumpNode.textContent);
                        let thumpObj;
                        if(this.isThumped === 1) {
                            thumpNode.style.color = "#000";
                            thumpNode.children[1].textContent = `${preNum-1}`;
                            this.isThumped = 0;

                            thumpObj = {
                                commentId: this.realCommentId,
                                state: -1,
                            };
                        } else {
                            thumpNode.style.color = "#0f88eb";
                            thumpNode.children[1].textContent = `${preNum+1}`;
                            this.isThumped = 1;

                            thumpObj = {
                                commentId: this.realCommentId,
                                state: +1,
                            };

                        }
                        //ZXCJK
                        // Utils.sendMsg('commentLike', thumpObj);
                        console.log("thumped", thumpObj);
                        break;
                    }

                    case 'icon-chat' : {
                        let user = target.getAttribute("data-user");
                        let repliedId = target.getAttribute("data-id");
                        //*****
                        let addHtml = new Input({
                            userId: this.userId,
                            commentId: this.commentId,
                            wrap: this.wrap,
                            userName: this.userName,
                            repliedUserName: user,
                            repliedUserId: repliedId,
                        }, 1);
                    }
                }
            },false);
        }


        // 删除评论节点
        deleteComment() {

            //ZXCJK
            // Utils.sendMsg('commentRemove', {commentId: this.realCommentId});
            console.log("remove comment:", this.realCommentId);

            let str = `div[data-comment-id="${this.realCommentId}"]`;
            let removeNode = document.querySelector(str);
            console.log(this.wrapNode);
            this.wrapNode.removeChild(removeNode);
            Utils.destory(this);

        }

        // 删除回复节点
        deleteReply(replyId) {
            //修改成真正的ID
            let realReplyId = replyId.slice(2);
            //ZXCJK
            //ZXCJK
            // Utils.sendMsg('replyRemove', {replyId: realReplyId});
            console.log("remove reply:",realReplyId);

            let str = `#${replyId}`;
            let removeNode = document.querySelector(str);
            let replys = this.wrapNode.children[0].lastChild;
            replys.removeChild(removeNode);
            this.changeCommentShow(-1);
        }

        /**
         * 添加或删除回复后 标签内的按钮样子的变化
         */
        changeCommentShow(changeNum) {
            let str = `#${this.commentId} .reply-toggle`;
            let preNode = document.querySelector(str),
                nowNum = Number(preNode.textContent.match(/\d+/g));
            let lastNum = nowNum + changeNum;
            if(nowNum + changeNum <= 0) {
                preNode.textContent = "";
            } else {
                this.replyNum = lastNum;
                preNode.textContent = `收起回复(${lastNum})`;
            }
        }

    }

    // let letstalkmodel = new LetsTalkModel();
    let Utils = {
        //比较ele1 与ele2 的位置
        contains(ele1, ele2){
            return ele1.contains ? ele1 != ele2 && ele1.contains(ele2) : !!(ele1.compareDocumentPosition(ele2) & 16);
        },

        //清楚对象属性
        destory(obj) {
            for(let i in obj) {
                obj[i] = null;
            }
        },

        sendMsg(type, dataObj) {
            let promise = letstalkmodel.fireMessageEvent(type, dataObj);
            promise.then(function(data) {
                console.log(data);
            }, function(error) {
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