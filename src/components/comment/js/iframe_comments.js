;
(function(window){
    "use strict";

    //最外层容器
    let contentNode = document.getElementById("commentWrap");

    let letstalkmodel = new LetsTalkModel();
    letstalkmodel.addMessageEvent('selectedMessage', function(event) {
        console.log("has a new Input");
        let hasNode = document.getElementById("ltCommentInput");
        if(hasNode) {
            hasNode.parentNode.removeChild(hasNode);
        } else {
            let inputNode = document.createElement("div");
            inputNode.id = "ltCommentInput";
            contentNode.appendChild(inputNode);
            let b = new Input({
                wrap : "ltCommentInput",
                xpath: event.data.xpath,
                userId: event.data.userId,
                userName: event.data.name,
                text: event.data.text
            });
        }
    });

        // let commentData = getData();
    let commentData = [{
        userId : "1",
        userName: "zzp",
        commentId: "11",
        commentUser: "lwl",
        commentUserId: "19",
        commentThumps: 12,
        noteTime: "11:20",
        text: "数据层交互 使用发布-订阅模式",
        comment: "数据真烂",
        isThumped: 1,
        isUser: 1,
        xpath: "sdfsdfds",
        reply: [{
            replyId: "c22",
            replyUser: "lzy",
            replyUserId: "12",
            replyTime: "10:00",
            tags: ["sdaf"],
            reply: "何鲁丽asdfdsafasd",
            repliedUserName: 'lwl',
            isUser: 1,
        },{
            replyId: "c3",
            replyUser: "zxc",
            replyUserId: "13",
            replyTime: "10:00",
            tags: ["sdaf"],
            reply: "何鲁丽",
            repliedUserName: 'lwl',
            isUser: 1,
        }],
    } , {
        userId : "1",
        userName: "zzp",
        commentId: "12",
        commentUser: "lwle",
        commentUserId: "20",
        commentThumps: 12,
        noteTime: "11:20",
        text: "数据层交互 使用发布-订阅模式1111",
        comment: "数据真烂1111",
        isThumped: 0,
        isUser: 1,
        reply: [],
        xpath: "adfsad"
    }];




    let dataLen = commentData.length;
    let numNode = document.getElementById("commentNum");

    for(let i = 0 ; i < dataLen ; i++) {
        let newNode = document.createElement("div");
        newNode.id = "ltCommentItem"+i;
        contentNode.appendChild(newNode);

        commentData[i].wrap = "ltCommentItem"+i;
        let newComment = new Comment(commentData[i]);

        newNode.addEventListener("click", function(eve) {
            let focusObj = {
                text: commentData[i].text,
                xpath: commentData[i].xpath
            };

            console.log(focusObj);
            // let promise = letstalkmodel.fireMessageEvent(type, dataObj);
            // promise.then(function(data) {
            //     console.log(data);
            // }, function(error) {
            //     console.log(error);
            // });
        }, false);
    }


})(window);