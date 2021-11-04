//
// Autor: Jakub Gajdosik (xgajdo24)
// Zadani: DNS resolver
//

#include <iostream>
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string>
#include <algorithm>
#include <string.h>
#include <sys/socket.h>
#include <netdb.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include "dns.h"

using namespace std;

/*
 * vypsani navodu pro spusteni a ukonceni
 */
void exitHelp() {
    fprintf(stderr, "./dns [-h] [-r] [-x] [-6] -s server [-p port] adresa \n"
    "-s server: Jedna se o ip adresu nebo domenu DNS serveru na ktery bude dotaz zaslan. Po priznaku musi ihned nasledovat server.\n"
    "adresa: Dotazovana adresa na kterou se ptame, muze to byt domena ci ip adresa viz nize. Adresa musi byt zadana jako posledni prvek.\n"
    "-h: Vypise na standartni vystup napovedu pro pouziti programu.\n"
    "-r: Rekurze serveru je vyzadovana. Pokud server muze, tak zpracovava dotaz rekurzivne, cimz se pta ostatnich serveru na stejny dotak, pokud sam nezna odpoved.\n"
    "-x: Dotaz je reverzni. Namisto argumentu adresy je nutne zadat ip adresu na kterou se ptame a server nam da odpoved ve formatu domeny.\n"
    "-6: Dotaz je typu AAAA. Tim zmenime v otazce typ ip adresy na kterou se dotazujeme z ipv4 na ipv6.\n"
    "-p port: Dotaz bude zaslan na cislo daneho portu. Pokud server na tomto portu nasloucha, tak komunikace probiha identicky jen s jinym portem.\n"
         "Vychozi port je 53. Po priznaku musi ihned nasledovat cislo portu.\n");
    exit(2);
}

/*
 * Funkce pro parsovani argumentuz
 */
void
parseArgs(int argc, char **argv, string &address, string &serverName, int &flags, int &port, int &flagX, int &flag6) {
    int c;
    opterr = 0;
    while ((c = getopt(argc, argv, "hrx6s:p:")) != -1)
        switch (c) {
            case 'h':
                exitHelp();
                break;
            case 'r':
                flags = flags | 0x0100;
                break;
            case 'x':
                flagX = 1;
                break;
            case '6':
                flag6 = 1;
                break;
            case 's':
                if (reinterpret_cast<const char *>(optarg[0]) == "-")
                    exitHelp();
                serverName = optarg;
                break;
            case 'p':
                if (0 < stoi(optarg) | stoi(optarg) < 65535)
                    port = stoi(optarg);
                else
                    fprintf(stderr, "Priznak -p pozaduje cislo portu.\n");
                break;
            case '?':
                if (optopt == 's')
                    fprintf(stderr, "Priznak -%c pozaduje argument.\n", optopt);
                else if (isprint(optopt))
                    fprintf(stderr, "Neznami priznak `-%c'.\n", optopt);
                else
                    fprintf(stderr,
                            "Neznami znak `\\x%x'.\n",
                            optopt);
                exitHelp();
            default:
                abort();
        }
    if (optind == argc - 1)
        address = argv[optind];
    else
        exitHelp();

}

/*
 * Prevod ip adresi A nebo AAAA na format odeslatelny v paketu
 *
 */
void ipToReverse(string &address) {
    unsigned char buf[sizeof(struct in6_addr)];
    if (address.find('.') != std::string::npos) { // ipv4 8.8.4.4 -> 4.4.8.8.in-addr.arpa
        if (inet_pton(AF_INET, address.c_str(), buf) == 1) {
            int n = address.length();
            for (int i = 0; i < n / 2; i++)
                swap(address[i], address[n - i - 1]);
            address += ".in-addr.arpa";
        } else {
            fprintf(stderr, "Spatny format ip\n");
            exitHelp();
        }
    } else {
        if (inet_pton(AF_INET6, address.c_str(), buf) == 1) { // ipv6 001:db8::567:89ab ->
            address = "";   //b.a.9.8.7.6.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa
            for (int i = 0; i < sizeof(struct in6_addr); ++i) {
                address += to_string(((buf[i]) >> 4)) + '.' + to_string((buf[i] & 0x0f)) + '.';
            }
            int n = address.length();
            for (int i = 0; i < n / 2; i++)
                swap(address[i], address[n - i - 1]);
            address += ".ip6.arpa";
            address.erase(0, 1);
        } else {
            fprintf(stderr, "Spatny format ipv6 \n");
            exitHelp();
        }
    }
}

