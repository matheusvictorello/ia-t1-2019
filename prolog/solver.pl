% x, y, cargas, focos, extintores
meta((_, _, _, [], _)).

% Apaga foco
s((X, Y, Cargas, Focos, Extintores, _), (X, Y, NCargas, NFocos, Extintores, "Apaga")) :-
	Cargas > 0,
	pertence([X, Y], Focos),
	NCargas is Cargas - 1,
	remove_elem([X, Y], Focos, NFocos).

% Pega extintor
s((X, Y, Cargas, Focos, Extintores, _), (X, Y, NCargas, Focos, NExtintores, "Pega")) :-
	Cargas == 0,
	pertence([X, Y], Extintores),
	NCargas is 2,
	remove_elem([X, Y], Extintores, NExtintores).

% Anda vertical cima
s((X, Y, Cargas, Focos, Extintores, _), (X, NY, Cargas, Focos, Extintores, "Anda")) :-
	escada(X, Y),
	limitY(LY),
	NY is Y + 1,
	NY < LY.

% Anda vertical baixo
s((X, Y, Cargas, Focos, Extintores, _), (X, NY, Cargas, Focos, Extintores, "Anda")) :-
	Y > 0,
	NY is Y - 1,
	escada(X, NY).

% Anda horizontal direita
s((X, Y, Cargas, Focos, Extintores, _), (NX, Y, Cargas, Focos, Extintores, "Anda")) :-
	limitX(LX),
	NX is X + 1,
	NX < LX,
	not(bloqueio(NX, Y)),
	not(parede(NX, Y)),
	not(pertence([X, Y], Focos)).

% Anda horizontal direita
s((X, Y, Cargas, Focos, Extintores, _), (NNX, Y, Cargas, Focos, Extintores, "Anda")) :-
	limitX(LX),
	NX is X + 1,
	NX < LX,
	bloqueio(NX, Y),
	not(pertence([X, Y], Focos)),
	NNX is NX + 1,
	not(bloqueio(NNX, Y)),
	not(parede(NNX, Y)),
	not(escada(NNX, Y)),
	not(escadaDesce(NNX, Y)),
	not(pertence([NNX, Y], Focos)).

% Anda horizontal esquerda
s((X, Y, Cargas, Focos, Extintores, _), (NX, Y, Cargas, Focos, Extintores, "Anda")) :-
	X > 0,
	NX is X - 1,
	not(bloqueio(NX, Y)),
	not(parede(NX, Y)),
	not(pertence([X, Y], Focos)).

% Anda horizontal esquerda
s((X, Y, Cargas, Focos, Extintores, _), (NNX, Y, Cargas, Focos, Extintores, "Anda")) :-
	X > 0,
	NX is X - 1,
	bloqueio(NX, Y),
	not(pertence([X, Y], Focos)),
	NNX is NX - 1,
	not(bloqueio(NNX, Y)),
	not(parede(NNX, Y)),
	not(escada(NNX, Y)),
	not(escadaDesce(NNX, Y)),
	not(pertence([NNX, Y], Focos)).

% Auxiliar

inverte_lista([], X, X).
inverte_lista([X|Xs], Y, R) :-
	inverte_lista(Xs, Y, [X|R]).
remove_elem(Elem, [Elem|Resto], Resto).
remove_elem(Elem, [Cabeca|Resto], [Cabeca|NovoResto]) :- 
	remove_elem(Elem, Resto, NovoResto).
pertence(Elem, [Elem|_ ]).
pertence(Elem, [_| Cauda]) :- 
	pertence(Elem, Cauda).
concatena([ ], L, L).
concatena([Cab|Cauda], L2, [Cab|Resultado]) :- 
	concatena(Cauda, L2, Resultado).
solucao_bl(Inicial, Solucao) :- 
	bl([[Inicial]], Solucao).
bl([[Estado|Caminho]|_], [Estado|Caminho]) :- 
	meta(Estado).
bl([Caminho|Outros], Solucao) :- 
	estende(Caminho, NovoCaminho), 
	concatena(Outros, NovoCaminho, CaminhoAnterior), 
	bl(CaminhoAnterior, Solucao). 
estende([Estado|Caminho], NovoCaminho):- 
	bagof([Sucessor, Estado|Caminho], (s(Estado,Sucessor), not(pertence(Sucessor, [Estado|Caminho]))), NovoCaminho), !.
estende(_, []). 
solucao_bp(Inicial, Solucao) :- 
	bp([], Inicial, Solucao). 
bp(Caminho, Estado, [Estado|Caminho]) :- 
	meta(Estado).
bp(Caminho, Estado, Solucao) :- 
	s(Estado, Sucessor), 
	not(pertence(Sucessor, Caminho)), 
	bp([Estado|Caminho], Sucessor, Solucao).