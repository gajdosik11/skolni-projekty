// primes.c
// Řešení IJC-DU1, příklad a) 20.3.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
// Výpis posledních 10 prvočísel čísla 222 000 000  

#include <stdio.h>
#include "error.h"
#include "eratosthenes.c"

#define POCET_PRVKU 222000000
#define POCET_VYPSANI 10

int main(void) //Defaultně výpis posledních 10 prvočísel čísla 222 000 000  
{ 
	bit_array_create(pole, POCET_PRVKU); //vytvoření pole kde velikost je horní hranice čísel ze kterých chceme vypsat prvočísla
	unsigned long pozice = POCET_PRVKU; //nastavení max možné hodnoty pole
	unsigned long pole_prvocisel[POCET_VYPSANI]; //vytvoření pomocného pole pro pozdější výpis
	Eratosthenes(pole); //"zredukování" pole na prvočísla

	int i = POCET_VYPSANI-1;
	while(i >= 0) //dokud nenaplníme pomocný array hledej další prvočíslo od konce
	{
		if(!bit_array_getbit(pole, pozice))
		{
			pole_prvocisel[i] = pozice; //do pomocného pole se zapisují prvočísla od konce pozpátku
			i--;
		}
		pozice--; 
	}		

	for (i = 0; i < POCET_VYPSANI; i++) // vypsání pole
	{
		printf("%lu\n", pole_prvocisel[i]);
	}

	return 0;
}