class LetsTalkModel {
    constructor() {
        try{
            if(window.webExtenceModelInstance) {
                return window.webExtenceModelInstance;
            }
        }catch(e) {}
        window.webExtenceModelInstance = this;            
        this.eventHanders = {};            
        this.init();     
    }

    init() {
        let that = this;
        this.promiseNum = 0;
        this.promiseStack = [];
        this.get();
        //监听 评论点赞事件
        this.addMessageEvent('commentLike', function(event) {
            let response = that.send({
                'behavior': event.type,
                'data': event.data
            }, function(response) {
            });
        })
        //监听 评论增加事件
        this.addMessageEvent('commentAdd', function(event) {
            let response = that.send({
                'behavior': event.type,
                'data': event.data,
                'promiseId':event.promiseId
            }, function(response) {
                // console.log(response); //状态码
            })
        })

        // 监听 请求评论事件
        this.addMessageEvent('renderMessage', function(event) {
            let response = that.send({
                'behavior': event.type,
                'data': null,
                'promiseId':event.promiseId
            }, function(response) {

            })
        })

        //监听 文本选择事件
        this.addMessageEvent('selectMessage', function(event) {
            let response = that.send({
                'behavior': event.type,
                'data': event.data,
                'promiseId': event.promiseId
            }, function(response) {

            })
        })
    }

    send(dataObj, callback) {
        chrome.runtime.sendMessage(null, dataObj, null, callback);
    }

    // get(promiseId, resolve, reject) {
    //     let that = this;
    //     chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    //         if(request.promiseId != undefined) {
    //             console.log("前台得到的promiseId:"+request.promiseId);                
    //             for(let i = 0; i < that.promiseStack.length; i++) {
    //                 if(request.promiseId == promiseId) {
    //                     resolve(request.data);
    //                 }
    //             }
    //         } else if(request.type != undefined){
    //             that.fireMessageEvent(request.type, request.data)
    //         }
    //     })
    // }
    get() {
        let that = this;
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
            console.log(request);
            if(request.type != undefined){
                that.fireMessageEvent(request.type, request.data);
            }
            if(request.promiseId != undefined) {
                console.log("前台得到的promiseId:" + request.promiseId);                
                for(let i = 0; i < that.promiseStack.length; i++) {                
                    if(request.promiseId == that.promiseStack[i].promiseId) {
                        that.promiseStack[i].resolve(request.data);
                    }
                }
            }
        })
    }


    addMessageEvent(type, hander) {
        this.eventHanders[type] = hander;
    }
    getPromiseId() {
        var that = {}
        chrome.runtime.sendMessage(null, {'behavior': 'getPromiseId'}, null, function(id) {
            that.promiseId = id;
            console.log("getId" + id);
        });
        console.log(that.promiseId);
        return that.promiseId;
    }
    /**
     * 
     * @param {String} type 
     * @param {Object} data 
     */
    fireMessageEvent(type, data) {
        let that = this;
        if(this.eventHanders[type]) {
            let eventFun = this.eventHanders[type];
            // let promiseId = this.getPromiseId();
            let promiseId = that.promiseNum;
            let resolveE;
            let rejectE;
            let promise =  new Promise(function(resolve, reject) {
                eventFun({
                    'resolve': resolve,
                    'reject': reject,
                    'type': type,
                    'data': data,
                    'promiseId': promiseId
                });
                // that.get(promiseId, resolve, reject)
                resolveE = resolve;
                rejectE = reject;
                that.promiseNum++;
                // setTimeout(function() {
                //     reject("超时");
                // }, 1000)
            })
            console.log(promiseId);
            this.promiseStack.push({"promise":promise, "promiseId":promiseId, "resolve":resolveE, "reject":rejectE});
            return promise;
        } else {
            console.log('throw a message');
        }
    }
}

// let letstalkmodel = new LetsTalkModel();
// let promise = letstalkmodel.fireMessageEvent('commentLike', {'commentId':31241, 'state': 1});
// promise.then(function(data) {
//     console.log(data);
// }, function(error) {
//     console.log(error);
// })