/*
 * Prevedeni adresy z argumentu na typ Qname pro dotaz
 * z www.google.com na 3www6google3com
 * Pri priznaku -x se pouzije prevedeni ip do spravneho formatu
 */
void addressToQname(string &address, int &flagX) {
    if (flagX)
        ipToReverse(address);
    int diff = 0;
    address.insert(0, 1, '.');
    int pos = address.find('.');
    while (pos != address.length()) {
        diff = pos;
        if ((pos = address.find('.', diff + 1)) == -1)
            pos = address.length();
        address.replace(diff, 1, 1, pos - diff - 1);
    }
}

/*
 * Prevedeni Qname z odpovedi na vypsatelny format
 */
string qnameToAddress(unsigned char *qname) {
    string res;
    int i = 1;
    while (qname[i] != '\0') {
        for (int j = qname[i - 1]; j > 0; j--) {
            res[i - 2] = qname[i++];
        }
        i++;
        res[i - 2] = '.';
    }
    res[i - 1] = qname[i];
    return res;
}

/*
 * Precteni odpovedi od serveru
 * funkce posouva pointer pro dalsi zpracovani dat
 * pozn. implementace posunu ukazovatle byla nejobtiznejsi cast projekt a chtel jsem ho vzdat
 */
string readAnswer(unsigned char *pointer, unsigned char *buff, int *mark) {
    int jumped = 0; // priznak skoku v odpovedi (hodnota pointeru 192 = skok)
    unsigned int i, c;
    *mark = 1; // zalozka pro cteni dalsich informaci
    string ans = "";
    for (i = 0; *pointer != 0; pointer++, i++) {
        if (*pointer < 192) // zapisuj dal sata
            ans[i] = *pointer;
        else { // data jsou jinde
            pointer = buff + (*pointer) * 256 + *(pointer + 1) - 49152 - 1;
            i--;
            jumped++;
        }
        if (!jumped)
            *mark = *mark + 1;
    }
    ans[i] = '\0';
    // prevedeni 3www6google3com na www.google.com
    for (i = 0; i < (int) strlen((const char *) ans.c_str()); i++) {
        c = ans[i];
        for (int j = 0; j < (int) c; j++, i++)
            ans[i] = ans[i + 1];
        ans[i] = '.';
    }
    if (jumped)
        *mark = *mark + 1;
    return ans;
}

/*
 * Vypsani hlavicky vysledku a otazky na kterou jsme se ptali
 */
void printHeader(struct dnsHeader *dns, unsigned char *buf, unsigned char *questionName) {
    string ansType, ansClass;

    // hlavicka odpovedi
    printf("\nAuthoritative: ");
    printf((((ntohs(dns->flags) & 0x0400) == 0x0400) ? "Yes" : "No"));
    printf(", Recursive: ");
    printf((((((ntohs(dns->flags) & 0x0100) == 0x0100) && ((ntohs(dns->flags) & 0x0080) == 0x0080))) ? "Yes" : "No"));
    printf(", Truncated: ");
    printf((((ntohs(dns->flags) & 0x0200) == 0x0200) ? "Yes" : "No"));

    // otazka
    printf("\nQuestion section (%d)", ntohs(dns->qdcount));
    printf("\n  %s", qnameToAddress((unsigned char *) &buf[sizeof(struct dnsHeader)]).c_str());

    // typ
    switch (ntohs(((struct dnsQuestionData *) &buf[sizeof(struct dnsHeader) +
                                                   (strlen((const char *) questionName) + 1)])->qtype)) {
        case 1:
            ansType = "A";
            break;
        case 2:
            ansType = "NS";
            break;
        case 5:
            ansType = "CNAME";
            break;
        case 12:
            ansType = "PTR";
            break;
        case 15:
            ansType = "MX";
            break;
        case 28:
            ansType = "AAAA";
            break;
      	default:
        	ansType = "UNKNOWN";
        	break;
    }
    printf(", %s", ansType.c_str());

    // trida
    switch (ntohs(((struct dnsQuestionData *) &buf[sizeof(struct dnsHeader) +
                                                   (strlen((const char *) questionName) + 1)])->qclass)) {
        case 1:
            ansClass = "IN";
            break;
        case 2:
            ansClass = "CS";
            break;
        case 5:
            ansClass = "CH";
            break;
        case 6:
            ansClass = "HS";
            break;
        default:
	    	ansClass = "UNKNOWN";
	    	break;
    }
    printf(", %s", ansClass.c_str());

}

