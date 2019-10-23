// Tamanho do grid
var BLOCK_SIZE = 100;
var BLOCK_SIZE_HALF = BLOCK_SIZE/2;
var BLOCK_SIZE_QUARTER = BLOCK_SIZE/4;

// Tipo do bloco sendo usado
var brush = 'NADA';

// Tamanho do grid
var sizeX = 10;
var sizeY = 5;

// Auxiliar
var canvas;
var canvasPos;

// Blocos do grid
var matrix = [];

// Sonico
var sonico;

// Controladores dos gifs
var fogoControler;
var extintorControler;
var escadaControler;
var paredeControler;
var bloqueioControler;

// Lista de terafas
var tarefas = null;

// Flag
var executing = false;

// Timming de sincronização dos gifs
var startT = 1000;
var walkT = 300;
var apagaT = 1650;
var tapaT = 2600;
var dyingT = 8200;

function setup() {
	// Salvando o canvas
	canvas = createCanvas(sizeX*BLOCK_SIZE, sizeY*BLOCK_SIZE);

	// Grossura da linha
	strokeWeight(2);

	// Popula a matriz
	matrix = new Array(sizeX).fill([]);
	for (var i = 0; i < sizeX; i++) {
		matrix[i] = new Array(sizeY).fill('NADA');
	}

	// Controladores das imagens
	fogoControler =     new Controler(20, gFogoPath, "Fogo");
	extintorControler = new Controler(20, iExtintorPath, "Extintor");
	
	paredeControler =   new Controler(20, iParedePath, "Parede");
	bloqueioControler = new Controler(20, iBloqueioPath, "Bloqueio");
	escadaControler =   new Controler(20, iEscadaPath, "Escada", 0, BLOCK_SIZE_HALF);

	sonico = new Sonico();
}

// Callback para receber as tarefas do servidor
function setTarefas(newTarefas) {
	tarefas = newTarefas;

	// Verifica se a lista de tarefas está vazia
	if (tarefas != 'Fail') {
		gerente(0);
	} else {
		sonico.dead();
	}
}

// Inicia a solução de um novo caso
function start() {
	if (!executing) {
		var state = sonico.state;

		if (state == "parado" || state == "win" || state == "dead") { 
			sonico.reset();
			executing = true;
			response(makeMatrixDict(), setTarefas);
		}
	}
}

// Inicia a solução do último caso
function restart() {
	if (!executing) {
		var state = sonico.state;

		if (state == "parado" || state == "win" || state == "dead") { 
			sonico.reset();
			executing = true;

			// Verifica se a lista de tarefas está vazia
			if (tarefas != 'Fail') {
				gerente(0);
			} else {
				sonico.dead();
			}
		}
	}
}

// Zera o cenário
function refresh() {
	var state = sonico.state;

	if (state == "parado" || state == "win" || state == "dead") { 
		// Zera as listas de gifs/imagens
		fogoControler.attActive([]);
		extintorControler.attActive([]);
		paredeControler.attActive([]);
		bloqueioControler.attActive([]);
		escadaControler.attActive([]);

		sonico.reset();

		tarefas = null;
		executing = false;

		for (var i = 0; i < sizeX; i++) {
			for (var j = 0; j < sizeY; j++) {
				matrix[i][j] = 'NADA';
			}
		}
	}
}

// Gerencia as tarefas e timming dos gifs
function gerente(i) {
	if (tarefas[i]) {
		var x = tarefas[i][0];
		var y = tarefas[i][1];
		var focos = tarefas[i][3];
		var extintores = tarefas[i][4];
		var action = tarefas[i][5];

		var timeout;

		if (action == "Comeco") {
			// Define a lista de focos ativos
			fogoControler.attActive(focos);
			// Define a lista de extintores ativos
			extintorControler.attActive(extintores);
			// Define o timeout da ação
			timeout = startT;
		} else if (action == "Anda") {
			fogoControler.attActive(focos);
			extintorControler.attActive(extintores);
			// Movimenta o sonico
			sonico.walk(x, y);
			timeout = walkT;
		} else if (action == "Pega") {
			fogoControler.attActive(focos);
			// Atrasa a atualização dos extintores
			setTimeout(function() {
				extintorControler.attActive(extintores);
			}, apagaT);
			sonico.pega(x, y);
			timeout = tapaT;
		} else if (action == "Apaga") {
			// Atrasa a atualização dos focos
			setTimeout(function() {
				fogoControler.attActive(focos);
			}, apagaT);
			extintorControler.attActive(extintores);
			sonico.apaga(x, y);
			timeout = tapaT;
		}

		// Chama a proxima ação
		setTimeout(function() {
			gerente(i+1);
		}, timeout);
	// Se a lista acabou
	} else {
		// Atualiza o estado do sonico
		sonico.win();
		// Reseta a flag
		executing = false;
	}
}

// Converte as informações do grid para um dict, para que possa ser enviado ao servidor
function makeMatrixDict(argument) {
	var info = {
		"NOME" : "casoJS",
		"X" : sonico.baseX, 
		"Y" : sonico.baseY, 
		"LX" : sizeX, 
		"LY" : sizeY, 
		"FOCOS" : [], 
		"EXTINTORES" : [], 
		"PAREDES" : [], 
		"BLOQUEIOS" : [], 
		"ESCADAS" : []
	}

	for (var i = 0; i < sizeX; i++) {
		for (var j = 0; j < sizeY; j++) {
			if (matrix[i][j] == 'FOGO') {
				info['FOCOS'].push([i, j]);
			} else if (matrix[i][j] == 'EXTINTOR') {
				info['EXTINTORES'].push([i, j]);
			} else if (matrix[i][j] == 'ESCADA') {
				info['ESCADAS'].push([i, j]);
			} else if (matrix[i][j] == 'BLOQUEIO') {
				info['BLOQUEIOS'].push([i, j]);
			} else if (matrix[i][j] == 'PAREDE') {
				info['PAREDES'].push([i, j]);
			}
		}
	}

	return info;
}

