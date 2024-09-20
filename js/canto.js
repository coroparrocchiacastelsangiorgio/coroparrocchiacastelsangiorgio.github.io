document.addEventListener('DOMContentLoaded', mostracanto);

function mostracanto() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
        id = urlParams.get('id');
        fetch('https://coroparrocchiacastelsangiorgio.github.io/db/indice.json')
            .then(response => response.text())
            .then(data => {
                indicejson = JSON.parse(data);
                // cerca il canto nell'indice
                metadatijson = indicejson.find(canto => {
                    return canto.id == id;
                });
                // popola i metadati
                document.title = metadatijson.titolo;
                h1 = document.getElementById("titolo");
                h1.textContent = metadatijson.titolo;
                tagtext = "Canto adatto per: ";
                metadatijson.tag.forEach(ttext => {
                    tagtext = tagtext + ttext + ", ";
                });
                tagtext = tagtext.substring(0, tagtext.length - 2);
                tag = document.getElementById("tag");
                tag.textContent = tagtext;
            });
            fetch('https://coroparrocchiacastelsangiorgio.github.io/db/testi/' + id + '.html')
            .then(response => response.text())
            .then(data => {
                // popola il testo
                div = document.getElementById("testo");
                div.innerHTML = data;
            });
    }
}