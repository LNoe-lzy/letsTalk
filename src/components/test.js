window.addEventListener('message', function (e) {
    if (e.data.act == 'article') {
        console.log(e.data.selectMessage);
        // 向父窗框返回响应结果
        window.parent.postMessage({
            act: 'response',
            errno: 0
        }, '*');
    } else {
        console.log('未定义的消息: ' + e.data.act);
    }
}, false);