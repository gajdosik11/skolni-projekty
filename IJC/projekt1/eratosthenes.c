// eratosthenes.c
// Řešení IJC-DU1, příklad a) 20.3.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
// Vytvoreni pole, kde indexi pole co jsou prvocisla budou mit hodnotu 1

#ifndef ERATOSTHENES_C
#define ERATOSTHENES_C

#include "bit_array.h"
#include <math.h>

void Eratosthenes(bit_array_t pole)
{
	unsigned long pocet = bit_array_size(pole);

	for (unsigned long i = 2; i < (unsigned long) (sqrt(pocet)+1); i++) //prochází pole od 2 do odmocniny z velikosti pole
		if(bit_array_getbit(pole, i) == 0) //praacuje jen s bity s hodnou 0
			for (unsigned long j = i*i; j <= pocet; j+=i) //nastavý násobky prvočísel na 1 -> rekuce čísel na pouze prvočísla
				bit_array_setbit(pole, j, 1);
}

#endif