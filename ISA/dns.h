//
// Autor: Jakub Gajdosik (xgajdo24)
// Zadani: DNS resolver
//

#ifndef DNS_PACKETS_H
#define DNS_PACKETS_H

void exitHelp();

/*
 * Predloha pro DNS paket pro komunikaci
 *
 * struct dnsPacket
 * {
 *   struct dnsHeader header;
 *   struct dnsQuestion question;
 *   struct dnsAnswer answer;
 * };
 */


/*
 * Hlavicka obsahujici priznaky pro vyhledavani a priznaky odpovedi
 *
 */
struct dnsHeader
{
    unsigned short id; // identifikace
    unsigned short flags; //priznaky pro vyhledavani
    unsigned short qdcount; // pocet otazek
    unsigned short ancount; // pocet odpovedi
    unsigned short nscount; // pocet autoritativnich odpovedi
    unsigned short arcount; // pocet doplnujicich odpovedi
};
/*
 * Specifikace dotazu
 */
struct dnsQuestionData
{
    unsigned short qtype; // typ dotazu A/AAA/CNAME/PTR
    unsigned short qclass; // trida ve ktere se dotazujeme IN
};

/*
 * Hlavicka dotazunazvem serveru
 */
struct dnsQuestion
{
    unsigned char *qname; // nazev dotazovaneho serveru
    struct dnsQuestionData *qdata; //specifikace dotazu
};

/*
 * Specifikace odpovedi
 */
#pragma pack(push, 1) //zarovnani struktury
struct dnsAnswerData
{
    unsigned short type; // typ odpovedi
    unsigned short dclass; // trida odpovedi
    unsigned int ttl; // hodnota TTL
    unsigned short rdlength; // velikost odpovedi
};
#pragma pack(pop)

/*
 * Hlavicka odpovedi
 */
struct dnsAnswer
{
    unsigned char *name; // nazerv odpovedi
    struct dnsAnswerData *data; // specifikace odpovedi
    unsigned char *rdata; // data odpovedi
};

#endif //DNS_PACKETS_H
