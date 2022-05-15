document.addEventListener('DOMContentLoaded', mostraindice);


function mostraindice() {
    fetch('db/indice.json')
        .then(response => response.text())
        .then(data => {
            // Do something with your data
            // indice.json è una lista. ordina per titolo, dopodiche mostra nella lista con id "lista-canti"
            console.log(data);
        });
}

function ricerca() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('barra-ricerca-canti');
    filter = input.value.toUpperCase();
    ul = document.getElementById("lista-canti");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}