// setup:
var currentTabs = 0;
var editedInputAlready = false;
var fullOutputString = ""; // to properly retain tabs and newline characters (track this var and update label text to match this var)
var historyStack = []; // to be able to "undo"
var searchWord = ""; // to be able to edit inside functions, etc.
var delayTimeMin = 2000;
var timeCurr, timePrev;
var timePrev = new Date().getTime();

/*---------------------------------------------------------------------------*/

// parseCommand() is the main function here in the brain, and calls the other functions
function parseCommand() {
    // initialize variables
    var command = document.getElementById("inputStr").value;
    var checkValid = checkValidCommand(command);
    
    //command = addSpaceIfDelay(command);
    
    // check if command is in valid form (in case of noise or incorrect entry)
    if (checkValid) {
        // identify command, run command, and update output text:
        historyStack.push(fullOutputString); // to be able to "undo"
        fullOutputString = runCommand(identifyCommand(command)); /* <- THIS IS THE KEY LINE IN THIS FUNCTION */
        document.getElementById("outputStr").innerText = fullOutputString + "\r";
        // clear the sentence that was entered
        document.getElementById("inputStr").value = "";
        // update line numbers:
        var numLines = fullOutputString.split("\n").length + 1; // labelOutput.split("\n").length + 1;
        document.getElementById("lineNumbers").innerText = "";
        var divider = " |";
        for (i=1; i<numLines; i++) {
            document.getElementById("lineNumbers").innerText += i.toString() + divider + "\n";
        }
        // make 2nd button visible if displayed text is getting long
        if (numLines>10) {
            document.getElementById("createFile2").style.visibility = "visible";
        }
    }
    // once user starts entering text, remove placeholder text and show some collapsed GUI elements
    if (editedInputAlready === false) {
        editedInputAlready = true;
        document.getElementById("inputStr").placeholder = "";
        document.getElementById("commandListPrompt").style.visibility = "visible";
        document.getElementById("createFile").style.visibility = "visible";
    }
}

function checkValidCommand(command) {
    var words = command.split(" ");
    var firstWord = words[0].toLowerCase();
    var lastWord = words[words.length-1].toLowerCase();
    if (firstWord === "computer" && lastWord === "please" && words.length > 2) {
        return true;
    } else {
        return false;
    }
}

function addSpaceIfDelay(command) {
    /* TRY TO ADD SPACE TO END OF TEXT IF PAUSED (TO AID WHEN VOICE COMMAND PAUSES MID-SENTENCE AND DOESN'T ADD A SPACE FOR THE NEXT WORD.)
     * (Because pauses usually happen between words, add a space when there's a pause. Mac Dictation doesn't add a space.)
     */
    if (command.length > 1 && command.substring(command.length-1) !== " ") {
        timeCurr = new Date().getTime();
        if (timeCurr - timePrev > delayTimeMin) {
            // add space before next word
            document.getElementById("inputStr").value = command.substring(0,command.length-1) + " " + command.substring(command.length-1);
        }
        timePrev = new Date().getTime(); // reset previous value at every keystroke
    }
    /* TODO: may need to use threads. this doesn't seem to work with dictation yet.
     */
    return command;
}

