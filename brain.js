var currentTabs = 0;
var editedInputAlready = false;
var fullOutputString = ""; // see if this will help properly retain tabs
var searchWord = ""; // to be able to edit inside functions, etc.

// parseCommand is the main function here in the brain, and calls the other functions
function parseCommand() {
    // initialize variables
    var command = document.getElementById("inputStr").value;
    var checkValid = checkValidCommand(command);
    // check if command is in valid form (in case of noise or incorrect entry)
    if (checkValid) {
        // identify command, run command, and update output text:
        fullOutputString = runCommand(identifyCommand(command)); /* <- THIS IS THE KEY LINE IN THIS FUNCTION */
        document.getElementById("outputStr").innerText = fullOutputString + "\r";
        // clear the sentence that was entered
        document.getElementById("inputStr").value = "";
        // update line numbers:
        //var numLines = fullOutputString.match(/\n/g).length+1; // document.getElementById("outputStr").innerText.match(/\n/g).length+1;
        var numLines = fullOutputString.split("\n").length+1; // labelOutput.split("\n").length+1;
        document.getElementById("lineNumbers").innerText = "";
        for (i=1; i<numLines; i++) {
            document.getElementById("lineNumbers").innerText += i.toString() + "\n";
        }
        // make 2nd button visible if displayed text is getting long
        if (numLines>10) {
            document.getElementById("createFile2").style.visibility = "visible";
        }
        // remove placeholder text once user starts entering text/commands
        if (editedInputAlready === false) {
            editedInputAlready = true;
            document.getElementById("inputStr").placeholder = "";
        }
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

function identifyCommand(command) {
    var labelOutput = fullOutputString; // document.getElementById("outputStr").innerText;
    var name = "";
    
    // NOTE!  Creating something at a certain line OVERRIDES creating something
    
    // check if creating a line
    var checkIfCreatingLine = command.match(new RegExp(".+ (create |add |insert )(a(n)? )?(.+) at (line |row )(number )?(.+) please"));
    var line, what;
    if (checkIfCreatingLine) {
        line = checkIfCreatingLine[7];
        what = checkIfCreatingLine[4];
        command = "line " + what;
        name = camelCase(line);
        return [command, name];
    } else {
        var checkIfCreatingLine_ALT = command.match(new RegExp(".+ at (line |row )(number )?(.+) (create |add |insert )(a(n)? )?(.+) please"));
        if (checkIfCreatingLine_ALT) {
            line = checkIfCreatingLine_ALT[3];
            what = checkIfCreatingLine_ALT[7];
            command = "line " + what;
            name = camelCase(line);
            return [command, name];
        } else {
            
            // check if creating something basic:
            var createCommandsList = ["variable", "function", "file", "import", "loop", "for loop"];
            for (i=0; i<createCommandsList.length; i++) {
                var commandWord = createCommandsList[i];
                var checkIfCreatingSomething = command.match(new RegExp(".+ (create |add |insert )(a(n)? )?" + commandWord + " (with |named )?(.+) please"));
                if (checkIfCreatingSomething) {
                    command = commandWord;
                    name = camelCase(checkIfCreatingSomething[5]);
                    return [command, name];
                }
            }
            
            var checkIfAddingLastLine = command.match(new RegExp(".+ (create |add )(line |row )please"));
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
            
            // if didn't return values yet, check these other possible commands:
            var checkIfEditingTabs = command.match(/.* (.*) (a(n)? )?(tab|indent)(s)? .*/);
            if (checkIfEditingTabs) {
                var keyWord =  checkIfEditingTabs[1];
                if (keyWord === "increase" || keyWord === "right" || keyWord === "more" || keyWord === "add") {
                    command = "addTab";
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
            
            // return command ID and parameter "name" ("name" = paramater with meaning given by context)
            return [command, name];
            
        }
    }
}

function runCommand([command, name]) {
    var output = fullOutputString; // document.getElementById("outputStr").innerText;
    if (command === "variable") {
        output = createVariable(name, fullOutputString);
    } else if (command === "function") {
        output = createFunction(name, fullOutputString);
    } else if (command === "file") {
        createFile();
    } else if (command === "import") {
        output = createImport(name, fullOutputString);
    } else if (command === "addTab") {
        output = addTab(fullOutputString);
    } else if (command === "removeTab") {
        output = removeTab(fullOutputString);
    } else if (command === "literallyType") {
        output = literallyType(name, fullOutputString);
    } else if (command === "loop" || command === "for loop") {
        output = createLoop(name, fullOutputString);
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
        var numLines = fullOutputString.split("\n").length+1;
        output = createLine(numLines-2, "", fullOutputString); // numLines-1 because need to get last index
    } 
    return output;
}

function checkWhatCreating(args) {
    //code
}

function createVariable(name, labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    return labelOutput + tabs + "var " + name + ";\n";
}

function createFunction(name, labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    return labelOutput + tabs + "function " + name + "(" + ") {\n" + tabs + "\t\n}\n\n";
}

function addTab(labelOutput) {
    currentTabs += 1;
    return labelOutput + "\t";
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

function createFile() {
    // need to get content directly from document element because a button uses this function too
    // (cannot include parameters in function called by event listener that was added to the button)
    var content = fullOutputString; // document.getElementById("outputStr").innerText;
    window.open('data:text/txt;charset=utf-8,' + escape(content));
}

// some commented-out code for future reference (how do I programmatically choose file name?)

//function exportToTxt() {
//    var txt = "Col1,Col2,Col3\nval1,val2,val3";
//    window.open('data:text/txt;charset=utf-8,' + escape(txt));
//}

//document.getElementById('createFile').onclick = function() {                
//    var fileName = "name";
//    var content = "labelOutput";
//    var contentAsTxtData = "data:application/txt;charset=utf-8," + content;
//    this.href = contentAsTxtData;
//    this.target = "_blank"; // open in new tab or window, depending on browser
//    this.download = fileName +".txt";
//    alert("got here");
//};

function createImport(name) {
    var labelOutput = fullOutputString; // document.getElementById("outputStr").innerText;
    // return "import " + name + ";\n" + labelOutput;
    return "$.getScript(\"" + name + ".js\", function() {\n\t//Script loaded but not necessarily executed.\n});\n" + labelOutput;
}

function createLoop(name, labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    return labelOutput + "\n" + tabs + "for (" + name + " = 0; " + name + " < " + name + ".length; " + name + "++) {\n" + tabs + "\t\n}\n";
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
    var lineToDelete = -1;
    // if the string is not a number, then convert it to a number
    if (isNaN(name)) {
        lineToDelete = digits[name];
    } else {
        lineToDelete = parseInt(name);
    }
    // now use that number as the line to delete from labelOutput
    var indexStart = getIndexOfNthSubstring(labelOutput,"\n", lineToDelete - 1);
    var indexStop = getIndexOfNthSubstring(labelOutput,"\n", lineToDelete);
    var splicedOutput = labelOutput.slice(0,indexStart) + labelOutput.slice(indexStop);
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

function createLine(line, what, text) {
    // get line to insert at:
    var indexStart = getIndexOfNthSubstring(text, "\n", line); //text.indexOf("\n",line+1);
    var indexStop = getIndexOfNthSubstring(text, "\n", line); //text.indexOf("\n",line+2);
    // use an almost "recursive" sub-call to create functions:
    // TODO var subCmd = runCommand(identifyCommand("computer create " + what + " please")); // "computer create " + what + " please"; //
    // TODO try making all other create commands have implicit line number indication "at last line" to be able to do this sub-call
    var subCmd = what;
    // get new text:
    // TODO var tabs = "\t".repeat(currentTabs);
    var tabs = "";
    var newText = text.substring(0,indexStart) + "\n" + tabs + subCmd + text.substring(indexStop);
    return newText;
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