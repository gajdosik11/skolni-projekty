// tail2.cc
// Řešení IJC-DU2, příklad a) 20.3.2018
// Autor: Jakub Gajdošík, FIT
// Přeloženo: g++
#include <stdlib.h>
#include <iostream>
#include <fstream>
#include <string>
#include <queue>

using namespace std;

#define RADKY 10

int vypis(std::istream& vstup,int radky)
{
	int citac = 0;
	std::string radek;
	std::queue<std::string>kontejner;

	while(!vstup.eof() && citac <= radky)
	{
		std::getline(vstup, radek);
		kontejner.push(radek);
		citac++;
	}

	while(!vstup.eof())
	{
		std::getline(vstup, radek);
		kontejner.pop();
		kontejner.push(radek);
	}

	for (int i = 0; i < citac-1; ++i)
	{
		std::cout << kontejner.front() << std::endl;
		kontejner.pop();
	}
	
	return 1;	
}


int main(int argc, char const *argv[])
{
	std::ios::sync_with_stdio(false);

	std::istream* vstup = &std::cin;
	std::ifstream soubor;
	int vysledek = -1;
	int radky = RADKY;
	switch(argc) {

		case 1:
			break;

		case 2:
			soubor.open(argv[1]);
			/*if(soubor == NULL)
			{
				std::cerr << "Error nepodarilo se otevrit soubor" << std::endl;
				return -1;
			}*/
			vstup=&soubor;
			break;

		case 3:
			if (argv[1] != std::string("-n"))
			{
				std::cerr << "Error spatny format argumentu" << argv[1] << std::endl;
				return -1;
			}
			else
			{
				if (atoi(argv[2]) < 0)
				{
					std::cerr << "Error spatny format argumentu" << argv[2] << std::endl;
					return -1;
				}
				else
				{
					radky = atoi(argv[2]);
				}
			}
			break;

		case 4:
			if (argv[1] != std::string("-n"))
			{
				std::cerr << "Error spatny format argumentu" << argv[1] << std::endl;
				return -1;
			}
			else
			{
				if (atoi(argv[2]) < 0)
				{
					std::cerr << "2Error spatny format argumentu" << argv[2] << std::endl;
					return -1;
				}
				else
				{
					radky = atoi(argv[2]);
					soubor.open(argv[3]);
					if(vstup == NULL)
					{
						std::cerr << "Error nepodarilo se otevrit soubor" << std::endl;
						return -1;
					}
					vstup = &soubor;
				}
			}
			break;
	default:
		std::cerr << "Error spatny format argumentu" << std::endl;
				return -1;
	}

	vysledek = vypis(*vstup, radky);
	soubor.close();
	
	return vysledek;
}