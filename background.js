// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * 
 * Util randName
 * @class BackgroundModel
 */

let Utils = {
    randomUser (user) {
        var rand = Math.round(Math.random() * 10);
        return [{
            userId: '1',
            name: '月影'
        }, {
            userId: '2',
            name: '屈屈'
        }, {
            userId: '3',
            name: '瓜瓜'
        }, {
            userId: '4',
            name: '波波'
        }, {
            userId: '5',
            name: '博博'
        }, {
            userId: '6',
            name: '松峰老师'
        }, {
            userId: '7',
            name: 'LC',
        }, {
            userId: '8',
            name: '老纪'
        }, {
            userId: '9',
            name: '二哥'
        }, {
            userId: '10',
            name: '之杰'
        }, {
            userId: '11',
            name: '娇娇'
        }][rand];
    }
}


/**
 * backgound model
 */
class BackgroundModel {
    init() {
        let that = this;
        this.host = 'http://192.168.0.103:3000/api/';
        this.promiseId = 0;
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            that.promiseId = 0;
            let response = null;
            // console.log('下一步触发' + request.behavior + "行为");
            if (request.behavior === null) {
                sendResponse({
                    status: '400',
                    message: '未指定行为'
                });
                return;
            }
            switch (request.behavior) {
                case 'commentLike':
                    response = bdModel.commentLike(request.data, sender);
                    break;
                case 'selectMessage':
                    response = bdModel.selectMessage(request, sender, sendResponse);
                    break;
                case 'renderMessage':
                    console.log("aa");
                    response = bdModel.renderMessage(request, sender, sendResponse);
                    break;
                case 'commentAdd':
                    response = bdModel.commentAdd(request, sender, sendResponse);
                    break;
                case 'getPromiseId': //待使用
                    response = that.promiseId++;
                    sendResponse(response);
                    break;
                case '':
                    break;
                case '':
                    break;
                case '':
                    break;
                default:
                    response = {
                        status: '400',
                        message: '行为不存在'
                    }
            }
            sendResponse(response);
        })
    }
    /**
     * 
     * @param {String} method 
     * @param {String} url 
     * @param {Object} data 
     */
    ajax(method, url, data) {
        let promise = new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            setTimeout(function () {
                reject({
                    'status': 404
                });
            }, 5000)
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.status);
                    }
                }
            }
            if (method == "get") {
                let str = '';
                for (var key in data) {
                    if (!str) {
                        str = str + "?" + key + "=" + data[key];
                    } else {
                        str = str + "&" + key + "=" + data[key];
                    }
                }
                xhr.open(method, url + str, true);
                xhr.send(null);
            } else if (method == "post") {
                let str = '';
                for (var key in data) {
                    if (!str) {
                        str = str + key + "=" + data[key];
                    } else {
                        str = str + "&" + key + "=" + data[key];
                    }
                }
                xhr.open(method, url, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            }
        })

        return promise;
    }
    /**
     * 点赞/取赞
     * @param {Object} data 
     * @param {Sender} sender 
     */
    commentLike(request, sender, sendResponse) {
        let url = this.host + "commentlike";
        let data = request.data;
        data['pageUrl'] = sender.tab.url;
        let promise = this.ajax('post', url, data);
        sendResponse(data.status = 204)
        promise.then(function (data) {
            let returnData;
            if (data.errno == 0) {
                returnData = data;
            } else {
                returnData = data;
            }
            chrome.tabs.sendMessage(sender.tab.id, {
                'data': returnData,
                'promiseId': request.promiseId
            })
            console.log('返回成功')
        }, function () {
            console.log('响应超时')
        })
    }
    /**
     * 获取数据
     * @param {Object} request 
     * @param {Sender} sender 
     */
    renderMessage(request, sender, sendResponse) {
        let url = this.host + "url";
        let data = {
            'url': sender.tab.url
        };
        let promise = this.ajax('get', url, data);
        sendResponse(data.status = 204);
        promise.then(function (data) {
            let returnData;
            if (data.errno === 0) {
                returnData = true;
            } else {
                returnData = false;
            }
            chrome.tabs.sendMessage(sender.tab.id, {
                'data': data,
                'promiseId': request.promiseId
            })
            console.log('返回成功')
        }, function () {
            console.log('响应超时')
        })
    }
    /**
     * 选择数据传递
     * @param {Object} request 
     * @param {Sender} sender 
     */
    selectMessage(request, sender, sendResponse) {
        chrome.tabs.sendMessage(sender.tab.id, {
            'type': 'selectedMessage',
            'data': request.data
        });
        sendResponse('success');
    }

    sendComment() {
        let callback = function () {};
        let data = {
            'message': 'dsa'
        }
        chrome.tabs.sendMessage(875, data, function () {})
        console.log('发送')
    }
    /**
     * 接收消息
     * @param {Object} request 
     * @param {Render} sender 
     */
    commentAdd(request, sender, sendResponse) {
        let url = this.host + "savecomment";
        let data = request.data;
        data['pageUrl'] = sender.tab.url;
        let promise = this.ajax('post', url, data);
        sendResponse(data.status = 204)
        promise.then(function (data) {
            let returnData;
            if (data.errno == 0) {
                returnData = data;
            } else {
                returnData = data;
            }
            chrome.tabs.sendMessage(sender.tab.id, {
                'data': returnData,
                'promiseId': request.promiseId
            })
            console.log('返回成功')
        }, function () {
            console.log('响应超时')
        })
    }
}
var bdModel = new BackgroundModel();
bdModel.init();
/**
 * 按钮点击事件
 */
let clickTime = 0;



// Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.executeScript(null, {file: "javascripts/letTalkStyle.js"});
//   chrome.tabs.insertCSS(null, {file: "styles/letTalkCommon.css"});
// });
chrome.browserAction.onClicked.addListener(function (tab) {
    if (clickTime == 0) {
        chrome.tabs.executeScript(null, {
            file: "./src/common/javascripts/letTalkStyle.js"
        });
        chrome.tabs.insertCSS(null, {
            file: "./src/common/styles/letTalkCommon.css"
        });
    }
});

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.tabs.executeScript(null, {
//         file: "./src/common/javascripts/letTalkStyle.js"
//     });
//     chrome.tabs.insertCSS(null, {
//         file: "./src/common/styles/letTalkCommon.css"
//     });
// });