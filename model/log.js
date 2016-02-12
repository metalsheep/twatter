var fs = require('fs');
var global_config = require('../config.js');

var Post = require('./post.js')
var fileLocation = global_config.store;

function Log(){
    this.fileLocation = fileLocation;
    this.logPost = function(post){
        var postBody = "|" + JSON.stringify(post);
        fs.appendFile(fileLocation, postBody, function(err){
            if(err){ console.log(err) }
        });
    }

    this.logDelete = function(id){
        var deleteBody = "|::delete::" + id;
        fs.appendFile(fileLocation, deleteBody, function(err){
            if(err){ console.log(err) }
        });
    }
}

module.exports = Log;