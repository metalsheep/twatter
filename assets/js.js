getPageTweets();

document.getElementById("tweet-form").addEventListener("submit", function(event){
    event.preventDefault();
    
    var form = document.getElementById("tweet-form");
    var postTweets = new XMLHttpRequest();
    var body = document.getElementById("tweet-editor").value;
    if(body){
        if(form.name != ""){
            // send and upate
            postTweets.open("GET", "/edit?body=" + body + "&id=" + form.name);
        } else {
            // send a new tweet
            postTweets.open("GET", "/create?body=" + body);
        }
        postTweets.onload = function(err){
            document.getElementById("tweet-editor").value = "";
        }
        postTweets.send();
        getPageTweets();
    }
});

var pageTweets;


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
    var tweetsContainer = document.getElementById("tweets");
    tweetsContainer.innerHTML = "";
    pageTweets = data.posts;
    for(var twat in pageTweets){
        var tweetData = pageTweets[twat]
        tweetsContainer.innerHTML += 
            "<div id = twat_" +
            tweetData.id + ">" + 
            tweetData.body +
            '<button class = "edit-button" type = "button" id="' + tweetData.id + '">Edit</button>' +
            '<button class = "delete-button" type = "button" id="' + tweetData.id + '">Delete</button>'
            "</div>";
    }
    addDeleteButtons();
    addEditButton();
}
function addDeleteButtons(){
    var tweetsContainer = document.getElementById("tweets");    
    var deleteButtons = document.getElementsByClassName("delete-button");
    for(var i = 0; i < deleteButtons.length; i++){
        var button = deleteButtons.item(i);
        button.addEventListener("click", function(){
            var childID = "twat_" + this.id;
            var child = document.getElementById(childID)
            tweetsContainer.removeChild(child);
            sendDelete(this.id);
        });
    }
}
function addEditButton(){
    var tweetsContainer = document.getElementById("tweets");    
    var editButtons = document.getElementsByClassName("edit-button");
    for(var i = 0; i < editButtons.length; i++){
        var button = editButtons.item(i);
        button.addEventListener("click", function(){
            var childID = "twat_" + this.id;
            var child = document.getElementById(childID)
            tweetsContainer.removeChild(child);
            for(var i in pageTweets){
                if(pageTweets[i].id==this.id){
                    document.getElementById("tweet-editor").value = pageTweets[i].body;
                    document.getElementById("tweet-form").name = pageTweets[i].id;
                }
            }
        });
    }
}
function sendDelete(id){
    var deleteTweets = new XMLHttpRequest();
    deleteTweets.open("GET", "/delete?id="+id)
    deleteTweets.send();
}