function identifyCommand(command) {
    var name = "";
    
    // NOTE!  Creating something at a certain line OVERRIDES creating something
    
    // check if creating something at a specified line:
    var checkIfCreatingLine = command.match(new RegExp(".+ (create |add |insert |make )(a(n)? )?(.+) (at |in )(line |row )(number )?(.+) please"));
    var line, what;
    if (checkIfCreatingLine) {
        line = checkIfCreatingLine[8];
        what = checkIfCreatingLine[4];
        command = "line " + what;
        name = camelCase(line);
        return [command, name];
    } else {
        // check if creating something at a specified line (alternate phrasing):
        var checkIfCreatingLine_ALT = command.match(new RegExp(".+ (at |in )(line |row )(number )?(.+) (create |add |insert |make )(a(n)? )?(.+) please"));
        if (checkIfCreatingLine_ALT) {
            line = checkIfCreatingLine_ALT[4];
            what = checkIfCreatingLine_ALT[8];
            command = "line " + what;
            name = camelCase(line);
            return [command, name];
        } else {
            
            // check if creating something basic:
            var createCommandsList = ["variable", "function", "tab", "import", "loop", "for loop", "file", "tree"];
            for (i=0; i<createCommandsList.length; i++) {
                var commandWord = createCommandsList[i];
                var checkIfCreatingSomething = command.match(new RegExp(".+ (create |add |insert |make )(just )?(a(n)? )?" + commandWord + " (with |named |called |with name )?(.+) please"));
                if (checkIfCreatingSomething) {
                    command = commandWord;
                    name = camelCase(checkIfCreatingSomething[6]);
                    var justThisElement = (checkIfCreatingSomething[2]==="just ");
                    return [command, name, justThisElement];
                }
            }
            
            // check if adding a line at the bottom of the file:
            var checkIfAddingLastLine = command.match(new RegExp(".+ (create |add |make )(a )?(line |row )please"));
            if (checkIfAddingLastLine) {
                command = "ADD LAST LINE";
                name = "";
                return [command, name];
            }
            
            // check if deleting a character:
            var checkIfDeletingLastChar = command.match(new RegExp(".+ delete (that |the )?(last |previous )?(character |letter |number |one )?please"));
            if (checkIfDeletingLastChar) {
                command = "delete LAST CHAR";
                return [command, name];
            }
            
            // check if deleting a line:
            var checkIfDeletingLastLine = command.match(new RegExp(".+ delete (that |the )?(last |previous |whole |entire )?(line |row )please"));
            if (checkIfDeletingLastLine) {
                command = "delete LAST LINE";
                return [command, name];
            }
            var checkIfDeletingLineNumber = command.match(new RegExp(".+ delete (that |the )?(whole | entire )?(line |row )(number )?(.+) please"));
            if (checkIfDeletingLineNumber) {
                command = "delete LINE NUMBER";
                name = camelCase(checkIfDeletingLineNumber[5]);
                return [command, name];
            }
            
            // check if editing a function:
            var checkIfEditingFunction = command.match(new RegExp(".+ (change |edit )(that |the )?function (called )?(.+) please"));
            if (checkIfEditingFunction) {
                command = "edit FUNCTION";
                name = camelCase(checkIfEditingFunction[4]);
                return [command, name];
            }
            
            // check for undo command:
            var checkForUndoCmd = command.match(new RegExp(".+ undo (that )?(last one |last thing)?please"));
            if (checkForUndoCmd) {
                command = "undo";
                name = "";
                return [command, name];
            }
            
            // check for hide/show commands:
            var checkForShowHideCmds = command.match(new RegExp(".+ (hide|show) (the |all )?commands (list )?please"));
            if (checkForShowHideCmds) {
                command = checkForShowHideCmds[1];
                name = "";
                return [command, name];
            }
            
            // if didn't return values yet, check these other possible commands:
            var checkIfEditingTabs = command.match(/.* (.*) (a(n)? )?(tab|indent)(s)? .*/);
            if (checkIfEditingTabs) {
                var keyWord =  checkIfEditingTabs[1];
                if (keyWord === "increase" || keyWord === "right" || keyWord === "more" || keyWord === "add") {
                    command = "tab";
                } else if (keyWord === "decrease" || keyWord === "left" || keyWord === "less" || keyWord === "subtract" || keyWord === "remove" || keyWord === "delete"){
                    command = "removeTab";
                }
            } else {
                var checkForLiteralTyping = command.match(/.+ (literally )?type (.+) please/);
                if (checkForLiteralTyping) {
                    var literalText = checkForLiteralTyping[2];
                    command = "literallyType";
                    name = literalText;
                } else {
                    var checkIfImporting = command.match(/.+ import (.+) please/);
                    if (checkIfImporting) {
                        command = "import";
                        name = camelCase(checkIfImporting[1]);
                    }
                }
            }
            
            var checkForScrollCmds = command.match(/.* scroll (up|down).*/);
            if (checkForScrollCmds) {
                var scrollDirection = checkForScrollCmds[1];
                command = "scroll";
                name = scrollDirection;
                return [command, name];
            }
            
            // return command ID and parameter "name" ("name" = paramater with meaning given by context)
            return [command, name];
            
        }
    }
}

