// ppm.h
// Řešení IJC-DU1, příklad b) 20.3.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
// Načítání obrázku formátu ppm do pomocné struktury, aby se později nal rozšifrovat

#ifndef PPM_H
#define PPM_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "error.h"

struct ppm {
        unsigned xsize;
        unsigned ysize;
        char data[];    // RGB bajty, celkem 3*xsize*ysize
     };

struct ppm * ppm_read(const char * filename); //nacteni obrázku formátu ppm do struktury

int ppm_write(struct ppm *p, const char * filename); //zapsaní struktury do obrázku

#endif