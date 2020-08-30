// Variables  (TODO make sure all of these are used)
var videosWatched = new Set();  // Youtube video IDs for watched videos
var currentLevel = 1; // Current level user is on
var levelsToHtmlRows = {}; // Map correlating a level to a list of HTML elements in that level-row
var levelsToHtmlElementsMap = {};
var levelsToIdsMap = {}; // Map correlating a level to a list of video IDs on for that level
var idsToHtmlElementsMap = {}; // Map correlating a video ID to a corresponding HTML element


$(document).ready(function () {
    populateMaps();

    // Click events to Record videos watched
    $(".js-trigger-video-modal").on("click", function (e) {
        // prevent default behavior for a-tags, button tags, etc. 
        e.preventDefault();

        // Grab the video ID from the element clicked
        var id = $(this).attr('data-youtube-id');

        // TODO only trigger this logic after ~50% of video is watched?
        if (!videosWatched.has(id)) {
            recordVideoWatched(id);
        }
    });

    // Always unlock the first row
    unlockRow(1, false);

    // Populate anything from the server
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // If the user has watched videos before logging in, record them to the server...
            videosWatched.forEach(videoId => {
                recordVideoWatched(videoId);
            });

            // Now load the videos from the server that this user has already watched...
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let array = JSON.parse(this.responseText);
                    $(array).each(function () {
                        videosWatched.add(this.toString());
                    });
                    l = getLevel();
                    while (currentLevel < l) {
                        currentLevel++;
                        unlockRow(currentLevel, false);
                    }
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
    });

});

// TODO make async
function recordVideoWatched(videoId) {
    // Record locally for fast storage
    videosWatched.add(videoId);

    // Send to server for persistent storage
    var xhttp = new XMLHttpRequest();
    var request = {
        'uid': getUserId(),
        'videoId': videoId,
    }
    xhttp.open("POST", "/watched", true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    var req = JSON.stringify(request);
    xhttp.send(req);

    // Calculate the new level.  If higher than current level, unlock appropriate rows
    let l = getLevel();
    while (currentLevel < l) {
        currentLevel++;
        unlockRow(currentLevel, true);
    }
}

function populateMaps() {
    // Select Rows
    let rows = $(".learning-row");

    var max = 0;

    // Populate the maps
    rows.each(function (index) {
        var elements = [];
        var ids = [];
        $(this).find('.js-trigger-video-modal').each(function () {
            let id = $(this).attr('data-youtube-id');
            elements.push(this);
            ids.push(id);
            idsToHtmlElementsMap[id] = this;
        });
        levelsToHtmlRows[index + 1] = this;
        levelsToHtmlElementsMap[index + 1] = elements;
        levelsToIdsMap[index + 1] = ids;

        max = index > max ? index : max; // TODO add comments for max...
    });
}

function getLevel() {
    let level = currentLevel;
    let flag = true;
    while (levelsToIdsMap[level] && flag) {
        let idsForThisLevel = levelsToIdsMap[level];
        idsForThisLevel.forEach(id => {
            if (!videosWatched.has(id)) {
                flag = false;
            }
        });
        if (flag) {
            level++;
        }
    }
    return level;
}

function unlockRow(level, showUnlockModal) {
    for (let i = 1; i < level; i++) {

    }
    if (levelsToHtmlRows[level]) {
        levelsToHtmlRows[level].style = '';
    }

    if(showUnlockModal) {
        // TODO make this, "YOU HAVE UNLOCKED LEVEL X!""
    }

    // need to repopulate the nav UI
    populateLevelNav()
}

function populateLevelNav() {
    let nav = document.getElementById("level-selectors-nav");
    if(nav) {
        var dom = '';
        let level = 1;
        while(document.getElementById("level" + level)) {
            if(level > currentLevel) {
                dom += '<div class="selector locked">' + level + '</div>';
            } else {
                dom += '<a class="selector ';
                dom += level < currentLevel ? 'completed' : 'current';
                dom += '" href="#level' + level + '">' + level + '</a>';
            }
            level++;
        }
        nav.innerHTML = dom;
    }
}