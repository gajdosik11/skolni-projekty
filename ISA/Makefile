#projekt ISA - DNS resolver
#Autor: Jakub Gajdšík (xgajdo24)
dns : dns.o
	@g++ -o dns dns.o


dns.o: dns.cpp
	@g++ -c dns.cpp 

clean:
	@rm *.o
	@rm dns

test:
	@./test.sh

