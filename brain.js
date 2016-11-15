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
        document.getElementById("outputStr").innerText = runCommand(identifyCommand(command)); /* <- THIS IS THE KEY LINE IN THIS FUNCTION */
        // clear the sentence that was entered
        document.getElementById("inputStr").value = "";
        // update line numbers:
        var numLines = document.getElementById("outputStr").innerText.match(/\n/g).length;
        document.getElementById("lineNumbers").innerText = "";
        for (i=1; i<=numLines; i++) {
            document.getElementById("lineNumbers").innerText += i.toString() + "\n";
        }
    }
    // make 2nd button visible if displayed text is getting long
    var labelOutput = document.getElementById("outputStr").innerText;
    var numberOfLines = labelOutput.split("\n").length;
    if (numberOfLines>10) {
        document.getElementById("createFile2").style.visibility = "visible";
    }
    // remove placeholder text once user starts entering text/commands
    if (editedInputAlready === false) {
        editedInputAlready = true;
        document.getElementById("inputStr").placeholder = "";
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
    var labelOutput = document.getElementById("outputStr").innerText;
    var name = "";
    // check if creating something:
    var createCommandsList = ["variable", "function", "file", "import", "loop", "for loop"];
    for (i=0; i<createCommandsList.length; i++) {
        var commandWord = createCommandsList[i];
        var checkIfCreatingSomething = command.match(new RegExp(".* (create |add )(a(n)? )?" + commandWord + " (with |named )?(.+) please"));
        if (checkIfCreatingSomething) {
            command = commandWord;
            name = camelCase(checkIfCreatingSomething[5]);
            return [command, name];
        }
    }
    // check if deleting a character:
    var checkIfDeletingLastChar = command.match(new RegExp(".* delete (that |the )?(last |previous )?(character |letter |number |one )?please"));
    if (checkIfDeletingLastChar) {
        command = "delete LAST CHAR";
        return [command, name];
    }
    // check if deleting a line:
    var checkIfDeletingLastLine = command.match(new RegExp(".* delete (that |the )?(last |previous |whole )?(line |row )please"));
    if (checkIfDeletingLastLine) {
        command = "delete LAST LINE";
        return [command, name];
    }
    // check if editing a function:
    var checkIfEditingFunction = command.match(new RegExp(".* (change |edit )(that |the )?function (called )?(.+) please"));
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
        var checkForLiteralTyping = command.match(/.* (literally )?type (.+) please/);
        if (checkForLiteralTyping) {
            var literalText = checkForLiteralTyping[2];
            command = "literallyType";
            name = literalText;
        } else {
            var checkIfImporting = command.match(/.* import (.+) please/);
            if (checkIfImporting) {
                command = "import";
                name = camelCase(checkIfImporting[1]);
            }
        }
    }
    return [command, name];
}

function runCommand([command, name]) {
    var labelOutput = document.getElementById("outputStr").innerText;
    var output = labelOutput;
    if (command === "variable") {
        output = createVariable(name, labelOutput);
    } else if (command === "function") {
        output = createFunction(name, labelOutput);
    } else if (command === "file") {
        createFile();
    } else if (command === "import") {
        output = createImport(name, labelOutput);
    } else if (command === "addTab") {
        output = addTab(labelOutput);
    } else if (command === "removeTab") {
        output = removeTab(labelOutput);
    } else if (command === "literallyType") {
        output = literallyType(name, labelOutput);
    } else if (command === "loop" || command === "for loop") {
        output = createLoop(name, labelOutput);
    } else if (command === "delete LAST CHAR") {
        output = deleteLastChar(labelOutput);
    } else if (command === "delete LAST LINE") {
        output = deleteLastLine(labelOutput);
    } else if (command === "edit FUNCTION") {
        output = editFunction(name, labelOutput);
    }
    return output;
}

function createVariable(name, labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    return labelOutput + tabs + "var " + name + ";\n";
}

function createFunction(name, labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    return labelOutput + "\n" + tabs + "function " + name + "(" + ") {\n" + tabs + "\t\n}\n";
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
    return labelOutput + tabs + literalText;
}

function createFile() {
    // need to get content directly from document element because a button uses this function too
    // (cannot include parameters in function called by event listener that was added to the button)
    var content = document.getElementById("outputStr").innerText;
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
    var labelOutput = document.getElementById("outputStr").innerText;
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
    return labelOutput.slice(0, labelOutput.lastIndexOf("\n"));
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

function camelCase(name) {
    var words = name.split(" ");
    name = words[0];
    for (i=1; i<words.length; i++) {
        name += words[i][0].toUpperCase() + words[i].slice(1);
    }
    return name;
}