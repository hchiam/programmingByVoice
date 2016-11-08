from Tkinter import *
import brain

def parseCommand(words):
    command = words.split(" ")
    command = filter(None, command) # remove extraneous spaces
    firstWord = command[0]
    lastWord = command[-1]
    if firstWord == "computer" and lastWord == "please" and len(command) > 3:
        output = brain.run(command[1:-1], labelOutput["text"])
        inputStr.set("")
        outputStr.set(outputStr.get() + output)

window = Tk()

outputStr = StringVar()
labelOutput = Label(window, textvariable=outputStr, justify=LEFT)
labelOutput.pack(side=RIGHT)

inputStr = StringVar()
inputStr.trace("w", lambda name, index, mode, inputStr=inputStr: parseCommand(entryInput.get()))
entryInput = Entry(window, textvariable=inputStr)
entryInput.pack(side=LEFT)

window.mainloop()