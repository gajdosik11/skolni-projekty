// IOS proj2
// Jakub Gajdošík, xgajdo24
//# VUT, FIT
// projekt simuluje jizdu autobusem, kdy lide reprezentovani procesy
// podle pravidel cekaji na zastavce nastupuji a vystupuji
// jedna se o soubjezne bezici procesi a jejich synchronizace pomoci semaforu
// a sdilenych pameti, prubeh se vypisuje do proj2.out

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>
#include <semaphore.h>
#include <string.h>
#include <sys/types.h>
#include <fcntl.h>

//potrebne velmi casto se opakujici funkce, pro korektni vypis dat a zapis do promnenych
#define POCKEJ sem_wait(semafor_stridani);
#define POKRACUJ sem_post(semafor_stridani);

//zdilene promnene
unsigned *poc_rider = 0;
unsigned *cislovani = 0;
unsigned *poc_na_zast =0;
unsigned *poc_v_busu =0;
unsigned *kap_bus=0;
unsigned *poc_finished =0;

//semafory potrebne pro synchrnyzaci
sem_t *semafor_stridani =0;
sem_t *semafor_konec = 0;
sem_t *semafor_zastavka = 0;
sem_t *semafor_otevrit = 0;
sem_t *semafor_odjezd = 0;
sem_t *semafor_vystupovat = 0;
//zapisovaci soubor
FILE *soubor = NULL;

//funkce pro smazani dat o sdilenych promnenych
void dest_sdil_prom(unsigned *prom);

//ceka nahodnou dobu z intervalu 0 az "max_doba"
void cekej( unsigned max_doba);

//prubeh celeho procesu bus
void bus_cesta(unsigned zpozdeni, unsigned konec_rideru);

//prubeh celeho procesu rider
void rider();

//generuje "pocet" rideru v nahodnem intervalu od 0 do "max_doba_gen"
void rider_gen(unsigned pocet, unsigned max_doba_gen);

//pri dokonceni programu nebo chybe po sobe vse uklidi
void uklid();

//vytvori vsechny potrebne promene(semafory, sdilene promene)
int init();