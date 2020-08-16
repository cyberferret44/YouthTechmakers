$(document).ready(function () {
    populateMaps();

     // Click on video thumbnail or link
     $(".js-trigger-video-modal").on("click", function (e) {
        // prevent default behavior for a-tags, button tags, etc. 
        e.preventDefault();

        // Grab the video ID from the element clicked
        var id = $(this).attr('data-youtube-id');

        // TODO only trigger this logic after ~50% of video is watched?
        recordVideoWatched(id);
     });

    showRow(1);
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            videosWatched.forEach(videoId => {
                recordVideoWatched(videoId);
            });
            populateVideosWatched(user);
        }
    });
    
});

function recordVideoWatched(videoId) {
    // Send to server for persistent storage
    // TODO make async
    if(!videosWatched.has(videoId)) {
        // Record locally for fast storage
        videosWatched.add(videoId);
        var xhttp = new XMLHttpRequest();
        var request = {
            'uid': getUserId(),
            'videoId': videoId,
        }
        xhttp.open("POST", "/watched", true);
        xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        var req = JSON.stringify(request);
        xhttp.send(req);

        let l = getLevel();
        while(currentLevel < l) {
            currentLevel++;
            showRow(currentLevel);
        }
    }
}

var videosWatched = new Set();
function populateVideosWatched(user) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let array = JSON.parse(this.responseText);
            $(array).each(function() {
                videosWatched.add(this.toString());
                currentLevel = getLevel();
                for(let i=1; i<= currentLevel; i++) {
                    showRow(i);
                }
            });
        }
    };

    var request = {
        'uid': user.uid
    }
    xhttp.open("POST", "/getwatched", true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    var req = JSON.stringify(request);
    xhttp.send(req);
}

var levelsToHtmlRows = {};
var levelsToHtmlElementsMap = {};
var levelsToIdsMap = {};
var idsToHtmlElementsMap = {};
var currentLevel = 1;
function populateMaps() {
    $(".learning-row").each(function (index) {
        var elements = [];
        var ids = [];
        $(this).find('.js-trigger-video-modal').each(function () {
            let id = $(this).attr('data-youtube-id');
            elements.push(this);
            ids.push(id);
            idsToHtmlElementsMap[id] = this;
        });
        levelsToHtmlRows[index+1] = this;
        levelsToHtmlElementsMap[index+1] = elements;
        levelsToIdsMap[index+1] = ids;
    });
}

function getLevel() {
    let level = currentLevel;
    let flag = true;
    while(levelsToIdsMap[level] && flag) {
        let idsForThisLevel = levelsToIdsMap[level];
        idsForThisLevel.forEach(id => {
            if(!videosWatched.has(id)) {
                flag = false;
            }
        });
        if(flag) {
            level++;
        }
    }
    return level;
}

function showRow(level) {
    if(levelsToHtmlRows[level]) {
        levelsToHtmlRows[level].style = '';
    }
}