/*
 * Vypsani sekci odpoved, autoritativni, doplnujici
 * funkce se vola pro kazdou sekci zvlast
 */
unsigned char *
printSection(struct dnsAnswer *section, unsigned short sectionCount, unsigned char *buf, unsigned char *pointer,
             int &mark, struct sockaddr_in &client) {
    string ansType, ansClass;

    // pro vsechny zaznami nacti data
    for (int i = 0; i < ntohs(sectionCount); i++) {
        // nacti jmeno
        section[i].name = (unsigned char *) readAnswer(pointer, buf, &mark).c_str();
        pointer = pointer + mark;

        // data
        section[i].data = (struct dnsAnswerData *) (pointer);
        pointer = pointer + sizeof(struct dnsAnswerData);

        // ip A/AAAA
        if (ntohs(section[i].data->type) == 1 | ntohs(section[i].data->type) == 28) {
            section[i].rdata = (unsigned char *) malloc(ntohs(section[i].data->rdlength));

            if (ntohs(section[i].data->type) == 1)
                for (int j = 0; j < ntohs(section[i].data->rdlength); j++)
                    section[i].rdata[j] = pointer[j];
            else {
                for (int j = 0; j < ntohs(section[i].data->rdlength); j++) {
                    section[i].rdata[j] = pointer[j];
                }
            }
            section[i].rdata[ntohs(section[i].data->rdlength)] = '\0';

            pointer = pointer + ntohs(section[i].data->rdlength);
        } else {
            //nazev
            section[i].rdata = (unsigned char *) readAnswer(pointer, buf, &mark).c_str();
            pointer = pointer + mark;
        }
    }


    // pro vsechny zaznami vypis data

    for (int i = 0; i < ntohs(sectionCount); i++) {
        // jmeno
        printf("  %s", section[i].name);
        // typ
        switch (ntohs(section[i].data->type)) {
            case 1:
                ansType = "A";
                break;
            case 2:
                ansType = "NS";
                break;
            case 5:
                ansType = "CNAME";
                break;
            case 12:
                ansType = "PTR";
                break;
            case 15:
                ansType = "MX";
                break;
            case 28:
                ansType = "AAAA";
                break;
            default:
            	ansType = "UNKNOWN";
            	break;
        }
        printf(", %s", ansType.c_str());

        // trida
        switch (ntohs(section[i].data->dclass)) {
            case 1:
                ansClass = "IN";
                break;
            case 2:
                ansClass = "CS";
                break;
            case 5:
                ansClass = "CH";
                break;
            case 6:
                ansClass = "HS";
                break;
            default:
            	ansClass = "UNKNOWN";
            	break;
        }
        printf(", %s", ansClass.c_str());


        printf(", %d", ntohl(section[i].data->ttl));

        // data
        switch (ntohs(section[i].data->type)) {
            case 1:                                        //IPv4
                client.sin_addr.s_addr = (*(long *) section[i].rdata);
                printf(", %s", inet_ntoa(client.sin_addr));
                break;
            case 2:                                         //NS
            case 5:                                         //CNAME
            case 12:                                        //PTR
            case 15:                                        //MX
                printf(", %s", section[i].rdata);
                break;
            case 28:                                        //IPv6
                char str[INET6_ADDRSTRLEN];
                inet_ntop(AF_INET6, section[i].rdata, str, INET6_ADDRSTRLEN);
                printf(", %s", str);
                break;
            default:
            	printf(", UNKNOWN\n");
            	break;

        }
        printf("\n");
        // uvolneni alokovaneho mista
        if (ntohs(section[i].data->type) == 1 | ntohs(section[i].data->type) == 28)
            free(section[i].rdata);
    }
    return pointer;
}

/*
 * Hlavni funkce kde probiha vytvareni soketu, parsovani informaci, naplneni dat pro otazku,
 * odchyceni odpovedi a volani jednotlivych vypisu dat
 */
