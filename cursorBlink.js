var timer = setInterval(timerAction, 500);

var cursorVisible = true;
var indexOfCursor = 0; // initialize to avoid errors

function timerAction() {
    var outputStr = document.getElementById("outputStr");
    if (outputStr.innerText !== "") {
        if (cursorVisible) {
            outputStr.innerText = outputStr.innerText.replace(/▂/g,""); // remove all instances of "▂"
            cursorVisible = false;
        } else {
            outputStr.innerText = outputStr.innerText.substring(0,indexOfCursor) + "▂" + outputStr.innerText.substring(indexOfCursor);
            cursorVisible = true;
        }
    }
}