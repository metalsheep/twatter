function Tweet(obj){
    this.body = obj.body;
    this.userName = obj.user_name;
    this.timeStamp = obj.timeStamp || new Date().getTime();
    this.id = Number(obj.id) || 0;
}

module.exports = Tweet;