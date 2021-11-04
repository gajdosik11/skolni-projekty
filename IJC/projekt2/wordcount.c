// wordcount.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include "htab.h"
#include "io.c"

/*
	program funguje pokud je vlozen do jednoho souboru a prelozen
	ztravil jsem pres 20 hodin hledanim chyby ar: libhtab.a: File format not recognized
	export LD_LIBRARY_PATH="." nic nezmenilo, jak internet tak spoluzaci dokonce i random upravy
	jestli to neni nejaka blbost, ale linkovani se mi bohuzel nepodarilo, projekt nema ani komentare,
	protoze jsem vsechen svuj cas travil rozjetim Makefile, prikladam soubor wordcount1.c ktery funguje jak
	pro stdin tak pro soubor, ale chapu pokud dostanu 0, ale neco malo jsme se aspon naucil
*/

#define SLOVO_MAX 127
#define HTAB_VELIKOST 1000

void vypis(htab_listitem* item)
{
	printf("%s\t%d\n", item->key, item->data);
}

int main(int argc, char* argv[])
{
	htab_t* tabulka = htab_init(HTAB_VELIKOST);
	char slovo[SLOVO_MAX];
	htab_listitem* item;
	
	while(get_word(slovo, SLOVO_MAX, stdin) != EOF)
	{
		item = htab_lookup_add(tabulka,slovo);
		item->data++;
	}

	htab_foreach(tabulka, &vypis);
	
	htab_free(tabulka);

	return 0;
}