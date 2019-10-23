function Controler(poolSize, path, description, offsetX=0, offsetY=0) {
	// Quantidade de gifs/imagens
	this.poolSize = poolSize;
	// Lista de gifs/imagens
	this.pool = [];
	// Posição dos gifs/imagens
	this.poolPos = [];
	// Quantidade sendo usada
	this.using = 0;

	// Offset dos gifs/imagens
	this.offsetX = offsetX;
	this.offsetY = offsetY;

	// Prepara os gifs/imagens
	for (var i = 0; i < this.poolSize; i++) {
		this.pool[i] = createImg(path, description);
		this.pool[i].hide();
		this.pool[i].size(BLOCK_SIZE, BLOCK_SIZE);
	}

	// Atualiza a lista de ativos
	this.attActive = function(newList) {
		this.using = newList.length;
		this.poolPos = newList;

		var i;
		for (i = 0; i < newList.length; i++) {
			this.pool[i].show();
		}

		for (; i < this.poolSize; i++) {
			this.pool[i].hide();
		}
	}

	// Adiciona à lista de ativos
	this.addActive = function(pos) {
		this.poolPos[this.using] = pos;
		this.using++;
	}

	// Remove da lista de ativos
	this.removeActive = function(pos) {
		var i = 0;
		
		this.using--;

		while (i < this.poolPos.length && !(this.poolPos[i][0] == pos[0] && this.poolPos[i][1] == pos[1])) {
			i++;
		}

		this.poolPos.splice(i, 1);
	}

	// Atualiza as posições dos gifs/imagens
	this.update = function() {
		var i;

		for (i = 0; i < this.poolPos.length; i++) {
			this.pool[i].show();
			var newPos = cellToPos(this.poolPos[i][0], this.poolPos[i][1]);
			this.pool[i].position(newPos[0] + this.offsetX, newPos[1] + this.offsetY);
		}

		for (; i < this.poolSize; i++) {
			this.pool[i].hide();
		}
	}
}