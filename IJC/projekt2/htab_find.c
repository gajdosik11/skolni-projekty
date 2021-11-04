// htab_find.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include "htab.h"

htab_listitem * htab_find(htab_t *t, const char *key)
{
	unsigned int index = htab_hash_function(key) % t->size;
	htab_listitem* item = t->array[index];

	while(item != NULL) 
	{
		if(strcmp(item->key, key) == 0)
			return item;

		item = item->next;
	}

	return item;
}