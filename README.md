# programmingByVoice

Combine Mac Dictation with a GUI (Graphical User Interface) to write code by voice command.

Try it in your browser: [http://codepen.io/hchiam/full/evbOdv](http://codepen.io/hchiam/full/evbOdv)

[![screenshot_GUI.png](https://github.com/hchiam/programmingByVoice/blob/master/screenshot_GUI.png "Combine Mac Dictation with a GUI to program code by voice command.")](http://codepen.io/hchiam/full/evbOdv)

To run the code, save [interface.html](https://github.com/hchiam/programmingByVoice/blob/master/interface.html), [brain.js](https://github.com/hchiam/programmingByVoice/blob/master/brain.js), and [style.css](https://github.com/hchiam/programmingByVoice/blob/master/style.css) in the same folder, and open up interface.html in a web browser.
After clicking in the textbox, start up Mac Dictation and say something like "Computer create function my function please."

## main data flow:

Mac Dictation —> interface.html’s inputStr’s oninput —> brain.js’s (parseCommand —> checkValidCommand —> identifyCommand —> runCommand) —> interface.html’s outputStr

(style.css is for the styles applied to different elements in interface.html, including important properties like hidden/visibility, opacity of overlapping elements, formatting, etc.)