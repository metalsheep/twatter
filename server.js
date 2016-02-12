/* global global_config */
var http = require('http');
var fs = require('fs');
var urlLib = require('url');
var global_config = require('./config.js');

// Add controllers
var staticController = require('./controller/static.js');
var postController = require('./controller/post.js');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    switch(request.url){ // handle static assets
        case "/normalize":
            staticController.sendStatic(request, response, "normalize");
            break;
        case "/styles":
            staticController.sendStatic(request, response, "styles");
            break;
        case "/js":
            staticController.sendStatic(request, response, "js");
            break;
        case "/index":
        case "/":
            staticController.sendStatic(request, response, "index");
            break;
        default:
            apiRoutes(request, response);
    }
    console.log(request.url);
    //response.end(JSON.stringify(tweet_array.array[0]));
});

function apiRoutes(req, res){
    var url = req.url;
    var parsedURL = urlLib.parse(url, true);
    
    if(/^\/create/.test(url)){
        postController.create(parsedURL.query);
        staticController.sendStatic(req, res);
    } else if (/^\/read/.test(url)){
        var posts = postController.read([0,10]);
        res.writeHead(200, {"content-type": "application/json"});
        res.write(JSON.stringify({"posts":posts}));
        res.end();
    } else if (/^\/delete/.test(url)){
        postController.delete(parsedURL.query.id);
        staticController.sendStatic(req, res);
    } else if (/^\/edit/.test(url)){   
        postController.update(parsedURL.query);
        staticController.sendStatic(req, res);
    }
    staticController.sendError(req, res, 404);
}

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(global_config.port);