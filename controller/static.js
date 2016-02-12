var statics = require('../model/statics.js');

function sendStatic(req, res, content){
    var contentType, 
        resContents;
        
    switch(content){
        case "index":
            contentType = "text/html";
            resContents = statics.index
            break;
        case "normalize":
            contentType = "text/css";
            resContents = statics.normalize
            break;
        case "styles":
            contentType = "text/css";
            resContents = statics.styles
            break;
        case "js":
            contentType = "text/javascript";
            resContents = statics.js
            break;
        default: 
            contentType = "text/plain";
            break;
    }
    res.writeHead(200, {"content-type": contentType});
    res.end(resContents);
}
function sendError(req, res, code){
    res.writeHead(code, {"content-type": "text/plain"});
    res.end();
}

exports.sendStatic = sendStatic;
exports.sendError = sendError;