#include "proj2.h"

void dest_sdil_prom(unsigned *prom)
{
	munmap((prom), sizeof(*(prom)));
}

void cekej( unsigned max_doba)
{
	if (max_doba != 0)
	{
		max_doba *= 1000;
		usleep(rand() % max_doba);
	}
}

void bus_cesta(unsigned zpozdeni, unsigned konec_rideru)
{
	(*cislovani)++;
	POCKEJ
	fprintf(soubor,"%d \t:BUS   :\t start \n", (*cislovani)++);
	POKRACUJ

	//opakuj rutinu dokud neodvezes vsechny cestujici
	while(*poc_finished < konec_rideru)
	{
		//dojed na zastavku a zamkni ji
		sem_wait(semafor_zastavka);

		POCKEJ
		fprintf(soubor,"%d \t:BUS   :\t arrival \n", (*cislovani)++);
		POKRACUJ

		//jestli je nekdo na zastavce otevri dvere a cekej az ti daji znameni ze muzes odjet
		if(*poc_na_zast > 0)
		{
			POCKEJ
			fprintf(soubor,"%d \t:BUS   :\t start boarding :%d \n", (*cislovani)++, *poc_na_zast);
			POKRACUJ

			sem_post(semafor_otevrit);
			sem_wait(semafor_odjezd);
			POCKEJ
			sem_post(semafor_vystupovat);
			sem_wait(semafor_vystupovat);
			POKRACUJ

			POCKEJ
			fprintf(soubor,"%d \t:BUS   :\t end boarding :%d \n", (*cislovani)++, *poc_na_zast);
			POKRACUJ
		}
		POCKEJ
		fprintf(soubor,"%d \t:BUS   :\t depart \n", (*cislovani)++);
		POKRACUJ

		//po odjezdu otevri zastavku
		sem_post(semafor_zastavka);

		cekej(zpozdeni);

		POCKEJ
		fprintf(soubor,"%d \t:BUS   :\t end \n", (*cislovani)++);
		POKRACUJ

		//otevry dvere pro vsechny cestujici
		for (unsigned i = 0; i < *poc_v_busu; ++i)
			sem_post(semafor_vystupovat);
		
	}
	fprintf(soubor,"%d \t:BUS   :\t finish \n", (*cislovani)++);
	exit(0);
}

void rider()
{
	POCKEJ
	unsigned id = (*poc_rider)++;
	POKRACUJ

	POCKEJ
	fprintf(soubor,"%d \t:RID %d :\t start \n", (*cislovani)++, id);
	POKRACUJ

	//cekej dokud neprijede bus a pakj vstup a zvec pocet lidi na na zastavce
	sem_wait(semafor_zastavka);
	
	POCKEJ
	(*poc_na_zast)++;
	POKRACUJ
	
	POCKEJ
	fprintf(soubor,"%d \t:RID %d :\t enter: %d \n", (*cislovani)++, id, *poc_na_zast);
	POKRACUJ

	//pust dalsiho na zastavku
	sem_post(semafor_zastavka);
	
	//cekej na autobus az otevre dvere
	sem_wait(semafor_otevrit);

	//prechazeni lidi mezi zastavkou a busem
	POCKEJ
	(*poc_v_busu)++;
	(*poc_na_zast)--;
	POKRACUJ
	
	POCKEJ
	fprintf(soubor,"%d \t:RID %d :\t boarding \n", (*cislovani)++, id);
	POKRACUJ

	//dej autobusu znameni pro odjezd az bude bud plny nebo nikdo nezbude na zastavce
	if (*poc_na_zast == 0 || *poc_v_busu == *kap_bus)
		sem_post(semafor_odjezd);
	else
		sem_post(semafor_otevrit);

	//cekej na pokyn vystupovani od autobusu
	sem_wait(semafor_vystupovat);
	POCKEJ
	(*poc_v_busu)--;
	POKRACUJ

	POCKEJ
	(*poc_finished)++;
	POKRACUJ

	POCKEJ
	fprintf(soubor,"%d \t:RID %d :\t finish \n", (*cislovani)++, id);
	POKRACUJ

	exit(0);
}


void rider_gen(unsigned pocet, unsigned max_doba_gen)
{
	(*poc_rider) = 1;
	for (unsigned i = 0; i < pocet; ++i)
	{
		pid_t RID = fork();
		if (RID == 0)
		{
			rider();
		}
		cekej(max_doba_gen);
	}
	exit(0);
}

void uklid()
{
	//ukoncovani semaforu
	sem_unlink("/ios.xgajdo24.semafor_konec");
	sem_unlink("/ios.xgajdo24.semafor_zastavka");
	sem_unlink("/ios.xgajdo24.semafor_otevrit");
	sem_unlink("/ios.xgajdo24.semafor_odjezd");
	sem_unlink("/ios.xgajdo24.semafor_vystupovat");
	sem_unlink("/ios.xgajdo24.semafor_stridani");

	//mazani sdilenych promnenych
	dest_sdil_prom(poc_rider);
	dest_sdil_prom(cislovani);
	dest_sdil_prom(poc_na_zast);
	dest_sdil_prom(poc_v_busu);
	dest_sdil_prom(kap_bus);

	//zavreni souboru
	fclose(soubor);
}

