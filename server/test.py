import asyncio
import websockets             
import openpyxl
import os
import json
import csv

variablesName = []
project = "../Matlab/DemoCooler2" 

def getEqualiserName(fileName):
    variablesName.append(fileName[:str.find(fileName,"Equaliser")-1])
    return (fileName[:str.find(fileName,"Equaliser")-1])

def readequaliser(file):
    #This reads files and creates .Jason object of the equalisers and send the .Json object like a socket
    #Project files
    equaData = []
    equaliserDoc = open(project + "/" + file, "r" )
    name = getEqualiserName(file)
    for equaliserData in equaliserDoc.readlines():
        equaliserData = equaliserData[:-1].split(",")
        equaData.append(equaliserData)
    return {name : equaData} 

def sendEqualisers():
    EqualisersValues = {}
    equalisers = os.listdir(project)
    for file in equalisers:
        if file[-10:] == "values.txt":
            data  = readequaliser(file)
            EqualisersValues.update(data)
    data = json.dumps(EqualisersValues)
    print(data)

sendEqualisers()