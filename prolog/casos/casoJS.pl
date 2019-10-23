limitX(10).
limitY(5).

parede(-1, -1).

bloqueio(6, 1).

escada(8, 0).


escadaDesce(X, Y) :- 
	NY is Y - 1,
	escada(X, NY).

run(Invertida) :-
	solucao_bl((0, 0, 0, [[5, 0], [5, 1], [6, 0]], [[3, 0], [9, 0]], "Comeco"), Solucao),
	inverte_lista(Solucao, Invertida, []).