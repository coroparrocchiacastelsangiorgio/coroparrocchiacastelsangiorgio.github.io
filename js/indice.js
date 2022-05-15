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
            ul = document.querySelector("#lista-canti");
            li = ul.querySelector('.elemento-lista-canti');
            indicejson.forEach(cantojson => {
                nuovonodo = li.cloneNode(true);
                a = nuovonodo.querySelector(".link-lista-canti")
                a.innerText = cantojson.titolo;
                a.href = "db/testi/" + cantojson.id + ".html";
                // TODO add tags in span elements with class name "tag-lista-canti"
                ul.appendChild(nuovonodo);
            });
        });
}

function ricerca() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.querySelector('#barra-ricerca-canti');
    filter = input.value.toUpperCase();
    ul = document.querySelector("#lista-canti");
    li = ul.querySelector('.elemento-lista-canti');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].querySelector(".link-lista-canti")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) <= -1) {
            li[i].style.display = "none";
        }
    }

    // TODO loop through span elements with class name "tag-lista-canti" -- each li has several spans

}