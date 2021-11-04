<main id="prijem">
    <?php
        if(isset($_SESSION) && isset($_SESSION['goods_added']) && $_SESSION['goods_added'] == true){
            unset($_SESSION['goods_added']);
            echo "<h2 class='message_for_user'>Zbo�� bylo p�id�no do skladu</h2>";
        }
    ?>
    <h1>P��jem zbo��</h1>

    <form method="post" action="php/scripts/pridat_zbozi.php">
        <table id="goods_table">
            <thead>
                <tr>
                    <th>N�zev</th>
                    <th>Dodavatel</th>
                    <th>Expirace</th>
                    <th>MJ</th>
                    <th>Mno�stv�</th>
                </tr> 
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" name="nazev0" placeholder="N�zev zbo��"/></td>
                    <td><input type="text" name="dodavatel0" placeholder="Dodavatel"/></td>
                    <td><input type="text" name="expirace0" placeholder="Expirace"/></td>
                    <td><input type="text" name="mj0" placeholder="MJ"/></td>
                    <td><input type="text" name="mnozstvi0" placeholder="Mno�stv�"/></td>
                </tr>  
                <tr>
                    <td colspan="5"><input id="add_button" type="button" value="+" onclick="add_row(1)"/></td>
                </tr>  
            </tbody>
        </table>
        <textarea rows="6" cols="70" placeholder="Zde m��ete napsat pozn�mku k dod�vce" name="poznamka"></textarea>
        Datum p�ijet�: <input type="date" name="datum_pohybu" id="datum_pohybu">
        <input type="text" name="smer" value="0" hidden="true" />
        <input type="submit" name="save" value="Ulo�it">
    </form>

</main>

<script>
    var index = 0;
    
    window.onload = today_date_to_form;

    function add_row(){
        index++;
        var table = document.getElementById("goods_table");
        var row = table.insertRow(table.rows.length-1);    
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = '<input type="text" name="nazev'+index+'" placeholder="N�zev zbo��"/>';
        cell2.innerHTML = '<input type="text" name="dodavatel'+index+'" placeholder="Dodavatel"/>';
        cell3.innerHTML = '<input type="text" name="expirace'+index+'" placeholder="Expirace"/>';
        cell4.innerHTML = '<input type="text" name="mj'+index+'" placeholder="MJ"/>';
        cell5.innerHTML = '<input type="text" name="mnozstvi'+index+'" placeholder="Mno�stv�"/>';
    }

    function today_date_to_form(){n =  new Date();
        y = n.getFullYear();
        m = n.getMonth() + 1;
        d = n.getDate();
        document.getElementById("datum_pohybu").value = y + "-" + m + "-" + d;
    }
</script>