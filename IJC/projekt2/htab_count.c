// htab_count.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include "htab.h"

unsigned int htab_bucket_count( htab_t *t)
{
	unsigned int citac = 0;
	for (int i = 0; i < HTAB_VELIKOST; ++i)
		if (t->array[i] != NULL)
			citac++;
	return citac;
}