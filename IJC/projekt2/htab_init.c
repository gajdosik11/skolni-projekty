// htab_init.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include "htab.h"

htab_t* htab_init(unsigned size)
{
	htab_t* tab = malloc(size*sizeof(htab_listitem) + sizeof(htab_t));
	if(tab == NULL)
		return NULL;

	tab->size = size;

	for(unsigned i = 0; i < size; i++)
		tab->array[i] = NULL;

	return tab;
}