// Desenha a grade do grid
function drawGrid() {
	stroke(0);

	for (var i = 0; i <= sizeX; i++) {
		var x = i * BLOCK_SIZE;
		line(x, 0, x, sizeY * BLOCK_SIZE);
	}

	for (var i = 0; i <= sizeY; i++) {
		var y = i * BLOCK_SIZE;
		line(0, y, sizeX * BLOCK_SIZE, y);
	}
}

function draw() {
	// Atualiza a posição do canvas
	canvasPos = canvas.position();

	// Fundo do canvas
	background(255);

	// Desenha as linhas do grid
	drawGrid();

	// Atualiza o Sonico
	sonico.update();

	// Atualiza as posições dos blocos
	fogoControler.update();
	extintorControler.update();
	escadaControler.update();
	paredeControler.update();
	bloqueioControler.update();
}

function mouseClicked() {
	// Converte as coordenadas para posições no grid
	var xi = Math.floor(mouseX/BLOCK_SIZE);
	var yi = Math.floor(mouseY/BLOCK_SIZE);

	// Verifica se então dentro do grid
	if (xi >= 0 && xi < sizeX && yi >= 0 && yi < sizeY) {
		// Bloco que está na casa
		var aux = matrix[xi][yi];

		// Remove o bloco da respectiva lista de ativos
		if (aux == 'FOGO') {
			fogoControler.removeActive([xi, yi]);
		} else if (aux == 'EXTINTOR') {
			extintorControler.removeActive([xi, yi]);
		} else if (aux == 'ESCADA') {
			escadaControler.removeActive([xi, yi]);
		} else if (aux == 'BLOQUEIO') {
			bloqueioControler.removeActive([xi, yi]);
		} else if (aux == 'PAREDE') {
			paredeControler.removeActive([xi, yi]);
		}

		// Adiciona o bloco a respectiva lista de ativos
		if (brush == 'BOMBEIRO') {
			sonico.setPos(xi, yi);
		} else if (brush == 'NADA') {
			matrix[xi][yi] = brush;
		} else if (brush == 'FOGO') {
			matrix[xi][yi] = brush;
			fogoControler.addActive([xi, yi]);
		} else if (brush == 'EXTINTOR') {
			matrix[xi][yi] = brush;
			extintorControler.addActive([xi, yi]);
		} else if (brush == 'ESCADA') {
			if (yi < sizeY - 1) {
				matrix[xi][yi] = brush;
				escadaControler.addActive([xi, yi]);
			}
		} else if (brush == 'BLOQUEIO') {
			matrix[xi][yi] = brush;
			bloqueioControler.addActive([xi, yi]);
		} else if (brush == 'PAREDE') {
			matrix[xi][yi] = brush;
			paredeControler.addActive([xi, yi]);
		}

		// Se o bloco em questão é uma escada, remove o bloco em cima deste
		if (brush == 'ESCADA') {
			yi += 1;
			aux = matrix[xi][yi];

			// Remove o bloco da respectiva lista de ativos
			if (aux == 'FOGO') {
				fogoControler.removeActive([xi, yi]);
			} else if (aux == 'EXTINTOR') {
				extintorControler.removeActive([xi, yi]);
			} else if (aux == 'ESCADA') {
				escadaControler.removeActive([xi, yi]);
			} else if (aux == 'BLOQUEIO') {
				bloqueioControler.removeActive([xi, yi]);
			} else if (aux == 'PAREDE') {
				paredeControler.removeActive([xi, yi]);
			}
		}
	}
}

// Defini o bloco
function setbrush(param) {
	brush = param;
}

// Muda o tamanho do grid
function changeSizeX(qt) {
	newSizeX = sizeX + qt;
	
	// Recria a matrix e define o tamanho
	if (newSizeX > 0) {
		matrix = new Array(newSizeX).fill([]);

		for (var i = 0; i < newSizeX; i++) {
			matrix[i] = new Array(sizeY).fill('NADA');
		}

		sizeX = newSizeX;

		resizeCanvas(sizeX*BLOCK_SIZE, sizeY*BLOCK_SIZE);
	}
}

// Muda o tamanho do grid
function changeSizeY(qt) {
	newSizeY = sizeY + qt;
	
	// Recria a matrix e define o tamanho
	if (newSizeY > 0) {
		for (var i = 0; i < sizeX; i++) {
			matrix[i] = new Array(newSizeY).fill('NADA');
		}

		sizeY = newSizeY;

		resizeCanvas(sizeX*BLOCK_SIZE, sizeY*BLOCK_SIZE);
	}
}

// Muda o tamanho do grid
function changeSize(nX, nY) {
	// Recria a matrix e define o tamanho
	if (nX > 0 && nY > 0) {
		for (var i = 0; i < nX; i++) {
			matrix[i] = new Array(nY).fill('NADA');
		}

		sizeX = nX;
		sizeY = nY;

		resizeCanvas(sizeX*BLOCK_SIZE, sizeY*BLOCK_SIZE);
	}
}

// Calcula a posição de um bloco a partir de suas coordenadas
function cellToPos(x, y) {
	return [canvasPos.x + x * BLOCK_SIZE, canvasPos.y + y * BLOCK_SIZE];
}