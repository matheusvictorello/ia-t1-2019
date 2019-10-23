limitX(10).
limitY(5).

parede(5, 0).
parede(4, 2).

bloqueio(1, 0).
bloqueio(2, 1).
bloqueio(9, 1).
bloqueio(5, 3).
bloqueio(1, 4).
bloqueio(5, 4).

escada(3, 0).
escada(8, 0).
escada(0, 1).
escada(6, 1).
escada(3, 2).
escada(9, 2).
escada(2, 3).
escada(8, 3).


escadaDesce(X, Y) :- 
	NY is Y - 1,
	escada(X, NY).

run(Invertida) :-
	solucao_bl((0, 0, 0, [[4, 0], [1, 2], [7, 4]], [[6, 0], [5, 2]], "Comeco"), Solucao),
	inverte_lista(Solucao, Invertida, []).