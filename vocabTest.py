#!/usr/bin/python
import sys
#import string
import os
import math
import random
import csv
import matplotlib.pyplot as plt


from cmd import Cmd

class MyPrompt(Cmd):


    def __init__(self, vocabDict, vocabList):
        super(MyPrompt, self).__init__()
        self.vocabDict = vocabDict
        self.vocabList = vocabList

        self.definition = ""
        self.answer = ""
        self.answerChoices = []
        self.answerDict = {
            "a" : 0,
            "b" : 1,
            "c" : 2,
            "d" : 3,
            "e" : 4

        }
        for key in self.answerDict.keys():
            self.answerChoices.append(key)

    def do_hello(self, args):
        """Says hello. If you provide a name, it will greet you with it."""
        if len(args) == 0:
            name = 'stranger'
        else:
            name = args
        print ("Hello, %s" % name)

    def do_quit(self, args):
        """Quits the program."""
        print ("Quitting.")
        raise SystemExit
    def do_word(self, args):
        #print("Answer>")
        randInt = random.randint(0,len(self.vocabDict)-1)
        curWord = self.vocabList[randInt]
        print("Define: " + curWord + "\n")
        choices = []

        correctAns = self.vocabDict[self.vocabList[randInt]]
        choices.append(correctAns)
        self.answer = correctAns

        while(len(choices) < len(self.answerChoices)):
            choicesInt = random.randint(0,len(self.vocabDict)-1)
            newWord = self.vocabDict[self.vocabList[choicesInt]]
            if newWord not in choices:
                choices.append(newWord)
        random.shuffle(choices)
        choiceInd = 0
        for choice in choices:
            print(self.answerChoices[choiceInd] + ") " + choices[choiceInd])
            choiceInd += 1

    def do_ans(self, args):
        if (len(args) == 1 and args in self.answerChoices):
            ansInt = self.answerDict[args]
            print(ansInt)
        else:
            print("Invalid answer")


def launchREPL():

    vocabDict, vocabList = buildDictionary()
    prompt = MyPrompt(vocabDict, vocabList)

    prompt.prompt = '> '
    prompt.cmdloop('Starting prompt...')
    # print(scope_vars)

def hi():
    return "hello"

def returnWord(vocabDict,num):
    randInt = random.randint(0,len(vocabDict))
    return num, len(vocabDict)

def buildDictionary():
    vocabDict = {}
    vocabList = []

    with open('GREVocab.csv') as csv_file:
        csv_reader = csv.reader(csv_file)#, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if(line_count != 0):
                # print(row)
                # print(row[0])
                vocabDict[row[0]] = row[1]
                vocabList.append(row[0])
            else:
                line_count += 1
    #print(vocabDict["nebulous"])
    return vocabDict, vocabList

# vocabDict = buildDictionary()

launchREPL()


#print(vocabDict)
