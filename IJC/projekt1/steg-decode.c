// steg-decode.c
// Řešení IJC-DU1, příklad b) 20.3.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
// Dekódování tajné zprávy se souboru ppm za pomoci bitoveho pole prvočísel

#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include "bit_array.h"
#include "eratosthenes.c"
#include "error.h"
#include "ppm.h"

#define MAX_VELIKOST 1000*1000*3

int main(int argc, char const *argv[]) //Dekódování tajné zprávy se souboru ppm za pomoci bitoveho pole prvočísel
{
	if(argc != 2)
		error_exit("Nespravny pocet argumentu");

	struct ppm *obr;

	if((obr = ppm_read(argv[1])) == NULL) //načtení zadaného souboru do "obr"
		error_exit("Nacitani se nezdarilo");

	bit_array_create(prvocisla, MAX_VELIKOST); //vytvoření pomocného pole prvočísel
	Eratosthenes(prvocisla);
	
	bit_array_create(znak,1); //vytvoření pomocného pole pro výpis znaku, který poskládáme z bitů šifry
	int pozice; //pozice v našem znaku kam se zapíše bit. aby z 8 bitů byl znak
	for (unsigned i = 11; i < prvocisla[0]; i++) //procházení pole s prvočísly od čísla 11
	{
		if (!bit_array_getbit(prvocisla, i)) //0 znamená že indexu i je prvočíslo  
		{
			bit_array_setbit(znak, pozice, (obr->data[i+1] & 1)); //nastavení jendoho bitu našeho znaku
			pozice++;
			if(pozice == CHAR_BIT) //když je znak celý
			{
				if(znak[1] == '\0') //ukončení hledání
				{
					printf("\n");
					break;
				}
				if(isprint(((unsigned char)znak[1]))) //pokud je to znak vytiskne ho a hledá dál
				{
					printf("%c", (unsigned char)znak[1]);
					znak[1] = 0;
					pozice = 0;
				}
				else //nejedná se o znak
				{
					warning_msg("Nebyl vytvoren tisknutelny znak");
					free(obr);
					return 0;
				}
			}
		}
	}
	if (obr != NULL) free(obr);
	return 0;
}