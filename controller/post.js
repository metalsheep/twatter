var fs = require('fs');
var global_config = require('../config.js');

var PostDB = require('../model/postDB.js');
var Post = require('../model/post.js');
var Log = require('../model/log.js');

var log = new Log();
var postDB = new PostDB();

var postData = fetchPosts(log.fileLocation);
postDB.array = postData.array
postDB.nextIndex = postData.nextIndex + 1;
console.log("Posts read from disk, server ready to respond to requests.");

function Controller(){
    this.create = function(obj){
        var post = new Post(obj);
        post.id = postDB.nextIndex++
        postDB.create(post);
        log.logPost(post);
    }
    this.read = function(index){
        return postDB.read(index);
    }
    this.update = function(obj){
        var post = new Post(obj);
        postDB.update(post);
        log.logPost(post);
    }
    this.delete = function(id){
        postDB.delete(id);
        log.logDelete(id);
    }
}

var controller = new Controller();

module.exports = controller;


function fetchPosts(fileLocation){
    var data = fs.readFileSync(fileLocation, "utf-8")
    if(data == "") {
        return {array: [], nextIndex: 0}; // no data found in store.
    } 
    
    data = data.replace(/^\|/, ""); // remove pipe at beginning of file
    
    var data_array = data.split(global_config.log.delim);
    
    var delete_list = [],
        post_list = [],
        nextIndex = 0;
    
    // gather the list of deleted indexes and the list of posts
    for(var i in data_array){
        var entry = data_array[i];
        if(entry.match(/::delete::\d+$/)){
            delete_list.unshift(Number(entry.replace(/::delete::/, "")));
        } else {
            var newPost = JSON.parse(entry)
            post_list.unshift(newPost);
            nextIndex = nextIndex > newPost.id ? nextIndex: newPost.id
        }
    }
    
    // remove deleted posts
    for(var j = 0; j < post_list.length; j++){
        if(delete_list.indexOf(post_list[j].id) > -1){
            post_list.splice(j--, 1);
        }
    }
    
    // sort the posts, newest first
    if(post_list.lenght !== 0){
        post_list.sort(function(a, b){
            if(b.id - a.id !== 0){
                return b.id - a.id;
            } else {
                return Number(b.timeStamp) - Number(a.timeStamp);
            }
        });
    }
    
    // de-dupe post list and take newest entry (edited posts).  Sort entries by timestamp.
    var ids = [];
    for(var k = 0; k < post_list.length; k++){
        if(ids.indexOf(post_list[k].id) > -1){
            post_list.splice(k, 1);
        } else {
            ids.push(post_list[k].id);
        }
    }
    
    var output = [];
    for(var i in post_list){
        output.push( new Post(post_list[i]) );
    }
    
    return {
        array: output,
        nextIndex: nextIndex
    }
}
