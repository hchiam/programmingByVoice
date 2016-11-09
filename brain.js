var currentTabs = 0;

// parseCommand is the main function here in the brain, and calls the other functions
function parseCommand() {
    // initialize variables
    var command = document.getElementById("inputStr").value;
    var checkValid = checkValidCommand(command);
    // check if command is in valid form (in case of noise or incorrect entry)
    if (checkValid) {
        // identify command, run command, update output text, and clear the sentence that was entered
        document.getElementById("outputStr").innerText = runCommand(identifyCommand(command));
        document.getElementById("inputStr").value = "";
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
    var createCommandsList = ["variable", "function", "file", "import"];
    for (i=0; i<createCommandsList.length; i++) {
        var commandWord = createCommandsList[i];
        var checkIfCreatingSomething = command.match(new RegExp(".* create (a(n)? )?" + commandWord + " (.+) please"));
        if (checkIfCreatingSomething) {
            command = commandWord;
            name = camelCase(checkIfCreatingSomething[3]);
            return [command, name];
        }
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
        createFile(name, labelOutput);
    } else if (command === "import") {
        output = createImport(name, labelOutput);
    } else if (command === "addTab") {
        output = addTab(labelOutput);
    } else if (command === "removeTab") {
        output = removeTab(labelOutput);
    } else if (command === "literallyType") {
        output = literallyType(name, labelOutput);
    }
    return output;
}

function createVariable(name, labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    return labelOutput + tabs + name + "\n";
}

function createFunction(name, labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    currentTabs += 1;
    return labelOutput + tabs + "function " + name + "(" + "){\n" + tabs + "\t\n}\n";
}

function addTab(labelOutput) {
    currentTabs += 1;
    return labelOutput + "\t";
}

function removeTab(labelOutput) {
    currentTabs -= 1;
    return labelOutput.slice(0, -1);
}

function literallyType(literalText, labelOutput) {
    var tabs = "\t".repeat(currentTabs);
    return labelOutput + tabs + literalText;
}

function createFile(name, labelOutput) {
    alert("got in");
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    alert("got here");
    var a = fso.CreateTextFile("c:\\testfile.txt", true);
    a.WriteLine("This is a test.");
    a.Close();
    alert("got to end");
}

function createImport(name) {
    var labelOutput = document.getElementById("outputStr").innerText;
    return "import " + name + "\n" + labelOutput;
}

function camelCase(name) {
    var words = name.split(" ");
    name = words[0];
    for (i=1; i<words.length; i++) {
        name += words[i][0].toUpperCase() + words[i].slice(1);
    }
    return name;
}