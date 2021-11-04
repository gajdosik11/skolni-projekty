<main id="nastaveni">

<?php
    if(isset($_SESSION) && isset($_SESSION['settings_saved']) && $_SESSION['settings_saved'] == true){
        unset($_SESSION['settings_saved']);
        echo "<h2 style='color:green'>Zm�ny byli ulo�eny</h2>";
    }
    $nastaveni = get_nastaveni_array($pdo);
    $nazev = $nastaveni['nazev']? "checked" : "";
    $dodavatel = $nastaveni['dodavatel']? "checked" : "";
    $expirace = $nastaveni['expirace']? "checked" : "";
    $mj = $nastaveni['mj']? "checked" : "";
    $mnozstvi = $nastaveni['mnozstvi']? "checked" : "";
?>
    <h1>Nastaven�</h1>

    <form method="post"  action="php/scripts/save_settings.php">
        <h2>Vyberte, kter� vlastnosti zbo�� chcete ukl�dat:</h2>
        <table id="properties_table">
            <tr>
                <td>N�zev</td>
                <td>Dodavatel</td>
                <td>Expirace</td>
                <td>M�rn� jednotka</td>
                <td>Mno�stv�</td>
            </tr> 
            <tr>
                <td><input type="checkbox" name="nazev" value="checked" <?php echo $nazev ?>></td>
                <td><input type="checkbox" name="dodavatel" value="checked" <?php echo $dodavatel ?>></td>
                <td><input type="checkbox" name="expirace" value="checked" <?php echo $expirace ?>></td>
                <td><input type="checkbox" name="mj" value="checked" <?php echo $mj ?>></td>
                <td><input type="checkbox" name="mnozstvi" value="checked" <?php echo $mnozstvi ?>></td>
            </tr>  
        </table>
        
        <input type="submit" name="save" value="Ulo�it">
    </form>

</main>