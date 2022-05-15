document.addEventListener('DOMContentLoaded', mostraindice);

function mostraindice() {
    fetch('https://coroparrocchiacastelsangiorgio.github.io/db/indice.json')
        .then(response => response.text())
        .then(data => {
            indicejson = JSON.parse(data);
            // ordina per titolo
            indicejson.sort(function (first, second) {
                return first.titolo.localeCompare(second.titolo);
            });
            // popola la lista canti
            ul = document.getElementById("lista-canti");
            li = ul.getElementsByClassName('elemento-lista-canti')[0];
            indicejson.forEach(cantojson => {
                nuovonodo = li.cloneNode(true);
                a = nuovonodo.getElementsByClassName("link-lista-canti")[0];
                a.textContent = cantojson.titolo;
                a.href = "canto.html?id=" + cantojson.id;
                // aggiungi tag in elementi span (saranno invisibili)
                span = nuovonodo.getElementsByClassName("tag-lista-canti")[0];
                tag = cantojson.tag;
                tag.forEach(tagjson => {
                    nuovospan = span.cloneNode(true);
                    nuovospan.textContent = tagjson;
                    nuovonodo.appendChild(nuovospan);
                });
                span.remove();
                // aggiungi nuovo elemento alla lista canti
                ul.appendChild(nuovonodo);
            });
            li.remove();
        });
}

function ricerca() {
    // Declare variables
    var input, ul, li, a, spanlist, i, j, found;
    input = document.getElementById('barra-ricerca-canti').value.toUpperCase();
    ul = document.getElementById("lista-canti");
    li = ul.getElementsByClassName('elemento-lista-canti');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        found = false;
        a = li[i].getElementsByClassName("link-lista-canti")[0];
        if (a.textContent.toUpperCase().indexOf(input) > -1) {
            found = true;
        }
        spanlist = li[i].getElementsByClassName("tag-lista-canti");
        for (j = 0; j < spanlist.length; j++) {
            if (spanlist[j].textContent.toUpperCase().indexOf(input) > -1) {
                found = true;
            }
        }
        if (found == true) {
            li[i].style.display = "";
        }
        else {
            li[i].style.display = "none";
        }
    }
}