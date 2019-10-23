function Sonico() {
	// Estado do sonico
	this.state = "parado";

	// Lista de imagens dos extintores
	this.cargaSprays = [
		createImg(iExtintorPath, "Sonico"),
		createImg(iExtintorPath, "Sonico"),
	];

	// Lista de gifs
	this.sprays = {
		"parado": createImg(iSonicoParadoPath, "Sonico"),
		"runR":   createImg(gSonicoRunRPath, "Sonico"),
		"runL":   createImg(gSonicoRunLPath, "Sonico"),
		"runF":   createImg(gSonicoRunFPath, "Sonico"),
		"pegaR":  createImg(gSonicoTapaRPath, "Sonico"),
		"pegaL":  createImg(gSonicoTapaLPath, "Sonico"),
		"apagaR": createImg(gSonicoTapaRPath, "Sonico"),
		"apagaL": createImg(gSonicoTapaLPath, "Sonico"),
		"dyingR": createImg(gSonicoDyingRPath, "Sonico"),
		"dyingL": createImg(gSonicoDyingLPath, "Sonico"),
		"win":    createImg(gSonicoWinPath, "Sonico"),
		"deadR":  createImg(iSonicoDeadRPath, "Sonico"),
		"deadL":  createImg(iSonicoDeadLPath, "Sonico"),
	};

	// Posição no grid
	this.cellX = 0;
	this.cellY = 0;

	// Posição real
	this.posX = this.cellX;
	this.posY = this.cellY;

	// Posição real dos extintores
	this.cargaX = this.cellX;
	this.cargaY = this.cellY;

	// Última posição escolhida para o sonico
	this.baseX = this.cellX;
	this.baseY = this.cellY;

	// Quantidade de cargas
	this.cargas = 0;

	// Preparando sprays
	for (spray in this.sprays) {
		this.sprays[spray].size(BLOCK_SIZE, BLOCK_SIZE);
		this.sprays[spray].hide();	
	}
	this.cargaSprays[0].size(BLOCK_SIZE_HALF, BLOCK_SIZE_HALF);
	this.cargaSprays[0].hide();
	this.cargaSprays[1].size(BLOCK_SIZE_HALF, BLOCK_SIZE_HALF);
	this.cargaSprays[1].hide();

	// Reseta o sonico para o estado inicial
	this.reset = function() {
		this.changeState("parado");

		this.cellX = this.baseX;
		this.cellY = this.baseY;

		this.posX = this.cellX;
		this.posY = this.cellY;

		this.cargaX = this.cellX;
		this.cargaY = this.cellY;

		this.cargas = 0;
		this.cargaSprays[0].hide();
		this.cargaSprays[1].hide();
	}

	// Defini a posição base no grid
	this.setPos = function(x, y) {
		this.baseX = x;
		this.baseY = y;

		this.cellX = x;
		this.cellY = y;
	}

	// Defini a posição corrente no grid e o respectivo estado
	this.walk = function(x, y) {
		var dx = x - this.cellX;

		this.cellX = x;
		this.cellY = y;

		if (dx == 0) {
			this.changeState("runF");
		} else if (dx > 0) {
			this.changeState("runR");
		} else {
			this.changeState("runL");
		}
	}

	// Seta o número de cargas e o respectivo estado
	this.pega = function() {
		if (this.cargas == 0) {
			var prevState = this.state;

			if (this.state == "runR") {
				this.changeState("pegaR");
			} else {
				this.changeState("pegaL");
			}
			
			// Timeouts para sincronização com os sprites
			var that = this;
			setTimeout(function() {
				that.changeState(prevState);
			}, tapaT);
			setTimeout(function() {
				that.cargas = 2;
				that.cargaSprays[0].show();
				that.cargaSprays[1].show();
			}, apagaT);
		}
	}

	// Decrementa o número de cargas e o respectivo estado
	this.apaga = function() {
		if (this.cargas > 0) {
			var prevState = this.state;

			if (this.state == "runR") {
				this.changeState("apagaR");
			} else {
				this.changeState("apagaL");
			}
			
			// Timeouts para sincronização com os sprites
			var that = this;
			setTimeout(function() {
				that.changeState(prevState);
			}, tapaT);
			setTimeout(function() {
				that.cargas--;
				that.cargaSprays[that.cargas].hide();
			}, apagaT);
		}
	}

	// Estado de sucesso
	this.win = function() {
		this.changeState("win");
	}

	// Inicia o processo de morte
	this.dead = function() {
		var next;

		if (this.state == "runR") {
			this.changeState("dyingR");
			next = "deadR";
		} else {
			this.changeState("dyingL");
			next = "deadL";
		}

		// Timeouts para sincronização com os sprites
		var that = this;
		setTimeout(function() {
			that.changeState(next);
		}, dyingT);
	}

	// Altera o estado interno
	this.changeState = function(newState) {
		this.sprays[this.state].hide();
		this.state = newState;
		this.sprays[newState].show();
	}

	// Atualiza as posições dos gifs e imagens
	this.update = function() {
		var d = dist(this.posX, this.posY, this.cellX, this.cellY)/50;

		this.posX = lerp(this.posX, this.cellX, d+0.1);
		this.posY = lerp(this.posY, this.cellY, d+0.1);
		this.cargaX = lerp(this.cargaX, this.cellX, d+0.02);
		this.cargaY = lerp(this.cargaY, this.cellY, d+0.02);

		this.sprays[this.state].position(canvasPos.x + this.posX * BLOCK_SIZE, canvasPos.y + this.posY * BLOCK_SIZE);

		var newPos = cellToPos(this.cargaX, this.cargaY);

		this.cargaSprays[0].position(newPos[0] + BLOCK_SIZE_QUARTER, newPos[1] + BLOCK_SIZE_HALF);
		this.cargaSprays[1].position(newPos[0] + BLOCK_SIZE_QUARTER, newPos[1]);
	}

	// Estado inicial
	this.changeState("parado");
}