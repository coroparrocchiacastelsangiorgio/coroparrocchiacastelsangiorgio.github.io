document.addEventListener('DOMContentLoaded', mostracanto);

function mostracanto() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
        id = urlParams.get('id');
        fetch('https://coroparrocchiacastelsangiorgio.github.io/db/metadati/' + id + '.json')
            .then(response => response.text())
            .then(data => {
                metadatijson = JSON.parse(data);
                // popola i metadati
                h1 = document.getElementById("titolo");
                h1.textContent = metadatijson.titolo;
                tagtext = "(";
                metadatijson.tag.forEach(ttext => {
                    tagtext = tagtext + ttext + ", ";
                });
                tagtext = tagtext.substring(0, tagtext.length - 2);
                tagtext = tagtext + ")"
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