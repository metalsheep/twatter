var global_config = require('../config.js');

function PostDB(){
    var self = this;
    this.array = [];
    this.read = function(index){
        return this.array.slice(index[0], index[1]);
    };
    this.create = function(post){
        this.array.unshift(post);
    };
    this.update = function(post){
        for(var i in self.array){
            if(self.array[i].id == Number(post.id)){
                self.array[i] = post;
            }
        }
    };
    this.delete = function(index){
        for(var i in self.array){
            if(self.array[i].id == index){
                self.array.splice(i,1)[0];
            }
        }
    }
}

module.exports = PostDB;