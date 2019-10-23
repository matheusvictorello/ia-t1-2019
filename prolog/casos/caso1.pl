limitX(10).
limitY(5).

parede(2, 2).
parede(6, 4).

bloqueio(3, 1).
bloqueio(6, 1).
bloqueio(3, 3).
bloqueio(6, 3).
bloqueio(5, 4).

escada(4, 0).
escada(8, 1).
escada(0, 2).
escada(9, 2).
escada(2, 3).
escada(4, 3).
escada(8, 3).


escadaDesce(X, Y) :- 
	NY is Y - 1,
	escada(X, NY).

run(Invertida) :-
	solucao_bl((0, 0, 0, [[8, 0], [9, 4]], [[1, 2]], "Comeco"), Solucao),
	inverte_lista(Solucao, Invertida, []).