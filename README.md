# programmingByVoice

Combine Mac Dictation with a GUI to program code by voice command.

[screenshot_GUI.png](https://github.com/hchiam/programmingByVoice/screenshot_GUI.png)

To run the code, save both gui.html and brain.js in the same folder, and open up gui.html.
After clicking in the textbox, start up Mac Dictation and say something like "Computer create function my function please."

## main data flow:

Mac Dictation —> gui.html’s inputStr’s oninput —> brain.js’s (parseCommand —> checkValidCommand —> identifyCommand —> runCommand) —> gui.html’s outputStr

(style.css is for the styles applied to different elements in gui.html, including important properties like hidden/visibility, opacity of overlapping elements, formatting, etc.)