# IOS proj2
# Jakub Gajdošík, xgajdo24
# VUT, FIT
# projekt simuluje jizdu autobusem, kdy lide reprezentovani procesy
# podle pravidel cekaji na zastavce nastupuji a vystupuji
# jedna se o soubjezne bezici procesi a jejich synchronizace pomoci semaforu
# a sdilenych pameti, prubeh se vypisuje do proj2.out

CC=gcc
CFLAGS=-std=gnu99 -g -Wall -Werror -Wextra -pedantic -pthread

#programy co ma prelozit
all: proj2

proj2: proj2.o
	$(CC) $(CFLAGS) -o $@ proj2.o

proj2.0: proj2.c proj2.h
	$(CC) $(CFLAGS) -c -o $@ $<

#spusteni prekladu
run:
	all

#smazani nepotrebnych veci
clean:
	rm *.0
	rm *.out
	rm proj2
	rm *.zip

#zipovani
zip:
	zip xgajdo24.zip Makefile .c .h