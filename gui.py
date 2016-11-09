from Tkinter import * # to be able to create a GUI
import brain # the connection to brain.py

def parseCommand(command):
    # check that sentence entered is "computer [...] please"
    firstWord = command.split(" ")[0]
    lastWord = command.split(" ")[-1]
    if firstWord == "computer" and lastWord == "please" and len(command) > 3:
        # get "brain" to run command, update output text, and clear the sentence that was entered
        output = brain.parse(command, labelOutput["text"])
        outputStr.set(output)
        inputStr.set("")

# create window
window = Tk()
window.wm_title("Voice Command Programmer")

# add input Entry to window
inputStr = StringVar()
inputStr.trace("w", lambda name, index, mode, inputStr=inputStr: parseCommand(entryInput.get()))
entryInput = Entry(window, textvariable=inputStr)
entryInput.pack(side=LEFT)

# add output Label to window
outputStr = StringVar()
labelOutput = Label(window, textvariable=outputStr, justify=LEFT)
labelOutput.pack(side=RIGHT)

# run window
window.mainloop()