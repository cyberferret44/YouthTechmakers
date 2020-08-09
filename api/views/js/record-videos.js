// TODO combine this with the youtube-modal.js stuff???
$(document).ready(function () {
     // Click on video thumbnail or link
     $(".js-trigger-video-modal").on("click", function (e) {
        // prevent default behavior for a-tags, button tags, etc. 
        e.preventDefault();

        // Grab the video ID from the element clicked
        var id = $(this).attr('data-youtube-id');

        recordVideoWatched(id);
     });
});

function recordVideoWatched(videoId) {
    var xhttp = new XMLHttpRequest();
    var request = {
        'uid': getUserId(),
        'videoId': videoId,
    }
    xhttp.open("POST", "/watched", true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    var req = JSON.stringify(request);
    xhttp.send(req);
}