int init()
{
	//testovani otevreni souboru
	if((soubor = fopen("proj2.out", "w")) == NULL)
	{
		fprintf(stderr, "Error nepodaril se otevrit soubor proj2.out\n");
		return 1;
	}
	//zapraneni souboru aby se buffroval
	setbuf(soubor, NULL);

	//tvorba semaforu, pokud semafor jiz existuje/nejde vytvorit, sprusti ukoncovani vsech semaforu a promnenych
	if ((semafor_konec = sem_open("/ios.xgajdo24.semafor_konec", O_CREAT | O_EXCL, 0666, 1)) == SEM_FAILED )
	{
		uklid();
		fprintf(stderr, "Error nepodaril se vytvorit semafor_konec\n");
		return 1;
	}

	if ((semafor_zastavka = sem_open("/ios.xgajdo24.semafor_zastavka", O_CREAT | O_EXCL, 0666, 1)) == SEM_FAILED )
	{
		uklid();
		fprintf(stderr, "Error nepodaril se vytvorit semafor_zastavka\n");
		return 1;
	}

	if ((semafor_otevrit = sem_open("/ios.xgajdo24.semafor_otevrit", O_CREAT | O_EXCL, 0666, 0)) == SEM_FAILED )
	{
		uklid();
		fprintf(stderr, "Error nepodaril se vytvorit semafor_otevrit\n");
		return 1;
	}

	if ((semafor_odjezd = sem_open("/ios.xgajdo24.semafor_odjezd", O_CREAT | O_EXCL, 0666, 0)) == SEM_FAILED )
	{
		uklid();
		fprintf(stderr, "Error nepodaril se vytvorit semafor_odjezd\n");
		return 1;
	}

	if ((semafor_vystupovat = sem_open("/ios.xgajdo24.semafor_vystupovat", O_CREAT | O_EXCL, 0666, 0)) == SEM_FAILED )
	{
		uklid();
		fprintf(stderr, "Error nepodaril se vytvorit semafor_vystupovat\n");
		return 1;
	}

	if ((semafor_stridani = sem_open("/ios.xgajdo24.semafor_stridani", O_CREAT | O_EXCL, 0666, 1)) == SEM_FAILED )
	{
		uklid();
		fprintf(stderr, "Error nepodaril se vytvorit semafor_stridani\n");
		return 1;
	}

	//vytvareni sdilenych promnenych
	cislovani = mmap(NULL, sizeof(*(cislovani)), PROT_READ|PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, -1, 0);
	poc_rider = mmap(NULL, sizeof(*(poc_rider)), PROT_READ|PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, -1, 0);
	poc_na_zast = mmap(NULL, sizeof(*(poc_na_zast)), PROT_READ|PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, -1, 0);
	poc_v_busu = mmap(NULL, sizeof(*(poc_v_busu)), PROT_READ|PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, -1, 0);
	kap_bus = mmap(NULL, sizeof(*(kap_bus)), PROT_READ|PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, -1, 0);
	poc_finished = mmap(NULL, sizeof(*(poc_finished)), PROT_READ|PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, -1, 0);

	return 0;
}

int main(int argc, char const *argv[])
{	
	//overeni vstupu a sprvanost vytvoreni semaforu a promnenych
	if (argc != 5)
	{
		fprintf(stderr, "Error nesprvny pocet argumentu\n");
		return 1;
	}
	if ( atoi(argv[1]) <= 0 || atoi(argv[2]) <= 0 || atoi(argv[3]) < 0 || atoi(argv[3]) > 1000 || atoi(argv[4]) < 0 || atoi(argv[4]) > 1000)
	{
		fprintf(stderr, "Error nesprvne hodnoty argumentu \n");
		return 1;
	}
	if (init() == -1)
	{
		uklid();
		return 1;
	}

	//pomocne nacteni argumetu do promnenych
	unsigned poc_rideru = atoi(argv[1]);
	*kap_bus = atoi(argv[2]);
	unsigned cas_gen_rider = atoi(argv[3]);
	unsigned cas_sim_jizda = atoi(argv[4]);

	//rozvetveni procesu
	pid_t bus = fork();
	if (bus == 0)
	{
		bus_cesta(cas_sim_jizda, poc_rideru);
	}
	else
	{
		pid_t gen = fork();
		if (gen == 0)
		{
			rider_gen(poc_rideru, cas_gen_rider);
		}
	}

	//cekani na dokonceni procesu
	int promena;
	waitpid(bus, &promena,0);
	uklid();
	return 0;
}