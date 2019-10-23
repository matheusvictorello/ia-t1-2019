import os
import sys
from ast import literal_eval
from random import randint
import json

casos = {
	"caso1" : {
			"NOME" : "caso1",
			"X" : 0, 
			"Y" : 0, 
			"LX" : 10, 
			"LY" : 5, 
			"FOCOS" : [[8, 0], [9, 4]], 
			"EXTINTORES" : [[1, 2]], 
			"PAREDES" : [[2, 2], [6, 4]], 
			"BLOQUEIOS" : [[3, 1], [6, 1], [3, 3], [6, 3], [5, 4]], 
			"ESCADAS" : [[4, 0], [8, 1], [0, 2], [9, 2], [2, 3], [4, 3], [8, 3]]
			},
	"caso2" : {
			"NOME" : "caso2",
			"X" : 0, 
			"Y" : 0, 
			"LX" : 10, 
			"LY" : 5, 
			"FOCOS" : [[8, 0], [9, 0], [1, 4], [9, 4]], 
			"EXTINTORES" : [[1, 2], [2, 2]], 
			"PAREDES" : [[3, 2], [6, 4]], 
			"BLOQUEIOS" : [[2, 0], [5, 1], [6, 1], [3, 3], [6, 3], [5, 4]], 
			"ESCADAS" : [[4, 0], [7, 0], [0, 1], [9, 2], [2, 3], [4, 3], [8, 3]]
			},
	"caso3" : {
			"NOME" : "caso3",
			"X" : 0, 
			"Y" : 0, 
			"LX" : 10, 
			"LY" : 5, 
			"FOCOS" : [[9, 0], [1, 4], [7, 4], [9, 4]], 
			"EXTINTORES" : [[0, 3], [5, 2]], 
			"PAREDES" : [[5, 0], [4, 2]], 
			"BLOQUEIOS" : [[2, 0], [2, 1], [5, 1], [6, 1], [5, 3], [5, 4]], 
			"ESCADAS" : [[4, 0], [8, 0], [0, 1], [7, 1], [3, 2], [9, 2], [2, 3], [8, 3]]
			},
	"caso4" : {
			"NOME" : "caso4",
			"X" : 0, 
			"Y" : 0, 
			"LX" : 10, 
			"LY" : 5, 
			"FOCOS" : [[4, 0], [1, 2], [7, 4]], 
			"EXTINTORES" : [[6, 0], [5, 2]], 
			"PAREDES" : [[5, 0], [4, 2]], 
			"BLOQUEIOS" : [[1, 0], [2, 1], [9, 1], [5, 3], [1, 4], [5, 4]], 
			"ESCADAS" : [[3, 0], [8, 0], [0, 1], [6, 1], [3, 2], [9, 2], [2, 3], [8, 3]]
			},
	"casoJ" : {
			"NOME" : "casoJ",
			"X" : 0, 
			"Y" : 2, 
			"LX" : 10, 
			"LY" : 5, 
			"FOCOS" : [[1, 0], [8, 1], [9, 2], [0, 3], [8, 3], [9, 4]],
			"EXTINTORES" : [[7, 0], [0, 1], [0, 4]], 
			"PAREDES" : [[0, 0], [6, 0], [5, 4]], 
			"BLOQUEIOS" : [[3, 0], [2, 2], [7, 2]], 
			"ESCADAS" : [[5, 0], [9, 0], [4, 1], [5, 2], [1, 3], [6, 3]]
			},
	"caso" : {
			"NOME" : "caso",
			"X" : 0, 
			"Y" : 0, 
			"LX" : 10, 
			"LY" : 5, 
			"FOCOS" : [[1, 1]],
			"EXTINTORES" : [[2, 0]], 
			"PAREDES" : [], 
			"BLOQUEIOS" : [[4, 1], [3, 2]], 
			"ESCADAS" : [[3, 0]]
			}
}

def genCaso(blocks):
	params = f"({str(blocks['X'])}, {str(blocks['Y'])}, 0, {str(blocks['FOCOS'])}, {str(blocks['EXTINTORES'])}, \"Comeco\")"
	constants = ""

	for campo in blocks:
		value = blocks[campo]

		if campo == "LX":
			constants += f"limitX({value}).\n"
		elif campo == "LY":
			constants += f"limitY({value}).\n\n"
		elif campo == "PAREDES":
			for parede in value:
				constants += f"parede({str(parede[0])}, {str(parede[1])}).\n"
			if value == []:
				constants += f"parede(-1, -1).\n"
			constants += "\n"
		elif campo == "BLOQUEIOS":
			for bloqueio in value:
				constants += f"bloqueio({str(bloqueio[0])}, {str(bloqueio[1])}).\n"
			if value == []:
				constants += f"bloqueio(-1, -1).\n"
			constants += "\n"
		elif campo == "ESCADAS":
			for escada in value:
				constants += f"escada({str(escada[0])}, {str(escada[1])}).\n"
			if value == []:
				constants += f"escada(-1, -1).\n"
			constants += "\n"

	params = f'''
escadaDesce(X, Y) :- 
	NY is Y - 1,
	escada(X, NY).

run(Invertida) :-
	solucao_bl({params}, Solucao),
	inverte_lista(Solucao, Invertida, []).'''

	caso = open("prolog/casos/" + blocks["NOME"] + ".pl", "w")
	caso.write(constants)
	caso.write(params)
	caso.close()

	inn = open("prolog/in", "w")
	inn.write(f"[prolog/casos/" + blocks["NOME"] + ", prolog/solver].\nrun(S).\nw\n.")
	inn.close()

def runProlog():
	cmd = "time swipl --stack_limit=4g --table_space=2g < prolog/in > prolog/out"
	os.system(cmd)

def getData():
	out = open("prolog/out", "r")
	outData = out.read()
	out.close()

	try:
		data = outData.split('S = ')[2]

		temp = open("temp", "w")
		temp.write(data)
		temp.close()

		data = data.replace('(', '[').replace(')', ']')
		parsed = literal_eval(data)

		return parsed
	except:
		pass

def solutionOf(casoDict):
	print("solutionOf")
	genCaso(casoDict)
	runProlog()
	return getData()

if __name__ == "__main__":
	casoDict = casos[sys.argv[1]]
	caminho = solutionOf(casoDict)

	if caminho:
		passos = 0

		for i in caminho:
			passos += 1
			print(i, end="")
			print(",")

		print(f"Passos: {passos}")
	else:
		print("False")