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
/**
 * 查询状态
 * @returns {{}}
 */
var serveStatusQuery = () => {
    let ret=routerStatusList.sort((v1,v2)=>{
        return v2.taketime-v1.taketime;
    });
    return JSON.stringify(ret);
};
//router status list
var routerStatusList = new Array();

var statusFunc = (req, res, next) => {
    let uri = req.path.toLowerCase();
    let method = req.method.toLowerCase();
    if (uri == '/status' && method == 'get') {
        res.send(serveStatusQuery());
    } else {
        try {
            let query = req.query;
            let body = req.body;
            let beforeExecTime = Date.now();
            //在http结束后执行,一次
            res.once('finish', function () {
                let afterExecTime = Date.now();
                let execTime = afterExecTime - beforeExecTime;
                if (!routerStatusList[uri]) {
                    routerStatusList.push( {
                        method: method,
                        param: Object.assign(!body?{}:body, !query?{}:query),
                        taketime: execTime,
                        uri:uri
                    });
                } else {
                    if (execTime > routerStatusList[uri]['taketime']) {
                        routerStatusList[uri]['taketime'] = execTime;
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