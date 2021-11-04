// htab_lookup.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include "htab.h"

htab_listitem * htab_lookup_add(htab_t *t, const char *key)
{
	unsigned int index = htab_hash_function(key) % t->size;
	htab_listitem* item = htab_find(t, key);
	if(item == NULL)
	{

		htab_listitem* prev = NULL;
		while(item != NULL)
		{
			if (strcmp(item->key,key))
			{
				prev = item;
				break;
			}
			prev = item;
			item = item->next;
		}

		htab_listitem* add = (htab_listitem*) malloc(sizeof(htab_listitem));

		if(add != NULL)
		{
			add->key = malloc(sizeof(char)*(strlen(key)+1));
			add->key = strncpy(add->key, key, strlen(key)+1);
			add->next = NULL;
			item = add;
			if (prev != NULL && prev != item)
				prev->next = item;
			t->array[index] = item;
		}

	}
	return item;

}