// htab_io.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include <stdio.h>
#include <ctype.h>

int get_word(char *s, int max, FILE *f)
{
	if (f == NULL)
		return -1;

	int i = 0;
	for (int c = 0; i < max && (c = fgetc(f)) != EOF && !isspace(c); i++)
		s[i] = c;

	s[i]= '\0';

	if (i == 0)
	 return EOF;

	return i;
}