import asyncio
import websockets             
import openpyxl
import os
import json
import csv
import socket

#ports to send the data
portNodes     = 30000
portEdges     = 30001
portequaliser = 30002
portMatlab    = 30003
#variables name
variablesName   = []
variablesValues = {}

#socketMatlab  = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
#connectionMatlab = socketMatlab.connect(('localhost',portMatlab))

#project folder direction
project = "./Matlab/DemoCooler2" 

def getEqualiserName(fileName):
    name = fileName[:str.find(fileName,"Equaliser")-1]
    f = open(project + "/InputData_" + name.replace("_","")+".txt","r")
    value = f.readline()
    variablesValues.update({name : value})
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
           

def createNodes():
    with open(project+"/ejemplocooler_node.csv") as nodes:
        nodes = list(csv.DictReader(nodes, delimiter=';'))
        namefile = project + "/" + "Workbook1.xlsx"
        nameDoc = openpyxl.load_workbook(namefile)
        nameSheet = nameDoc.get_sheet_by_name('Sheet1')
        i = 2
        for reader in nodes:
            reader['Label'] = nameSheet.cell(row = i,column=3).value
            i+=1
            if int(reader['Id']) <= 5:
                reader.update({"type":0})
            elif int(reader['Id']) <= 12:
                reader.update({"type":1})
            elif int(reader['Id']) <= 43:
                reader.update({"type":2})
            else:
                reader.update({"type":3})
    return json.dumps(nodes)

def createEdges():
    with open(project+"/ejemplocooler_edge.csv") as edges:
        reader = list(csv.DictReader(edges, delimiter=';'))
    return json.dumps(reader)

async def sendNodes(websocket, path):
    await websocket.send(createNodes())

async def sendEdges(websocket, path):
    await websocket.send(createEdges())
    
async def sendEqualisers(websocket, path):
    print("1")
    EqualisersValues = {}
    equalisers = os.listdir(project)
    for file in equalisers:
        if file[-10:] == "values.txt":
            data  = readequaliser(file)
            EqualisersValues.update(data)
    EqualisersValues.update({"values":variablesValues})
    data = json.dumps(EqualisersValues)
    await websocket.send(data)

start_server1 = websockets.serve(sendNodes,'localhost', portNodes)
asyncio.get_event_loop().run_until_complete(start_server1)

start_server2 = websockets.serve(sendEdges,'localhost', portEdges)
asyncio.get_event_loop().run_until_complete(start_server2)

start_server3 = websockets.serve(sendEqualisers,'localhost', portequaliser)
asyncio.get_event_loop().run_until_complete(start_server3)

asyncio.get_event_loop().run_forever()
