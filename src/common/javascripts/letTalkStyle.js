;
(function (window) {
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
                if(request.promiseId != undefined) {
                    console.log("前台得到的promiseId:" + request.promiseId);                
                    for(let i = 0; i < that.promiseStack.length; i++) {                
                        if(request.promiseId == that.promiseStack[i].promiseId) {
                            that.promiseStack[i].resolve(request.data);
                        }
                    }
                } else if(request.type != undefined){
                    that.fireMessageEvent(request.type, request.data)
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

    var config = {
        path: 'chrome-extension://hjpglmkngghmmompkelkeboknjnlllac/src/components/slide.html'
    }

    // 工具类
    function Util() {

    }
    Util.prototype = {
        constructor: Util,
        // 单例模式方法
        single: function (fn) {
            var result;
            return function () {
                return result || (result = fn.apply(this, arguments));
            }
        },
        // 生成xpath字符串
        readXPath: function (element) {
            if (element.id !== "") { //判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
                return '//*[@id=\"' + element.id + '\"]';
            }

            if (element.getAttribute("class") !== null) { //判断class属性，如果这个元素有class，则显 示//*[@class="xPath"]  形式内容
                return '//*[@class=\"' + element.getAttribute("class") + '\"]';
            }
            //因为Xpath属性不止id和class，所以还可以更具class形式添加属性
            //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）

            if (element == document.body) { //递归到body处，结束递归
                return '/html/' + element.tagName;
            }

            var ix = 0, //在nodelist中的位置，且每次点击初始化
                siblings = element.parentNode.childNodes; //同级的子元素

            for (var i = 0, l = siblings.length; i < l; i++) {
                var sibling = siblings[i];
                if (sibling === element) { //如果这个元素是siblings数组中的元素，则执行递归操作
                    return arguments.callee(element.parentNode) + '/' + element.tagName + ((ix + 1) === 1 ? '' : '[' + (ix + 1) + ']'); //ix+1是因为xpath是从1开始计数的，element.tagName+((ix+1)==1?'':'['+(ix+1)+']')三元运算符，如果是第一个则不显示，从2开始显示
                } else if (sibling.nodeType === 1 && sibling.tagName === element.tagName) { //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
                    ix++;
                }
            }
        }
    }


    // 扩展外部应用监听器对象
    function LetTalkEventWatcher() {
        this.handlers = {};
    };
    LetTalkEventWatcher.prototype = {
        // 构造器指向创建的对象
        constructor: LetTalkEventWatcher,
        // 注册事件处理函数
        on: function (e, handler) {
            if (this.handlers[e]) {
                this.handlers[e].push(handler);
            } else {
                this.handlers[e] = [handler];
            }
        },
        // 删除事件处理函数
        off: function (e) {
            for (var key in this.handlers) {
                if (this.handlers.hasOwnProperty(key) && key === e) {
                    delete this.handlers[key];
                }
            }
        },
        // 执行事件处理函数
        emit: function (e) {
            if (!this.handlers[e]) {
                return;
            }
            handlers = this.handlers[e];
            var arg = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].apply(this, arg);
            }
        }
    };

    // 创建事件总线
    var eventHub = new LetTalkEventWatcher();
    // 创建工具类实例
    var utils = new Util();


    var letstalkmdoel = new LetsTalkModel();


    // 浮动栏
    function ToolTip() {
        this.node = null;
        this.init();
    }
    ToolTip.prototype = {
        constructor: ToolTip,
        init: function () {
            this.create();
        },
        //  初始化组件dom
        create: function () {
            var tootipNode = document.createElement('div');
            document.body.appendChild(tootipNode);
            tootipNode.id = 'letTalkTootip';
            var cbtn = this.addCommitBtn();
            var hbtn = this.addHighlightBtn();
            tootipNode.appendChild(cbtn);
            tootipNode.appendChild(hbtn);
            this.node = tootipNode;

            cbtn.addEventListener('click', function () {
                eventHub.emit('showClick');
            }, false);
            hbtn.addEventListener('click', function () {
                eventHub.emit('highlightClick');
            }, false);
        },
        // 改变组件位置
        changePos: function (position) {
            this.node.style['display'] = 'block';
            this.node.style['top'] = position.top + 'px';
            this.node.style['left'] = position.left + 'px';
        },
        // 隐藏组件
        hide: function () {
            this.node.style['display'] = 'none';
        },
        addCommitBtn: function () {
            var commitBtn = document.createElement('button');
            commitBtn.innerHTML = '评论';
            return commitBtn;
        },
        addHighlightBtn: function () {
            var highlightBtn = document.createElement('button');
            highlightBtn.innerHTML = '高亮';
            return highlightBtn;
        }
    }

    var tooltip = new ToolTip();

    function LetTalk() {
        // 显示隐藏状态
        this.showFlag = true;
        // 缓存
        this.highlighs = [];
        this.tags = [];

        // 初始化组件
        this.init();
    }

    LetTalk.prototype = {
        constructor: LetTalk,
        init: function () {
            this.create();
            this.watchScoll();
        },
        // 初始化slierbar
        create: function () {
            var slidebar = document.createElement('div');
            document.body.appendChild(slidebar);
            slidebar.id = "letTalkSlideBar";
            var iframeNode = document.createElement('iframe');
            document.body.appendChild(iframeNode);
            iframeNode.src = config.path;
            iframeNode.id = "letTalkIframe";
            iframeNode.name = 'letTalk';
            slidebar.innerHTML = `<div id="letTalkShowBtn">显示</div>
            <span id="topTag" style="top: 50px">1</span>
            <span id="bottomTag" style="top: ${document.body.clientHeight - 25}px">1</span>`;

            this.toggle(slidebar, iframeNode);
            this.select(slidebar);
        },
        // slidebar 状态转换
        toggle: function () {
            var that = this;
            var showBtn = document.getElementById('letTalkShowBtn');
            var slidebar = document.getElementById('letTalkSlideBar');
            var iframeNode = document.getElementById('letTalkIframe');
            showBtn.addEventListener('click', function () {
                if (that.showFlag) {
                    slidebar.style['right'] = '420px';
                    iframeNode.style['right'] = '-20px';
                    that.showFlag = false;
                    this.innerHTML = '隐藏';
                } else {
                    slidebar.style['right'] = 0;
                    iframeNode.style['right'] = '-440px';
                    that.showFlag = true;
                    this.innerHTML = '显示';
                }
            }, false);
        },
        // 选择文本
        select: function (slidebar) {
            var that = this;
            document.body.addEventListener('mouseup', function (e) {
                var txt = window.getSelection();
                if (txt.toString().length === 0) {
                    return;
                }
                var spanWrap = document.createElement('span');
                var range = txt.getRangeAt(0);
                var rect = range.getBoundingClientRect();
                range.surroundContents(spanWrap);

                // 获取元素的xPath
                var selectXPath = utils.readXPath(spanWrap);
                var s = selectXPath.slice(0, selectXPath.length - 5);
                var selectInfo = range.toString();
                var selectMessage = {
                    xpath: s,
                    text: selectInfo
                };
                // console.log(document.evaluate(path, document).iterateNext());

                that.highlighs.push(spanWrap);

                tooltip.changePos({
                    top: e.pageY,
                    left: e.pageX
                });

                // 监听器
                eventHub.on('showClick', function () {
                    that.showFlag = true;
                    document.getElementById('letTalkShowBtn').click();
                    tooltip.hide();

                    // 发送数据
                    var selectPromise = letstalkmdoel.fireMessageEvent('selectMessage', selectMessage);
                    selectPromise.then(function (errno) {
                        var tag = that.createTag({
                            top: rect.top
                        });

                        slidebar.appendChild(tag);
                        that.tags.push(tag);
                        spanWrap.className = 'letTalkStyleHightLight';
                    }, function (err) {
                        console.log(err);
                    });

                    var iframeNode = document.getElementById('letTalkIframe');
                    console.log('13');
                    var data = {
                        act: 'article', // 自定义的消息类型、行为，用于switch条件判断等。。
                        selectMessage
                    };
                    // 不限制域名则填写 * 星号, 否则请填写对应域名如 http://www.b.com
                    iframeNode.contentWindow.postMessage(data, '*');

                    // 注册消息事件监听，对来自 myIframe 框架的消息进行处理
                    window.addEventListener('message', function (e) {
                        if (e.data.act == 'response') {
                            console.log(e.data.errno);
                        } else {
                            console.log('未定义的消息: ' + e.data.act);
                        }
                    }, false);


                    // 模拟事件
                    var tag = that.createTag({
                        top: rect.top
                    });

                    slidebar.appendChild(tag);
                    that.tags.push(tag);
                    spanWrap.className = 'letTalkStyleHightLight';
                    eventHub.off('showClick');
                });
                eventHub.on('highlightClick', function () {
                    spanWrap.className = 'letTalkStyleHightLight';
                });

            }, false);
        },
        // 实例化tag标签
        createTag: function (style) {
            var tag = document.createElement('span');
            tag.className = 'letTalkTag';
            tag.innerHTML = 1;
            tag.style['top'] = style.top + 'px';
            return tag;
        },
        // 监听滚动函数
        watchScoll: function () {
            var that = this;
            var bottomTag = document.getElementById('bottomTag');
            var topTag = document.getElementById('topTag');
            window.onscroll = function () {
                for (var i = 0; i < that.tags.length; i++) {
                    var p = pos(that.tags);
                    if (p.top === 0) {
                        topTag.style['display'] = 'none';
                    }
                    if (p.bottom === 0) {
                        bottomTag.style['display'] = 'none';
                    }
                    var arch = that.highlighs[i];
                    newTop = arch.getBoundingClientRect().top;
                    if (newTop < 50) {
                        topTag.style['display'] = 'block';
                        newTop = 50;
                    } else if (newTop > document.body.clientHeight - 20) {
                        bottomTag.style['display'] = 'block';
                        newTop = document.body.clientHeight - 25;
                    }
                    that.tags[i].style['top'] = newTop + 'px';
                    bottomTag.innerHTML = p.bottom;
                    topTag.innerHTML = p.top;
                }
            }

            // watch内部函数仅用作判断tag位置
            function pos(arr) {
                var top = 0;
                var bottom = 0;
                for (var i = 0; i < arr.length; i++) {
                    var t = parseInt(arr[i].style['top']);
                    if (t === 50) {
                        top++;
                    } else if (t === document.body.clientHeight - 25) {
                        bottom++;
                    }
                }
                return {
                    top: top,
                    bottom: bottom
                }
            }
        },
        watcher: function () {
            // // 监听事件渲染页面的全部评论
            // var selectPromise = LetsTalkModel.fireMessageEvent('renderComment', 'pending');
            // selectPromise.then(function (objArr) {
            //     for (var i = 0, obj; obj = objArr[i++];) {
            //         var dom = document.evaluate(obj.xpath, document).iterateNext();
            //         var domInner = dom.innerHTML;
            //         var start = domInner.indexOf(obj.message);
            //         var end = start + obj.message.length;
            //         var part1 = domInner.substring(0, start);
            //         var part2 = domInner.substring(end, domInner.length);
            //         dom.innerHTML = part1 + '<span class="letTalkStyleHightLight">' + obj.message + '</span>' + part2;
            //     }
            // }, function (err) {
            //     console.log(err);
            // });

            // // 监听是否聚焦到一个具体的评论
            // LetTalkModel.addMessageEvent('focusComment', function (obj) {
            //     var dom = document.evaluate(obj.xpath, document).iterateNext();
            //     var target = dom.offsetTop;

            //     //  滚动到指定位置
            //     var timer = setInterval(function () {
            //         var currentTop = document.body.scrollTop;
            //         document.body.scrollTop = Math.floor((target - currentTop) / 10) + currentTop;
            //         if (Math.abs(document.body.scrollTop - target) < 100) {
            //             clearInterval(timer);
            //         }
            //     }, 30);

            //     var domInner = dom.innerHTML;
            //     var start = domInner.indexOf(obj.text);
            //     var end = start + obj.text.length;
            //     var part1 = domInner.substring(0, start);
            //     var part2 = domInner.substring(end, domInner.length);

            //     dom.innerHTML = part1 + '<span class="letTalkStyleHightLight">' + obj.text + '</span>' + part2;
            // });


            // // var obj = {
            // //     xpath: '//*[@class="show-content"]/OL[2]/LI',
            // //     text: "须先声明，有浪费资源和内存泄",
            // // };

        }
    }

    var letTalk = new LetTalk();
    // letTalk.watcher();

})(window);