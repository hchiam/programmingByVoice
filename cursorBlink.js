var timer = setInterval(timerAction, 500);

var cursorVisible = true;
var cursorLineNum = 1;

function timerAction() {
    var outputStr = document.getElementById("outputStr");
    if (outputStr.innerText !== "") {
        if (cursorVisible) {
            outputStr.innerText = outputStr.innerText.replace(/▂/g,""); // remove all instances of "▂"
            cursorVisible = false;
        } else {
            var indexSplice = getIndexOfNthSubstring(outputStr.innerText, "\n", cursorLineNum-1) + 1;
            if (indexSplice === 1) {
                indexSplice = 0; // special case for first line (to make substring() not splice but just add instead)
            }
            outputStr.innerText = outputStr.innerText.substring(0,indexSplice) + "▂" + outputStr.innerText.substring(indexSplice);
            cursorVisible = true;
        }
    }
}