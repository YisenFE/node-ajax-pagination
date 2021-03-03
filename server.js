/*
    currNum=1     0-9
    currNum=2     10-19
    currNum=3     20-29
    currNum=?     (currNum-1)*10 ~ currNum*10-1
 */

const http = require("http");
const url = require("url");
const fs = require("fs");

const networkInterfaces = require('os').networkInterfaces();// 在开发环境中获取局域网中的本机IP地址
let IPAddress = '';
for (let devName in networkInterfaces) {
    var iFace = networkInterfaces[devName];
    iFace.forEach(item => {
        if (item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal) {
            IPAddress = item.address;
        }
    })
}

// const HOST = IPAddress;
const HOST = '0.0.0.0';
const PORT = 8080;

let server = http.createServer(function (req, res) {
    let urlObj = url.parse(req.url, true);
    let pathname = urlObj.pathname;
    let query = urlObj["query"];
    console.log(urlObj);
    // http://localhost:88/getInfo?id=28&n=1
    // urlObj = {
    //     protocol: null,
    //     slashes: null,
    //     auth: null,
    //     host: null,
    //     port: null,
    //     hostname: null,
    //     hash: null,
    //     search: '?id=28&n=1',
    //     query: { id: '28', n: '1' },
    //     pathname: '/getInfo',
    //     path: '/getInfo?id=28&n=1',
    //     href: '/getInfo?id=28&n=1'
    // }

    //-> 静态资源（项目）文件的请求处理：服务端接受到具体的请求文件后，把文件中的源代码返回给客户端进行渲染即可
    var reg = /\.(HTML|CSS|JS)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = suffix === "HTML" ? "text/html" : (suffix === "CSS" ? "text/css" : "text/javascript");
        try {
            res.writeHead(200, {
                'content-type': suffixMIME + ';charset=utf-8;'
            });
            res.end(fs.readFileSync("." + pathname, "utf-8"));
        } catch(e) {
            res.writeHead(404);
            res.end("file is not found~");
        }
        return
    }

    //-> API接口文档中规定的数据请求处理
    var data = JSON.parse(fs.readFileSync("./json/data.json", "utf-8"));
    if (pathname === "/getList") {
        var currNum = query["currNum"] || 1,
            pageSize = query["pageSize"] || 20,
            ary = [];
        if (currNum * pageSize >= data.length) {
            currNum = Math.ceil(data.length / pageSize)
        }
        for (var i = (currNum - 1) * pageSize; i <= currNum * pageSize - 1; i++) {
            //-> 通过规律计算的索引比最大的索引都要大，直接跳出即可，不需要在存储了
            if (i > data.length - 1) {
                break;
            }
            ary.push(data[i]);
        }
        console.log(ary);
        res.writeHead(200,{'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify({
            code: 0,
            msg: "成功",
            totalPage: Math.ceil(data.length / pageSize),
            total: data.length,
            currNum: +currNum,
            pageSize: +pageSize,
            data: ary
        }));
        return
    }
    if (pathname === "/getInfo") {
        var studentId = query["id"],
            obj = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i]["id"] == studentId) {
                obj = data[i];
            }
        }
        var result = {
            code: 1,
            msg: "内容不存在",
            data: null
        };
        if (obj) {
            result = {
                code: 0,
                msg: "成功",
                data: obj
            }
        }
        res.writeHead(200,{'content-type': 'application/json;charset=utf-8;'})
        res.end(JSON.stringify(result));
        return
    }
    res.writeHead(404);
    res.end("request api url is not found~");
    return
});
server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});
