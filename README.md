# programmingByVoice

Combine Mac Dictation with a GUI to program code by voice command.

![screenshot_GUI.png](https://github.com/hchiam/programmingByVoice/blob/master/screenshot_GUI.png "Combine Mac Dictation with a GUI to program code by voice command.")

To run the code, save [gui.html](https://github.com/hchiam/programmingByVoice/blob/master/gui.html), [brain.js](https://github.com/hchiam/programmingByVoice/blob/master/brain.js), and [style.css](https://github.com/hchiam/programmingByVoice/blob/master/style.css) in the same folder, and open up gui.html in a web browser.
After clicking in the textbox, start up Mac Dictation and say something like "Computer create function my function please."

## main data flow:

Mac Dictation —> gui.html’s inputStr’s oninput —> brain.js’s (parseCommand —> checkValidCommand —> identifyCommand —> runCommand) —> gui.html’s outputStr

(style.css is for the styles applied to different elements in gui.html, including important properties like hidden/visibility, opacity of overlapping elements, formatting, etc.)