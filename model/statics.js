var fs = require('fs');
var statics = {};

fs.readFile('./assets/index.html', function(err, data){
    if(err){ return new Error(err); }
    statics.index = data;
});

var styles; 
fs.readFile('./assets/style.css', function(err, data){
    if(err){ return new Error(err); }
    statics.styles = data;
});

var normalize;
fs.readFile('./assets/normalize.css', function(err, data){
    if(err){ return new Error(err); }
    statics.normalize = data;
});

var js;
fs.readFile('./assets/js.js', function(err, data){
    if(err){ return new Error(err); }
    statics.js = data;
});

module.exports = statics;