function runCommand([command, name, justThisElement]) {
    var output = fullOutputString; // fail-safe to not changing label output in case command run fails
    if (command === "variable") {
        output = createVariable(name, fullOutputString, justThisElement);
    } else if (command === "function") {
        output = createFunction(name, fullOutputString, justThisElement);
    } else if (command === "tab") {
        output = addTab(fullOutputString, justThisElement);
    } else if (command === "import") {
        output = createImport(name, fullOutputString, justThisElement);
    } else if (command === "removeTab") {
        output = removeTab(fullOutputString);
    } else if (command === "loop" || command === "for loop") {
        output = createLoop(name, fullOutputString, justThisElement);
    } else if (command === "tree") {
        output = createTree(name, fullOutputString, justThisElement);
    } else if (command === "literallyType") {
        output = literallyType(name, fullOutputString);
    } else if (command === "delete LAST CHAR") {
        output = deleteLastChar(fullOutputString);
    } else if (command === "delete LAST LINE") {
        output = deleteLastLine(fullOutputString);
    } else if (command === "delete LINE NUMBER") {
        output = deleteLineNumber(name, fullOutputString);
    } else if (command === "edit FUNCTION") {
        output = editFunction(name, fullOutputString);
    } else if (command.substring(0,5) === "line ") {
        var line = name;
        var what = command.substring(5);
        output = createLine(line, what, fullOutputString);
    } else if (command === "ADD LAST LINE") {
        output = createLastLine(fullOutputString);
    } else if (command === "undo") {
        if (historyStack.length >= 2) {
            historyStack.pop();
            output = historyStack.pop();
        } else { // account for empty stack
            output = "";
        }
    } else if (command === "hide") {
        hideCommandsList();
        output = fullOutputString;
    } else if (command === "show") {
        showCommandsList();
        output = fullOutputString;
    } else if (command === "file") {
        createFile(name);
    } else if (command === "scroll") {
        scroll(name);
    }
    return output;
}

function checkWhatCreating(args) {
    //code
}

function createVariable(name, labelOutput, justThisElement) {
    var tabs = "\t".repeat(currentTabs);
    if (justThisElement) {
        return tabs + "var " + name + ";\n";
    } else {
        return labelOutput + tabs + "var " + name + ";\n";
    }
}

function createFunction(name, labelOutput, justThisElement) {
    var tabs = "\t".repeat(currentTabs);
    if (justThisElement) {
        return tabs + "function " + name + "(" + ") {\n" + tabs + "\t\n}\n\n";
    } else {
        return labelOutput + tabs + "function " + name + "(" + ") {\n" + tabs + "\t\n}\n\n";
    }
}

function addTab(labelOutput, justThisElement) {
    currentTabs += 1;
    if (justThisElement) {
        return "\t";
    } else {
        return labelOutput + "\t";
    }
}

function removeTab(labelOutput) {
    if (currentTabs > 0) {
        currentTabs -= 1;
    }
    if (labelOutput[labelOutput.length-1] === "\t") {
        return labelOutput.slice(0, -1);
    } else {
        return labelOutput;
    }
}

function literallyType(literalText, labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    return labelOutput + tabs + literalText + "\n";
}

function createFile(name) {
    try {
        if (name === "") {
            name = "test";
        }
        var filename = name + ".js";
        var temporaryElem = document.createElement("a");
        temporaryElem.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(fullOutputString));
        temporaryElem.setAttribute("download", filename);
        if (document.createEvent) {
            var event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            temporaryElem.dispatchEvent(event);
        }
        else {
            temporaryElem.click();
        }
    } catch(err) {
        // if the previous code returns an error or isn't supported, try using this instead:
        var content = fullOutputString;
        window.open('data:text/txt;charset=utf-8,' + escape(content), 'newdoc');
    }
}

