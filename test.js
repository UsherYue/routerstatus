/**
 * routerstatus
 *  Created by usher.yue.
 * User: usher.yue
 * Date: 17/12/8
 * Time: 23:55
 */
var express = require('express');
var app = express();
var routerStatus = require('./index');
app.use(routerStatus);
app.get('/a', function (req, res) {
    res.send('a');
});
app.post('/b', function (req, res) {
    res.send('b');
});
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});