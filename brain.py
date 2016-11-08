def run(command, labelOutput):
    # initialize variables
    print command
    output = ""
    # consult command dictionary
    if command[0] == "create":
        name = command[2]
        if command[1] == "file":
            output = createFile(name, labelOutput)
        elif command[1] == "variable":
            output = createVariable(name)
        elif command[1] == "function":
            output = createFunction(name)
    return output

def createFile(name, labelOutput):
    import io
    with io.FileIO(name + ".py", "w") as file:
        file.write(labelOutput)
    return ""

def createVariable(name):
    return name + "\n"

def createFunction(name):
    return "def " + name + "(" + "):\n\t"