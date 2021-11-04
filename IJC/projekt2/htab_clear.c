// htab_clear.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include "htab.h"

void htab_clear(htab_t *t)
{
	htab_listitem* item = NULL;

	for(unsigned i = 0; i < t->size; i++)
	{	item = t->array[i];
		while(item != NULL)
		{
			htab_remove(t,item->key);
			item = item->next;
		}
	}
}