void comunication(string &address, string serverName, int &flags, int &port, int &flagX, int &flag6) {
    // nastaveni soketu
    int socId, error, mark;
    struct sockaddr_in server, client;
    struct addrinfo hints;
    struct addrinfo *res;
    char ip[256];

    // prace s daty pro dotaz
    unsigned char *questionName, *pointer;
    struct dnsQuestionData *questionData;
    unsigned char buf[65536]; // bufer obsahujici data ktera zasilame a potom i prijmeme
    string ansType, ansClass;

    // ziskani adresy serveru (getaddrinfo) a vytvoreni soketu

    memset(&hints, 0, sizeof(struct addrinfo));
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_DGRAM;
    hints.ai_flags = 0;
    hints.ai_protocol = 0;
    if ((error = getaddrinfo(serverName.c_str(), "53", &hints, &res))) {
        fprintf(stderr, "chyba pri nacitani serveru getaddrinfo: %s\n", gai_strerror(error));
        exit(2);
    }
    if ((socId = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
        fprintf(stderr, "socket nebyl vytvoren \n");
        exit(2);
    }
    server.sin_family = AF_INET;
    server.sin_port = htons(port);
    getnameinfo(res->ai_addr, res->ai_addrlen, ip, sizeof(ip), nullptr, 0, NI_NUMERICHOST);
    inet_pton(AF_INET, ip, &(server.sin_addr));

    struct dnsHeader *dns = (struct dnsHeader *) &buf;

    // vyplneni dotazu pro server

    dns->id = (unsigned short) htons(getpid());
    dns->flags = htons(flags);
    dns->qdcount = htons(1);
    dns->ancount = 0;
    dns->nscount = 0;
    dns->arcount = 0;
    questionName = (unsigned char *) &buf[sizeof(struct dnsHeader)];
    memcpy(questionName, (unsigned char *) address.c_str(), address.length());
    questionData = (struct dnsQuestionData *) &buf[sizeof(struct dnsHeader) +
                                                   (strlen((const char *) questionName) + 1)];
    if (flagX)
        questionData->qtype = htons(12);
    else if (flag6)
        questionData->qtype = htons(28);
    else
        questionData->qtype = htons(1);
    questionData->qclass = htons(1);

    // odeslani dat
    if (sendto(socId, (char *) buf, sizeof(struct dnsHeader) + address.length() + sizeof(struct dnsQuestion), 0,
               (struct sockaddr *) &server,
               sizeof(server)) < 0) {
        fprintf(stderr, "chyba pri odesilani dat\n");
        exit(1);
    }

    //timeout po 5s pokud neprijde zprava
    struct timeval timeout;
    timeout.tv_sec = 5;
    timeout.tv_usec = 0;
    if (setsockopt(socId, SOL_SOCKET, SO_RCVTIMEO, (char *) &timeout, sizeof(timeout)) < 0) {
        fprintf(stderr, "Timeout prijmani zpravy\n");
        exit(1);

    }

    //ziskani dat a nastaveni ukazatelu
    if (recvfrom(socId, (char *) buf, 65536, 0, (struct sockaddr *) &server, (socklen_t *) &server) < 0) {
        fprintf(stderr, "chyba pri ziskavani dat\n");
        exit(1);
    }
    dns = (struct dnsHeader *) buf;
    pointer = &buf[sizeof(struct dnsHeader) + (strlen((char *) questionName) - 11) + sizeof(struct dnsQuestion)];


    // vypis ziskanych dat

    printHeader(dns, buf, questionName);

    struct dnsAnswer answer[20];
    printf("\nAnswer section (%d)\n", ntohs(dns->ancount));
    pointer = printSection(answer, dns->ancount, buf, pointer, mark, client);

    struct dnsAnswer authority[20];
    printf("Authority section (%d)\n", ntohs(dns->nscount));
    pointer = printSection(authority, dns->nscount, buf, pointer, mark, client);


    struct dnsAnswer additional[20];
    printf("Additional section (%d)\n", ntohs(dns->arcount));
    printSection(additional, dns->arcount, buf, pointer, mark, client);


}


int main(int argc, char **argv) {
    string address; //dotazovana adresa
    string serverName; //server ktereho se ptame
    int flags = 0x0000; // priznaky pro dotay
    //priznaky pro zpracovani dat
    int port = 53;
    int flagX = 0;
    int flag6 = 0;

    // priprava dat pro dotaz
    parseArgs(argc, argv, address, serverName, flags, port, flagX, flag6);
    addressToQname(address, flagX);

    // odeslani dat a zpracovani odpovedi
    comunication(address, serverName, flags, port, flagX, flag6);

    return 0;
}