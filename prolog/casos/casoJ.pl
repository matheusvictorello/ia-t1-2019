limitX(10).
limitY(5).

parede(0, 0).
parede(6, 0).
parede(5, 4).

bloqueio(3, 0).
bloqueio(2, 2).
bloqueio(7, 2).

escada(5, 0).
escada(9, 0).
escada(4, 1).
escada(5, 2).
escada(1, 3).
escada(6, 3).


escadaDesce(X, Y) :- 
	NY is Y - 1,
	escada(X, NY).

run(Invertida) :-
	solucao_bl((0, 2, 0, [[1, 0], [8, 1], [9, 2], [0, 3], [8, 3], [9, 4]], [[7, 0], [0, 1], [0, 4]], "Comeco"), Solucao),
	inverte_lista(Solucao, Invertida, []).