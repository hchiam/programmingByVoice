import re

currentTabs = 0

# parse is the main function here in the brain, and calls the other functions
def parse(command, labelOutput):
    # initialize variables
    print command
    words = command.split(" ")
    output = labelOutput
    createCommandsList = ["variable", "function", "file", "import"]
    editTabCommandsList = ["increase", "decrease", "left", "right", "more", "less", "add", "remove"]
    # go through possible command keywords
    checkIfCreatingSomething = re.match(r'.* create .*', command, re.I)
    if checkIfCreatingSomething:
        for keyword in createCommandsList:
            matchFound = re.match( r'.* (create )?(a(n)? )?' + keyword +' (.*) .*', command, re.I)
            if matchFound:
                name = camelCase(matchFound.group(4))
                if keyword == "variable":
                    output = createVariable(name, labelOutput)
                elif keyword == "function":
                    output = createFunction(name, labelOutput)
                elif keyword == "file":
                    output = createFile(name, labelOutput)
                elif keyword == "import":
                    output = createImport(name, labelOutput)
                break
    else:
        checkIfEditingTabs = re.match(r'.* tab(s)? .*', command, re.I)
        checkIfEditingIndents = re.match(r'.* indent(s)? .*', command, re.I)
        if checkIfEditingTabs or checkIfEditingIndents:
            for keyword in editTabCommandsList:
                matchFound = re.match( r'.* ' + keyword + '(a(n)? )?tab(s)? .*', command, re.I)
                if matchFound:
                    name = matchFound.group(1)
                    if keyword == "increase" or keyword == "right" or keyword == "more" or keyword == "add":
                        output = addTab(labelOutput)
                    elif keyword == "decrease" or keyword == "left" or keyword == "less" or keyword == "remove":
                        output = removeTab(labelOutput)
                    break
                matchFound = re.match( r'.* (a(n)? )?tab(s)? ' + keyword + '.*', command, re.I)
        else:
            checkForLiteralTyping = re.match(r'.* (literally )?type (.*) please', command, re.I)
            if checkForLiteralTyping:
                literalText = checkForLiteralTyping.group(2)
                output = literallyType(literalText, labelOutput)
    return output

def createFile(name, labelOutput):
    import io
    with io.FileIO(name + ".py", "w") as file:
        file.write(labelOutput)
    return labelOutput

def createVariable(name, labelOutput):
    tabs = ("\t" * currentTabs)
    return labelOutput + tabs + name + "\n"

def createFunction(name, labelOutput):
    global currentTabs
    currentTabs += 1
    return labelOutput + "def " + name + "(" + "):\n\t"

def createImport(name, labelOutput):
    return "import " + name + "\n" + labelOutput

def addTab(labelOutput):
    return labelOutput + "\t"

def removeTab(labelOutput):
    return labelOutput.rstrip('\t')

def literallyType(literalText, labelOutput):
    return labelOutput + literalText

def camelCase(name):
    words = name.split(" ")
    name = words[0]
    for word in words[1:]:
        name += word.capitalize()
    return name