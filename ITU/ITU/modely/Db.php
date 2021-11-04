<!---Autoøi: xmarek69, xbilid01, xgajdo24 --->
<?php

// Wrapper pro snadnìj¹í práci s databází s pou¾itím PDO a automatickým
// zabezpeèením parametrù (promìnných) v dotazech.

class Db {

	// Databázové spojení
    private static $spojeni;

	// Výchozí nastavení ovladaèe
    private static $nastaveni = array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES latin2",
		PDO::ATTR_EMULATE_PREPARES => false,
	);

	// Pøipojí se k databázi pomocí daných údajù
    public static function pripoj($host, $uzivatel, $heslo, $databaze) {
		if (!isset(self::$spojeni)) {
			self::$spojeni = @new PDO(
				"mysql:host=$host;dbname=$databaze;charset=utf8",
				$uzivatel,
				$heslo,
				self::$nastaveni
			);
		}
	}

	// Spustí dotaz a vrátí z nìj první øádek
    public static function dotazJeden($dotaz, $parametry = array()) {
		$navrat = self::$spojeni->prepare($dotaz);
		$navrat->execute($parametry);
		return $navrat->fetch();
	}

	// Spustí dotaz a vrátí v¹echny jeho øádky jako pole asociativních polí
    public static function dotazVsechny($dotaz, $parametry = array()) {
		$navrat = self::$spojeni->prepare($dotaz);
		$navrat->execute($parametry);
		return $navrat->fetchAll();
	}

	// Spustí dotaz a vrátí z nìj první sloupec prvního øádku
    public static function dotazSamotny($dotaz, $parametry = array()) {
		$vysledek = self::dotazJeden($dotaz, $parametry);
		return $vysledek[0];
	}

	// Spustí dotaz a vrátí poèet ovlivnìných øádkù
	public static function dotaz($dotaz, $parametry = array()) {
		$navrat = self::$spojeni->prepare($dotaz);
		$navrat->execute($parametry);
		return $navrat->rowCount();
	}

	// Update/Insert...vraci posledni vlozene ID
    public static function updateOrInsert($dotaz, $parametry = array()) {
		$navrat = self::$spojeni->prepare($dotaz);
		$navrat->execute($parametry);
		return self::$spojeni->lastInsertId();
	}

}