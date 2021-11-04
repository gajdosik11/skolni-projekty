// htab_remove.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include "htab.h"

bool htab_remove(htab_t *t, const char *key)
{
	unsigned int index = htab_hash_function(key) % t->size;
	htab_listitem* pom = htab_find(t,key);
	htab_listitem* item = t->array[index];
	if(pom != NULL)
	{
		htab_listitem* prev = t->array[index];
		while(item != NULL)
		{
			if (strcmp(item->key, key) == 0)
			{
				if (prev == item)
					t->array[index] = item->next;
				prev->next = item->next;

				free(item);
				break;
			}
			prev = item;
			item = item->next;
		}
		

		return true;
	}
	else
		return false;
	
}