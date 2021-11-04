<main id="sklad">
	<h1>Jste v sklad</h1>
<?php
	$zbozi = get_last_nth_goods($pdo, 10);

	$nazev_header = get_nastaveni_header($pdo, "N�zev");
	$dodavatel_header = get_nastaveni_header($pdo, "Dodavatel");
	$expirace_header = get_nastaveni_header($pdo, "Expirace");
	$mj_header = get_nastaveni_header($pdo, "MJ");
	$mnozstvi_header = get_nastaveni_header($pdo, "Mno�stv�");
	echo <<<EndOfString
		<table>
			<tr>
				{$nazev_header}
				{$dodavatel_header}
				{$expirace_header}
				{$mj_header}
				{$mnozstvi_header}
			</tr>
EndOfString;

	for($i = 0; $i < count($zbozi); $i++){
		$nazev = get_nastaveni_cell($pdo, $i, "N�zev");
		$dodavatel = get_nastaveni_cell($pdo, $i, "Dodavatel");
		$expirace = get_nastaveni_cell($pdo, $i, "Expirace");
		$mj = get_nastaveni_cell($pdo, $i, "MJ");
		$mnozstvi = get_nastaveni_cell($pdo, $i, "Mno�stv�");
		echo <<<EndOfString
			<tr>
				{$nazev}
				{$dodavatel}
				{$expirace}
				{$mj}
				{$mnozstvi}
			</tr>
EndOfString;
	}

	echo <<<EndOfString
		</table>
EndOfString;

?>
</main>