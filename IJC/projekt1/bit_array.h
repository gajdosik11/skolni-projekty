// bit_array.h
// Řešení IJC-DU1, příklad a) 20.3.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: gcc 7.1
// Vytváření bitového pole a funkce které z toho bitové pole čtou, nebo do něj zapisují. 2 Varianty: define a inline fce

#ifndef BIT_ARRAY_H
#define BIT_ARRAY_H

#include <limits.h>
#include "error.h"

typedef unsigned long bit_array_t[];

//velikost jedné jednotky "8*unsigned long" v poli
#define bit_jednotka \
	(CHAR_BIT*sizeof(unsigned long))

//zjištění bytu kde se bude měnit bit
#define bit_pozice(index) \
	(index/bit_jednotka)

//zjištění bitu co se musí změnit
#define bit_posunuti(pole, index) \
	(1LU << (index % bit_jednotka))

//vytvoření pole, kde se vypočítá velikost, aby jsme šetřili místo protože se pracuje jen s bity + jeden byt kde je uloženo množství bitů
#define bit_array_create(jmeno_pole, velikost) \
	unsigned long jmeno_pole[(velikost+1)/bit_jednotka + ((((velikost + 1) % bit_jednotka>0) ? 1 : 0) + 1) ] = {velikost,0}\

//zde se nachází inline funkce které jsou identické jako define o pár řádků níž viz komentáře níž
#ifdef USE_INLINE 

static inline unsigned long bit_array_size(bit_array_t jmeno_pole) {
    return jmeno_pole[0];
}

static inline void bit_array_setbit(bit_array_t jmeno_pole, unsigned long index, short vyraz) {
    if(index > bit_array_size(jmeno_pole)) {
    	error_exit("Index %lu mimo rozsah 0..%lu",(unsigned long)index, bit_array_size(jmeno_pole));
    }
    if(vyraz != 0) {
    	(jmeno_pole[bit_pozice(index) + 1] |= (bit_posunuti(jmeno_pole, index)));
    } else { 
        (jmeno_pole[bit_pozice(index) + 1] &= ~(bit_posunuti(jmeno_pole, index)));
    }
}

static inline unsigned long bit_array_getbit(bit_array_t jmeno_pole, unsigned long index) {
    if(index > bit_array_size(jmeno_pole)) {
        error_exit("Index %lu mimo rozsah 0..%lu",(unsigned long)index, bit_array_size(jmeno_pole));
    }
    return ((jmeno_pole[bit_pozice(index) + 1] & (bit_posunuti(jmeno_pole, index))) >> index % bit_jednotka);
}

#else

//vrací počet bitů v poli
#define bit_array_size(jmeno_pole) \
	(unsigned long) jmeno_pole[0]

//nastavuje bit daného indexu, na hodnotu 0 a 1 podle výrazu 
#define bit_array_setbit(jmeno_pole, index, vyraz) \
	(vyraz!=0)? \
	(unsigned long) (jmeno_pole[bit_pozice(index) + 1] |= (bit_posunuti(jmeno_pole, index))): \
	(unsigned long) (jmeno_pole[bit_pozice(index) + 1] &= ~(bit_posunuti(jmeno_pole, index)))

//zjišťuje hodnotu bitu na daném indexu
#define bit_array_getbit(jmeno_pole, index) \
	(unsigned long) ((jmeno_pole[bit_pozice(index) + 1] & (bit_posunuti(jmeno_pole, index))) >> index % bit_jednotka)

#endif

#endif