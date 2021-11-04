// ppm.c
// Řešení IJC-DU1, příklad b) 20.3.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
// Načítání obrázku formátu ppm do pomocné struktury, aby se později nal rozšifrovat

#include "ppm.h"

struct ppm * ppm_read(const char * filename) //nacteni obrázku formátu ppm do struktury
{
	FILE *soubor;

	if((soubor = fopen(filename, "rb")) == NULL) //otevření osuboru
	{
		warning_msg("Otevreni souboru se nezdarilo");
		return NULL;
	}

	unsigned x, y, colors;

	if(getc(soubor) != 'P' || getc(soubor) != '6' || (fscanf(soubor, "%u %u %u", &x, &y, &colors) != 3) || (colors != 255)) //kontrola zda je soubor správného formátu
	{
		warning_msg("Soubor je ve spatnem formatu");
		fclose(soubor);
		return NULL;
	}

	struct ppm *obrazek = NULL;

	if((obrazek = (struct ppm *) malloc(sizeof(struct ppm) + (3*x*y))) == NULL) //alokování paměti pro strukturu
	{
		warning_msg("Soubor se nepovedlo alokovat");
		fclose(soubor);
		return NULL;
	}

	obrazek->xsize = x;
	obrazek->ysize = y; 

	if(fread(obrazek->data, sizeof(char), 3*x*y, soubor) !=3*x*y) //nacteni dat ze souboru do struktury
	{
		warning_msg("Nepodarilo se nacist data ze souboru");
		fclose(soubor);
		free(obrazek);
		return NULL;
	}

	fclose(soubor);
	return obrazek;
}

int ppm_write(struct ppm *p, const char * filename) //zapsaní struktury do obrázku
{
	FILE *soubor;

	if((soubor = fopen(filename, "wb")) == NULL) //otevření souboru
	{
		warning_msg("Nepodarilo se otevreni souboru pri zapisu");
		return -1;
	}

	if(p == NULL) //kontrola zda struktura existuje
	{
		warning_msg("Nebyl predan ukazatel na strukturu");
		return -1;
	}

	unsigned long velikost = 3*p->xsize*p->ysize; 

	fprintf(soubor, "P6 \n%u %u\n255\n", p->xsize, p->ysize); //vepsání hlavičky do souboru aby byla formátu ppm

	if(fwrite(p->data, sizeof(char), velikost, soubor) != velikost) //zapsání dat do souboru
	{
        warning_msg("Nepodarilo se zapis dat do souboru");
        fclose(soubor);
        return -1;
    }

    fclose(soubor);
    return 0;

}