<!---Auto�i: xmarek69, xbilid01, xgajdo24 --->
<?php

// Wrapper pro snadn�j�� pr�ci s datab�z� s pou�it�m PDO a automatick�m
// zabezpe�en�m parametr� (prom�nn�ch) v dotazech.

class Db {

	// Datab�zov� spojen�
    private static $spojeni;

	// V�choz� nastaven� ovlada�e
    private static $nastaveni = array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES latin2",
		PDO::ATTR_EMULATE_PREPARES => false,
	);

	// P�ipoj� se k datab�zi pomoc� dan�ch �daj�
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

	// Spust� dotaz a vr�t� z n�j prvn� ��dek
    public static function dotazJeden($dotaz, $parametry = array()) {
		$navrat = self::$spojeni->prepare($dotaz);
		$navrat->execute($parametry);
		return $navrat->fetch();
	}

	// Spust� dotaz a vr�t� v�echny jeho ��dky jako pole asociativn�ch pol�
    public static function dotazVsechny($dotaz, $parametry = array()) {
		$navrat = self::$spojeni->prepare($dotaz);
		$navrat->execute($parametry);
		return $navrat->fetchAll();
	}

	// Spust� dotaz a vr�t� z n�j prvn� sloupec prvn�ho ��dku
    public static function dotazSamotny($dotaz, $parametry = array()) {
		$vysledek = self::dotazJeden($dotaz, $parametry);
		return $vysledek[0];
	}

	// Spust� dotaz a vr�t� po�et ovlivn�n�ch ��dk�
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