function createImport(name, labelOutput, justThisElement) {
    try {
        var read = new XMLHttpRequest();
        read.open("GET", "js_import/" + name + ".js", false);
        read.send();
        var fileText = read.responseText;
        if (justThisElement) {
            return fileText + "\n\n";
        } else {
            return fileText + "\n\n" + labelOutput;
        }
    } catch(err) {
        //alert(err.message);
        //alert("Import file not found. Check local directory.");
        if (justThisElement) {
            return "";
        } else {
            return labelOutput;
        } 
    }
    //var precedingComment = "// include jQuery in HTML: <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js\"/>\n";
    //if (justThisElement) {
    //    return precedingComment + "$.getScript(\"" + name + ".js\", function() {\n\t// Script loaded but not necessarily executed.\n});\n\n";
    //} else {
    //    return precedingComment + "$.getScript(\"" + name + ".js\", function() {\n\t// Script loaded but not necessarily executed.\n});\n\n" + labelOutput;
    //}
}

function createLoop(name, labelOutput, justThisElement) {
    var tabs = "\t".repeat(currentTabs);
    if (justThisElement) {
        return tabs + "for (" + name + " = 0; " + name + " < " + name + ".length; " + name + "++) {\n" + tabs + "\t\n}\n";
    } else {
        return labelOutput + tabs + "for (" + name + " = 0; " + name + " < " + name + ".length; " + name + "++) {\n" + tabs + "\t\n}\n";
    }
}

function createTree(name, labelOutput, justThisElement) {
    var importTree = createImport("treeNodeClass", labelOutput, justThisElement); // to import treeNodeClass.js
    var testInitializedTree = "var " + name + " = new node(1);\n";
    var testUse = name + ".branch(2);\nalert(" + name + ".getPrintOut()); // test output (should pop-up \"1\\n\\t\\t2\")\n";
    // return "import " + name + ";\n" + labelOutput;
    if (justThisElement) {
        return importTree + testInitializedTree + testUse + "\n\n";
    } else {
        return importTree + testInitializedTree + testUse + "\n\n" + labelOutput;
    }
    //var treeJS_directoryAndName = "js_import/treeNodeClass";
    //var precedingComment = "// include jQuery in HTML: <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js\"/>\n";
    //var testInitializedTree = "var " + name + " = new node(1);\n";
    //var testUse = name + ".branch(2);\nalert(" + name + ".getPrintOut()); // test output (should pop-up \"1\\n\\t\\t2\")\n";
    //// return "import " + name + ";\n" + labelOutput;
    //if (justThisElement) {
    //    return precedingComment + "$.getScript(\"" + treeJS_directoryAndName + ".js\", function() {\n\t// Script loaded but not necessarily executed.\n" + testInitializedTree + testUse + "});\n\n";
    //} else {
    //    return precedingComment + "$.getScript(\"" + treeJS_directoryAndName + ".js\", function() {\n\t// Script loaded but not necessarily executed.\n" + testInitializedTree + testUse + "});\n\n" + labelOutput;
    //}
}

function deleteLastChar(labelOutput) {
    return labelOutput.slice(0, -1);
}

function deleteLastLine(labelOutput) {
    if (fullOutputString.lastIndexOf("\n") !== -1) {
        return labelOutput.slice(0, fullOutputString.lastIndexOf("\n")); // labelOutput.lastIndexOf("\n"));
    } else {
        return "";
    }
}

function deleteLineNumber(name, labelOutput) {
    var lineToDelete = -1;
    // if the string is not a number, then convert it to a number
    lineToDelete = numberNameToInt(name);
    // now use that number as the line to delete from labelOutput
    var indexStart = getIndexOfNthSubstring(labelOutput,"\n", lineToDelete - 1);
    var indexStop = getIndexOfNthSubstring(labelOutput,"\n", lineToDelete);
    // get the part before and after
    var partBefore = labelOutput.slice(0,indexStart);
    var partAfter = labelOutput.slice(indexStop);
    // account for anomaly if lineToDelete === 1;
    if (lineToDelete === 1) {
        partAfter = partAfter.slice(1, -1);
    }
    var splicedOutput = partBefore + partAfter;
    return splicedOutput;
}

