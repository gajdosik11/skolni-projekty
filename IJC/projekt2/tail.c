// tail.c
// Řešení IJC-DU2, 25.5.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_DELKA 1024
#define RADKY 10

typedef struct prvek{
	char data[MAX_DELKA];
	struct prvek * next;
} prvek_t;

int vypis(FILE *vstup, int radky)
{
	int citac = 0;
	prvek_t *pomoc = NULL;
	prvek_t * prvni = NULL;
	prvni = malloc(sizeof(prvek_t));
	if (prvni == NULL)
	{
		fprintf(stderr, "Error nepodarilo se allokovat pamet\n");
		return -1;
	}
	fgets( prvni->data, MAX_DELKA, vstup);
	if(strlen(prvni->data) == MAX_DELKA-1)
		{
			if(prvni->data[MAX_DELKA-2] != '\n')
			{
				while(fgetc(vstup) != '\n');
				prvni->data[MAX_DELKA-1] = '\n';
			}
		}
	prvek_t *tmp = prvni;

	while(!feof(vstup) && citac < radky-1)
	{
		tmp->next = malloc(sizeof(prvek_t));
		if (tmp->next == NULL)
		{
			fprintf(stderr, "Error nepodarilo se allokovat pamet\n");
			pomoc = tmp;
			for (int i = 0; i < citac; ++i)
			{
				pomoc = pomoc->next;
				free(tmp);
				tmp = pomoc;
			}
			return -1;
		}
		tmp = tmp->next;
		fgets( tmp->data, MAX_DELKA, vstup);
		if(strlen(tmp->data) == MAX_DELKA-1)
		{
			if(tmp->data[MAX_DELKA-2] != '\n')
			{
				while(fgetc(vstup) != '\n');
				tmp->data[MAX_DELKA-1] = '\n';
			}
		}
		citac++;
	}
	tmp->next = prvni;
	tmp = prvni;
	while(!feof(vstup))
	{
		fgets( tmp->data, MAX_DELKA, vstup);
		tmp = tmp->next;
		if(strlen(tmp->data) == MAX_DELKA-1)
		{
			if(tmp->data[MAX_DELKA-2] != '\n')
			{
				while(fgetc(vstup) != '\n');
				tmp->data[MAX_DELKA-1] = '\n';
			}
		}
	}
	for (int i = 0; i < radky-2; ++i)
		tmp = tmp->next;
	for (int i = 0; i < radky; ++i)
	{
		tmp = tmp->next;

		printf("%s", tmp->data);
		
	}
	
	pomoc = tmp;
	for (int i = 0; i < radky; ++i)
	{
		pomoc = pomoc->next;
		free(tmp);
		tmp = pomoc;
	}
	return 1;	
}


int main(int argc, char const *argv[])
{
	FILE *vstup;
	int radky = RADKY;
	int vysledek = -1;
	switch(argc) {

		case 1:
			vstup = stdin;
			break;

		case 2:
			vstup = fopen(argv[1], "r");
			if(vstup == NULL)
			{
				fprintf(stderr, "Error nepodarilo se otevrit soubor \n");
				return -1;
			}
			break;

		case 3:
			if (strcmp(argv[1], "-n"))
			{
				fprintf(stderr, "Error spatny format argumentu \"%s\"\n", argv[1]);
				return -1;
			}
			else
			{
				if (atoi(argv[2]) < 0)
				{
					fprintf(stderr, "Error spatny format argumentu \"%d\"\n", atoi(argv[2]));
					return -1;
				}
				else
				{
					radky = atoi(argv[2]);
					vstup = stdin;
				}
			}
			break;

		case 4:
			if (strcmp(argv[1], "-n"))
			{
				fprintf(stderr, "Error spatny format argumentu \"%s\"\n", argv[1]);
				return -1;
			}
			else
			{
				if (atoi(argv[2]) < 0)
				{
					fprintf(stderr, "2Error spatny format argumentu \"%d\"\n", atoi(argv[2]));
					return -1;
				}
				else
				{
					radky = atoi(argv[2]);
					vstup = fopen(argv[3], "r");
					if(vstup == NULL)
					{
						fprintf(stderr, "Error nepodarilo se otevrit soubor \n");
						return -1;
					}
				}
			}
			break;
	default:
		fprintf(stderr, "Error spatny format argumentu\n");
				return -1;
	}

	vysledek = vypis(vstup, radky);
	fclose(vstup);
	
	return vysledek;
}