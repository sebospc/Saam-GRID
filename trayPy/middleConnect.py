from flask import Flask
from flask import request
from flask import jsonify
import json
import csv
import openpyxl
import sys
import os
import jwt
import datetime

app = Flask(__name__)



generatedFilesFolder = "" 

variablesValues = {}

@app.route('/getToken', methods=['GET'])
def getToken():
    print("hello")
    


@app.route('/')
def index():
    return "Hello, World!"

@app.route('/hello', methods=['POST'])
def hello():
    
    print("valor: headers", request.headers)
    print("valor: body", request.form)
    print("valor: body", request.data)
    #print(request.get_json()["some"])
    data = {'name': 'nabin khadka'}
    return jsonify(data), 200



@app.route('/getNodes', methods=['GET'])
def getNodes():
    print("genen: ",generatedFilesFolder,"/ejemplocooler_node.csv")
    with open(generatedFilesFolder+"/ejemplocooler_node.csv") as nodes:
        nodes = list(csv.DictReader(nodes, delimiter=';'))
        namefile = generatedFilesFolder + "/" + "Workbook1.xlsx"
        nameDoc = openpyxl.load_workbook(namefile)
        nameSheet = nameDoc['Sheet1']
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
    return jsonify(nodes),200

@app.route('/getEdges', methods=['GET'])
def getEdges():
    with open(generatedFilesFolder+"/ejemplocooler_edge.csv") as edges:
        reader = list(csv.DictReader(edges, delimiter=';'))
    return json.dumps(reader)
    


@app.route('/getEqualiser', methods=['GET'])
def getEqualiser():
    EqualisersValues = {}
    equalisers = os.listdir(generatedFilesFolder)
    for file in equalisers:
        if file[-10:] == "values.txt":
            data  = readequaliser(file)
            EqualisersValues.update(data)
    EqualisersValues.update({"values":variablesValues})
    return json.dumps(EqualisersValues), 200

def readequaliser(file):
    #This reads files and creates .Json object of the equalisers and send the .Json object like a socket
    #Project files
    equaData = []
    equaliserDoc = open(generatedFilesFolder + "/" + file, "r" )
    name = getEqualiserName(file)
    for equaliserData in equaliserDoc.readlines():
        equaliserData = equaliserData[:-1].split(",")
        equaData.append(equaliserData)
    return {name : equaData} 

def getEqualiserName(fileName):
    name = fileName[:str.find(fileName,"Equaliser")-1]
    f = open(generatedFilesFolder + "/InputData_" + name.replace("_","")+".txt","r")
    value = f.readline()
    variablesValues.update({name : value})
    return (fileName[:str.find(fileName,"Equaliser")-1])

@app.route('/updateEqualiser', methods=['POST'])
def updateEqualiser():
    #print("headers", request.headers)
    #print("valor: name", request.data["name"])
    body = json.loads(request.get_data())
    print("name", body["name"])
    print("valor", body["value"])
    return "done",200


@app.route('/exit', methods=['GET'])
def exit():
    os._exit(0)

if __name__ == '__main__':
    generatedFilesFolder = sys.argv[2]
    firstTime = True
    app.run(debug=True,port=sys.argv[1])