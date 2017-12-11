/**
 * routerstatus
 *  Created by usher.yue.
 * User: usher.yue
 * Date: 17/12/8
 * Time: 20:31
 */
/**
 * router check
 * @param req
 * @param res
 * @param next
 */
var html = `
<html>
<head>
    <title>RouterStatus</title>
    <link rel="stylesheet" href="http://cdn.static.runoob.com/libs/bootstrap/3.3.7/css/bootstrap.min.css">  
	<script src="http://cdn.static.runoob.com/libs/jquery/2.1.1/jquery.min.js"></script>
	<script src="http://cdn.static.runoob.com/libs/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>
<BODY>
    <TABLE border="1" class="table table-hover">
        <caption style="text-align: center;font-size: 26px;">Http路由状态</caption>
        <THEAD>
           <TR>
              <TH style="min-width: 100px; font-size: 12px;">Uri</TH>
              <TH style="width: 100px;">Method</TH>
              <TH style="width: 200px;">TakeTime(>=1ms)</TH>
              <TH style="min-width: 300px;">Param</TH>
            </TR> 
        </THEAD>
        <tbody>
            {{DATA}}
        </tbody>
    </TABLE>
</BODY>
</html>
`;
/**
 * 查询状态
 * @returns {string}
 */
var serveStatusQuery = () => {
    let items = Object.values(routerStatusList).sort((v1, v2) => {
        return v2.taketime - v1.taketime;
    });
    let ret = '';
    let htmlRows = '';
    let i = 0;
    let styleClass = ['success', 'danger', 'warning', 'info', 'active'];
    for (let v of items) {
        i++;
        htmlRows += `<tr class="${styleClass[i % 5]}"><td>${v.uri}</td><td>${v.method}</td><td>${v.taketime}</td><td>${JSON.stringify(v.param)}</td></tr>`;
    }
    return html.replace("{{DATA}}", htmlRows);
};
//router status list
var routerStatusList = new Object();

var statusFunc = (req, res, next) => {
    let uri = req.path.toLowerCase();
    let method = req.method.toLowerCase();
    let minTime = 1;//>10ms的才记录
    if (uri == '/status' && method == 'get') {
        res.send(serveStatusQuery());
    }else if(uri=='/clearstatus' && method=='get'){
            routerStatusList={};
            res.redirect('/status');
    } else {
        try {
            let query = req.query;
            let body = req.body;
            let beforeExecTime = Date.now();
            //在http结束后执行,一次
            res.once('finish', function () {
                let afterExecTime = Date.now();
                let execTime = afterExecTime - beforeExecTime;
                if (execTime > minTime) {
                    if (!routerStatusList[uri]) {
                        routerStatusList[uri] = {
                            method: method,
                            param: Object.assign(!body ? {} : body, !query ? {} : query),
                            taketime: execTime,
                            uri: uri
                        };
                    } else {
                        if (execTime > routerStatusList[uri]['taketime']) {
                            routerStatusList[uri]['taketime'] = execTime;
                        }
                    }
                }
            });
            next();
        } catch (ex) {
            console.log(ex)
        }
    }
};
module.exports = statusFunc;