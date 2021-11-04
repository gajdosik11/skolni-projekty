// htab_foreach.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include "htab.h"

void htab_foreach(htab_t *t, void (*function)(htab_listitem *item))
{
	htab_listitem* item = NULL;

	for(unsigned i = 0; i < t->size; i++)
		for (item = t->array[i]; item != NULL; item = item->next)
			function(item);
			
		
}