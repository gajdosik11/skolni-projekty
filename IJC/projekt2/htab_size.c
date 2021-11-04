// htab_size.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include "htab.h"

unsigned int htab_size(htab_t * t)
{
	return t->size;
}