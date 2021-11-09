Aplikace byl implementována pomocí aplikačního rámce Angular. Aplikace je dostupná na adresách:
https://ticketeer-4d3d3.firebaseapp.com/
https://ticketeer-4d3d3.firebaseapp.com/admin.html 
První adresa vede na aplikační část sloužící k prodeji vstupenek a druhá na část odpovídající za správu událostí a vstupenek. 
Pro přihlášení je možné použit vývojový účet "test@test.cz" s heslem "testtest".

Potřebné nástroje:
Angular:
	NodeJS: https://nodejs.org/en/download/
	TypeScript: https://www.npmjs.com/package/typescript
	Angular CLI: https://angular.io/cli
Vue:
	NodeJS: https://nodejs.org/en/download/
	Vue CLI: https://cli.vuejs.org/guide/installation.html

Angular:
Angular aplikace má velké množství knihoven, na kterých závisí, a z důvodu velikosti je nebylo možné odevzdat. Je proto nutné je spustit v adresáři "src/ticketeer/" script "npm install", který zajistí přítomnost potřebných knihoven, a následně stejný skript spustit v "src/ticketeer/functions".

Seznam závislých knihoven:
	"@angular-material-components/file-input": "^5.0.1",
    "@angular/animations": "^9.0.6",
    "@angular/cdk": "^9.1.3",
    "@angular/common": "~9.0.6",
    "@angular/compiler": "~9.0.6",
    "@angular/core": "~9.0.6",
    "@angular/elements": "^9.0.6",
    "@angular/fire": "^5.4.2",
    "@angular/flex-layout": "^9.0.0-beta.29",
    "@angular/forms": "^9.0.6",
    "@angular/material": "^9.1.3",
    "@angular/platform-browser": "~9.0.6",
    "@angular/platform-browser-dynamic": "~9.0.6",
    "@angular/router": "^9.0.6",
    "@crcastle/html2canvas": "^1.0.0-rc.5-2",
    "@fortawesome/angular-fontawesome": "^0.6.1",
    "@fortawesome/fontawesome-svg-core": "^1.2.28",
    "@fortawesome/free-brands-svg-icons": "^5.13.0",
    "@fortawesome/free-regular-svg-icons": "^5.13.0",
    "@fortawesome/free-solid-svg-icons": "^5.13.0",
    "document-register-element": "^1.14.3",
    "firebase": "^7.11.0",
    "hammerjs": "^2.0.8",
    "moment": "^2.24.0",
    "ngx-auth-firebaseui": "^4.0.1",
    "ngx-braintree": "^8.0.0",
    "pdfkit": "^0.12.1",
    "rxjs": "~6.5.4",
    "tslib": "^1.11.1",
    "vue": "^2.6.12",
    "zone.js": "~0.10.3"

Databáze a hostování aplikace se nachází na platformě Firebase. Odesílání e-mailů je zajištěno pomocí platformy SendGrid. Platební brána je uskutečněna pomocí postálu Braintree.
Tyto platformy jsou snadno zneužitelné a nechci k nim sdílet přihlašovací údaje. V případě potřeby vedoucího nebo oponenta je rád osobně předám, nicméně nepokládám za rozumné je zveřejnit.

Pro produkční kompilaci angularové části aplikace je zapotřebí spustit skript "npm run package", který je uvnitř složky "src/ticketeer/".
Ten zkopiluje aplikaci a výslednou minimalizovanou podobu vloží do místa "src/ticketeer/web/elements/elements.js" a styly vloží do "src/ticketeer/web/css/elements.css"
Aplikace je v produkční podobě, pro vývoj byl použit lokální server za pomoci skriptu "npm run start". Ten nyní apliakci zkompiluje, ale z důvodu převádění aplikace do web komponenty je nemožné aplikaci lokálně spustit.
Pro vývoj bylo nutné spouštět serverové funkce lokálně pomocí skriptů "npm run serve" a "npm run start", které je zapotřebí použít ve složce "src/ticketeer/functions". Ty simulovaly komunikaci se serverem.

Vue:
Aplikační část vytvořená pomocí Vue vyžaduje velké množství knihoven. Je tedy nejříve nutné spustit skript "npm install" ve složce "src/tickets-component-wc".
Poté je možné spustit ve stejné složce skript "npm run server", který spustí aplikaci lokálně.
Aplikace se kompiluje do produkční verze pomocí skriptu "npm run wc-build" a produkční verze se dá lokálně otestovat pomocí skriptu "npm run wc-test".
Pro předání Vue web komponenty Angularu je nutné přesunout soubor "src/tickets-component-wc/dist/printable-tickets.min.js" do "src/ticketeer/src/assets"

Neuvedené složky v aplikacích jsou konfigurační a nepodstatné.

Podstatná souborová struktura:
README.txt - soubor s návodem
text - složka obsahující práci a její zdrojový kód
SRC - složka obsahující zrojový kód aplikace
	-ticketeer - angularová část aplikace
		-dm - složka s třídami reprezentující data z databáze
		-functions - obsahuje soubory potřebné pro kompilaci funkcí určených pro server, podstatný je soubor "src/index.ts"
		-src - složka s kódem, který jsem napsal
			-app -obsahuje podstatné soubory s kódem, všechny soubory v těchto složkách jsou podstatné
				-admin - kod pro správu vstupenek
					-ticket-event-table - komponenta zobrazující tabulku
						-create-or-edit-ticket-event-dialog - komponenta pro tvorbu a úpravu událostí
					-ticket-validátor - komponenta pro validaci lístků
				-shared - složka s pomocnými službami
					-code-reader - služba pro zpracování kódu čtečkou
					-forms - služba a třídy pro správu formulářů
					-loader - komponenta pro animaci načítání
					-sweet-alert - komponenta pro animaci úspěchu nebo chyby
					-timeout - komponenta pro časomíru při nákupu vstupenek
				-tickets - kod pro prodej vstupenek
			-assets - obsahuje vue web komponentu
			-enviroment - obsahuje konfigurační soubory pro databázi
		web - obsahuje ilustrační použití aplikace
			-elements - obsahuje zmenšené verze web komponent z Angular a Vue
	-tickets-component-wc - obsahuje soubory s kódem a konfigurační soubory pro Vue část aplikace
		-src - obsahuje soubory s kódem, podstatný je "App.vue"
			- components - obsahuje komponentu pro vizualizaci vstupenky