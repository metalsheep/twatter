getPageTweets();

var config = {
    editmode:{
        enabled: false,
        twatid: null
    }
};

// Respond to submit button
document.getElementById("tweet-form").addEventListener("submit", function(event){
    event.preventDefault();
    
    var body = document.getElementById("tweet-composer").value;
    var twat = new Twat({body: body});
    
    var route;
    
    if(config.editmode.enabled) {
        twat.id = config.editmode.twatid;
        route = "/edit"
        
        // reset edit mode
        config.editmode.twatid = undefined;
        config.editmode.enabled = false;
    } else {
        route = "/create"
    }
    
    var qString = makeQString(twat);
    sendReq("GET", route, qString, function(err) {
        // clear the tweet composer
        document.getElementById("tweet-composer").value = "";
        getPageTweets();
    });
});

function makeQString(twat) {
    var qString = "";
    for(var key in twat) {
        if(twat[key]) {
            if(qString != "") {
                qString += "&";
            }
            qString += key + "=" + twat[key];
        }
    }
    return qString
}

function sendReq(method, route, qString, callback) {
    var req = new XMLHttpRequest();
    req.open(method, route + "?" + qString);
    req.onload = callback;
    req.send();
}

function getPageTweets(){
    var getTweets = new XMLHttpRequest();
    getTweets.onload = function(err){
        var data = JSON.parse( getTweets.responseText );
        renderTweets(data);
    };
    getTweets.open("GET", "/read");
    getTweets.send();
}

function renderTweets(data){
    var tweetsContainer = document.getElementById("feed");
    tweetsContainer.innerHTML = "";
    var pageTweets = data.posts;
    for(var twat in pageTweets){
        renderTwat(tweetsContainer, new Twat(pageTweets[twat]));
        addButtonActions(pageTweets[twat]);
    }
}

function renderTwat(container, twat) {
    var newTwat = document.createElement("div");
    newTwat.id = "twat_" + twat.id;
    newTwat.innerHTML = twat.body +
        '<button class = "edit-button" type = "button" id=edit_' + twat.id + '>Edit</button>' +
        '<button class = "delete-button" type = "button" id=delete_' + twat.id + '>Delete</button>'
    container.appendChild(newTwat);
}

function addButtonActions(twat){
    var divId = "twat_" + twat.id
    var editId = "edit_" + twat.id;
    var deleteId = "delete_" + twat.id;
    var container = document.getElementById("feed");
    document.getElementById(editId).addEventListener("click", function () {
        config.editmode.enabled = true;
        config.editmode.twatid = twat.id;
        // remove the twat from the feed
        container.removeChild(document.getElementById(divId));
        // add it to the composer
        document.getElementById("tweet-composer").value = twat.body;
    });
    document.getElementById(deleteId).addEventListener("click", function () {
        sendDelete(twat.id, function() {
            container.removeChild(document.getElementById(divId));
        });
    });
}

function sendDelete(id, callback){
    var deleteTweet = new XMLHttpRequest();
    deleteTweet.open("GET", "/delete?id="+id);
    deleteTweet.onload = callback;
    deleteTweet.send();
}

function Twat(obj){
    this.body = obj.body;
    this.id = obj.id;
    this.timeStamp = obj.timeStamp;
}