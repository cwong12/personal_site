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

    def __init__(self, vocabDict, vocabList, parseDict):
        super(MyPrompt, self).__init__()

        #dictionaries that are built upon initialization then used for lookups
        #subsequently in questions
        self.vocabDict = vocabDict
        self.vocabList = vocabList
        self.parseDict = parseDict

        #holds the current shuffled list of possible definitions of generated word
        self.definition = []

        #holds the correct definiton
        self.answer = ""

        #answerChoices: [a,b,c,d,e]
        self.answerChoices = []
        self.answerDict = {
            "a" : 0,
            "b" : 1,
            "c" : 2,
            "d" : 3,
            "e" : 4

        }
        self.definitions = []

        for key in self.answerDict.keys():
            self.answerChoices.append(key)

        self.correct = 0
        self.total = 0

    #exit options
    def do_quit(self, args):
        """Quits the program."""
        print ("Quitting.")
        raise SystemExit
    def do_EOF(self, args):
        """Quits the program."""
        print("Quitting.")
        raise SystemExit

    def do_def(self,args):
        """Generate a defintion to match a word to"""
        randInt = random.randint(0,len(self.vocabDict)-1)
        curDef = self.vocabDict[self.vocabList[randInt]]

        print("Definition: " + curDef + "\n")
        words = []

        correctWord = self.vocabList[randInt]
        words.append(correctWord)

    #generate a word to define
    def do_q(self, args):
        """Generates a vocab question from dictionary. Then type command ans <letter choice>"""
        mode = random.randint(0,1)
        #if mode = 1 supply a word and ask for definition, otherwise supply definion

        #generate a word to test
        randInt = random.randint(0,len(self.vocabDict)-1)
        curWord = self.vocabList[randInt]
        curDef = self.vocabDict[self.vocabList[randInt]]
        curParse = self.parseDict[curWord]


        answers = []

        #start question, randomly selecting between which type
        if(mode == 1):
            print("Define: " + curWord + "\n")
            answers.append(curDef)
            self.answer = curDef

        else:
            print("Definition: " + curDef + "\n")
            answers.append(curWord)
            self.answer = curWord

        #generate other incorrect choices with same parsing

        while(len(answers) < len(self.answerChoices)):

            choicesInt = random.randint(0,len(self.vocabDict)-1)

            newWord = self.vocabList[choicesInt]

            newParse = self.parseDict[newWord]

            newAns  = ""
            if (curParse == newParse):
                if (mode == 1):
                    newAns = self.vocabDict[self.vocabList[choicesInt]]
                else:
                    newAns = self.vocabList[choicesInt]
                if newAns not in answers:
                    answers.append(newAns)

        random.shuffle(answers)

        choiceInd = 0
        for choice in answers:
            print(self.answerChoices[choiceInd] + ") " + answers[choiceInd])
            choiceInd += 1

        self.definitions = answers
        print()

    #shortcuts
    def do_a(self,args):
        self.do_ans("a")
    def do_b(self,args):
        self.do_ans("b")
    def do_c(self,args):
        self.do_ans("c")
    def do_d(self,args):
        self.do_ans("d")
    def do_e(self,args):
        self.do_ans("e")
    def do_s(self,args):
        self.do_score(args)
    def do_r(self,args):
        self.correct = 0
        self.total = 0

    #after generating a word, take in user answer and check whether the answer provided is correct
    def do_ans(self, args):
        """type ans <letter choice> to select definition"""
        self.total += 1

        #make sure the user has generated a word first before attempting to answer
        if (self.answer != ""):
            #validate answer
            if (len(args) == 1 and args in self.answerChoices):
                ansInt = self.answerDict[args]
                #print(ansInt)
                #look at list of definitions and get the index of the correct answer
                correctAnsIndex = self.definitions.index(self.answer)
                if (ansInt == correctAnsIndex):
                    print("Correct!" + "\n\n")
                    self.do_q(args)
                    self.correct += 1
                else:
                    print("Incorrect:(")
            else:
                print("Invalid answer")
        else:
            print("Type 'word' to generate a question")

    def do_score(self, args):
        print("You have answered " + str(self.correct) + "/" + str(self.total) + " correctly")





def launchREPL():

    vocabDict, vocabList, parseDict = buildDictionary()
    prompt = MyPrompt(vocabDict, vocabList, parseDict)

    prompt.prompt = '> '
    prompt.cmdloop('Starting vocab shell... Type "help" for help, "quit" or EOF to exit')


def buildDictionary():
    vocabDict = {}
    vocabList = []
    parseDict = {}

    with open('GREVocab.csv') as csv_file:
        csv_reader = csv.reader(csv_file)#, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if(line_count != 0):

                parseDict[row[0]] = row[2]
                vocabDict[row[0]] = row[1]
                vocabList.append(row[0])

            else:
                line_count += 1
    return vocabDict, vocabList, parseDict

launchREPL()