function editFunction(name, labelOutput) {
    // initialize variables to fail-safe states:
    var startBracket = labelOutput.length;
    var endBracket = labelOutput.length;
    var newText = "\n\t// add code here\n";
    // try to find indices of opening and closing brackets of function
    var foundStartOfFunction = labelOutput.search(new RegExp("function " + name + "\((.*)\)"));
    if (foundStartOfFunction !== -1) {
        startBracket = foundStartOfFunction + ("function " + name + "() {").length;
        //endBracket = foundStartOfFunction + ("function " + name + "() {").length + 1;
        var restOfText = labelOutput.slice(startBracket+1,labelOutput.length-1);
        // find end of function (i.e. the last "}" by tracking a count of nested "{"'s to cancel out
        var curlyBracketCount = 0;
        for (i=0; i<restOfText.length; i++) {
            if (restOfText[i] === "}") {
                if (curlyBracketCount === 0) {
                    endBracket = i + startBracket+1;
                    break;
                } else {
                    curlyBracketCount -= 1;
                }
            }
            if (restOfText[i] === "{") {
                curlyBracketCount += 1;
            }
        }
        return labelOutput.slice(0,startBracket) + newText + labelOutput.slice(endBracket,labelOutput.length);
    }
    return labelOutput;
}

function createLine(line, what, labelOutput) {
    line = numberNameToInt(line);
    // check if line exists:
    var numLines = fullOutputString.split("\n").length+1;
    var newLabelOutput = labelOutput;
    if (line < numLines) {
        // get line to insert at:
        var indexStart = getIndexOfNthSubstring(labelOutput, "\n", line-1); //labelOutput.indexOf("\n",line+1);
        var indexStop = getIndexOfNthSubstring(labelOutput, "\n", line-1); //labelOutput.indexOf("\n",line+2);
        // use an almost "recursive" sub-call to create functions:
        // TODO try making all other create commands have implicit line number indication "at last line" to be able to do this sub-call
        // (like createVariable, createFunction, addTab, createImport, createLoop)
        var subCmd = runCommand(identifyCommand("computer create just " + what + " please")); // "computer create " + what + " please"; //
        // get new labelOutput:
        var tabs = "\t".repeat(currentTabs);
        newLabelOutput = labelOutput.substring(0,indexStart) + "\n" + tabs + subCmd + labelOutput.substring(indexStop);
    }
    return newLabelOutput;
}

function createLastLine(labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    var newLabelOutput = labelOutput + "\n" + tabs;
    return newLabelOutput;
}

function hideCommandsList() {
    document.getElementById('commandListBox').style.visibility = "hidden";
}

function showCommandsList() {
    document.getElementById('commandListBox').style.visibility = "visible";
    document.getElementById('commandListPrompt').style.visibility = "hidden"; // hide instruction to show commands
}

function scroll(name) {
    var scrollDirection = name;
    if (scrollDirection === "up") {
        window.scrollBy(0, -500);
    } else if (scrollDirection === "down") {
        window.scrollBy(0, 500);
    }
}

function camelCase(name) {
    if (name.match(/[a-z]/i)) { // if letters found
            var words = name.split(" ");
        name = words[0];
        for (i=1; i<words.length; i++) {
            name += words[i][0].toUpperCase() + words[i].slice(1);
        }
    }
    return name;
}

function getIndexOfNthSubstring(str, substring, n) {
    var times = 0;
    var index = null;
    while (times < n && index !== -1) {
        index = str.indexOf(substring, index+1);
        times++;
    }
    return index;
}

function numberNameToInt(num) {
    var digits = {
        'zero': 0,
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
        'ten': 10,
        'eleven': 11,
        'twelve': 12,
        'thirteen': 13,
        'fourteen': 14,
        'fifteen': 15,
        'sixteen': 16,
        'seventeen': 17,
        'eighteen': 18,
        'nineteen': 19,
        'twenty': 20,
        'thirty': 30,
        'forty': 40,
        'fifty': 50,
        'sixty': 60,
        'seventy': 70,
        'eighty': 80,
        'ninety': 90
    };
    var number;
    // if the string is not a number, then convert it to a number
    if (isNaN(num)) {
        number = digits[num];
    } else {
        number = parseInt(num);
    }
    return number;
}