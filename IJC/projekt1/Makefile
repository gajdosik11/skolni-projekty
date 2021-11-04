# Makefile
# Řešení IJC-DU1, příklad a),b) 20.3.2018
# Autor: Jakub Gajdošík, FIT
# Přeloženo: gcc 7.1

CC=gcc

CFLAGS= -std=c99 -Wall -Wextra -o2 -pedantic

all:primes primes-i steg-decode

primes: primes.o
	$(CC) $(CFLAGS) primes.o -o $@ -lm
primes.o: primes.c eratosthenes.c
	$(CC) $(CFLAGS) -c primes.c -o $@

primes-i: primes-i.o error.o
	$(CC) $(CFLAGS) primes-i.o error.o -o $@ -lm
primes-i.o: primes.c eratosthenes.o error.o
	$(CC) $(CFLAGS) -c -DUSE_INLINE primes.c -o $@

steg-decode: steg-decode.o error.o ppm.o
	$(CC) $(CFLAGS) steg-decode.o error.o ppm.o -o $@ -lm
steg-decode.o: steg-decode.c eratosthenes.c error.h ppm.h
	$(CC) $(CFLAGS) -c steg-decode.c -o $@

bit_array.h: error.o
eratosthenes.o: eratosthenes.c bit_array.h
	$(CC) $(CFLAGS) -c eratosthenes.c -o $@
error.o: error.c error.h
	$(CC) $(CFLAGS) -c error.c -o $@
ppm.o: ppm.c ppm.h
	$(CC) $(CFLAGS) -c ppm.c -o $@

run:
	make
	time ./primes
	time ./primes-i