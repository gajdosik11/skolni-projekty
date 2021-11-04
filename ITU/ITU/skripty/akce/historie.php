<main id="historie">
	<h1>Historie pohyb� na sklad�</h1>
<?php
	$zbozi = get_last_nth_goods($pdo, 10);

	$nazev_header = get_nastaveni_header($pdo, "N�zev");
	$dodavatel_header = get_nastaveni_header($pdo, "Dodavatel");
	$expirace_header = get_nastaveni_header($pdo, "Expirace");
	$mj_header = get_nastaveni_header($pdo, "MJ");
	$mnozstvi_header = get_nastaveni_header($pdo, "Mno�stv�");
	echo <<<EndOfString

	<div class="pohyb">
		<table id="pohyb_info_table">
			<tr>
				<th>Datum</th>
				<td>20. 5. 2019</td>
			</tr>
			<tr>
				<th>Typ</th>
				<td>P��jem zbo��</td>
			</tr>
			<tr rowspan="2">
				<th rowspan="2">Pozn�mka</th>
				<td rowspan="2">asd asdakjs dpajsd oaisjd oaisjdk okasdjoa skdij ioj </td>
			</tr>
			<tr>
			</tr>
		</table>

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
	</div>
EndOfString;

?>
</main>