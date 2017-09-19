# Programming By Voice

Combine Mac Dictation with a GUI in your browser to write code by voice command.

Try it in your browser: [http://codepen.io/hchiam/full/evbOdv](http://codepen.io/hchiam/full/evbOdv)

**Steps to use it:**

1) Click in the textbox.
2) Start up Mac Dictation (default: press the Fn key twice).
3) Say (or type) something like "computer show commands please" (try speaking slowly with clear breaks between words).

[![screenshot_GUI.png](https://github.com/hchiam/programmingByVoice/blob/master/screenshot_GUI.png "Combine Mac Dictation with a GUI to program code by voice command.")](http://codepen.io/hchiam/full/evbOdv)

To locally run a copy of the code files from your computer, you need to save at least [interface.html](https://github.com/hchiam/programmingByVoice/blob/master/interface.html), [brain.js](https://github.com/hchiam/programmingByVoice/blob/master/brain.js), and [style.css](https://github.com/hchiam/programmingByVoice/blob/master/style.css) in the same folder, and open up interface.html in a web browser.

# Main Data Flow:

Mac Dictation —> interface.html’s inputStr’s oninput —> brain.js’s (parseCommand —> checkValidCommand —> identifyCommand —> runCommand) —> interface.html’s outputStr

(style.css is for the styles applied to different elements in interface.html, including important properties like hidden/visibility, opacity of overlapping elements, formatting, etc.)

# Check Out Related Projects:

[https://github.com/hchiam/please](https://github.com/hchiam/please)

https://github.com/hchiam/language-user-interface
