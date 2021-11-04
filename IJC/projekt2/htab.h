// htab.h
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>

 
typedef struct htab_listitem{
	char* key;
	unsigned int data;
	struct htab_listitem *next;
} htab_listitem;

typedef struct htab{
	unsigned int size;
	htab_listitem* array[];
} htab_t; 
 


unsigned int htab_size(htab_t * t);

unsigned int htab_bucket_count( htab_t *t);

htab_t *htab_init(unsigned size);

unsigned int htab_hash_function(const char *str);

htab_listitem * htab_find(htab_t *t, const char *key);

htab_listitem * htab_lookup_add(htab_t *t, const char *key);

void htab_foreach(htab_t *t, void (*function)(htab_listitem *item));

void htab_clear(htab_t *t);

void htab_free(htab_t *t);

unsigned hash_function(const char *str, unsigned size);

bool htab_remove(htab_t *t, const char *key);

htab_listitem * htab_lookup_add(htab_t *t, const char *key);



