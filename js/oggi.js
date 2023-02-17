document.addEventListener('DOMContentLoaded', caricamessadelgiorno);

function caricamessadelgiorno() {

    fetch('https://coroparrocchiacastelsangiorgio.github.io/oggi.json')
        .then(response => response.text())
        .then(data => {
            datamessa = JSON.parse(data);
            fetch("https://coroparrocchiacastelsangiorgio.github.io/db/storico-messe/" + datamessa + ".json")
                .then(response => response.text())
                .then(data => {
                    oggi = JSON.parse(data);
                    oggiparentdiv = document.getElementsByClassName("oggi-parent-div")[0];
                    mainoggidiv = oggiparentdiv.getElementsByClassName("main-oggi-div")[0];
                    oggi.forEach(messa => {
                        newoggidiv = mainoggidiv.cloneNode(true);
                        newoggidiv.getElementsByClassName("oggi-data-h3")[0].textContent = messa.datamessa;
                        newoggidiv.getElementsByClassName("oggi-nome-h3")[0].textContent = messa.nome;
                        newoggidiv.getElementsByClassName("oggi-sottotitolo-h3")[0].textContent = messa.sottotitolo;
                        newoggidiv.getElementsByClassName("oggi-liturgia-a")[0].textContent += formatdatamessaperliturgia(datamessa);
                        // popola scaletta
                        maincantodiv = newoggidiv.getElementsByClassName("oggi-canto-div")[0];
                        messa.scaletta.forEach(elementoscaletta => {
                            newcantodiv = maincantodiv.cloneNode(true);
                            newcantodiv.getElementsByClassName("oggi-canto-momento-h4")[0].textContent = elementoscaletta.momento;
                            if ("idcanto" in elementoscaletta) {
                                // TODO fetch canto sulla base di id

                                fetch('https://coroparrocchiacastelsangiorgio.github.io/db/indice.json')
                                    .then(response => response.text())
                                    .then(data => {
                                        indicejson = JSON.parse(data);
                                        // cerca il canto nell'indice
                                        metadatijson = indicejson.find(canto => {
                                            return canto.id == elementoscaletta.idcanto;
                                        });
                                        titolocanto = metadatijson.titolo;
                                    });

                                fetch('https://coroparrocchiacastelsangiorgio.github.io/db/testi/' + elementoscaletta.idcanto + '.html')
                                    .then(response => response.text())
                                    .then(data => {
                                        // popola il testo
                                        testocanto = data;
                                    });

                                newcantodiv.getElementsByClassName("oggi-canto-testo-p")[0].textContent = testocanto;
                                newcantodiv.getElementsByClassName("oggi-canto-titolo-h4")[0].textContent = titolocanto;
                            }
                            if ("testocanto" in elementoscaletta) {
                                newcantodiv.getElementsByClassName("oggi-canto-testo-p")[0].textContent = testocanto;
                            }
                            newoggidiv.appendChild(newcantodiv);
                        });
                        maincantodiv.remove();
                        oggiparentdiv.appendChild(newoggidiv);
                    });
                    mainoggidiv.remove();
                });
        });
}

function formatdatamessaperliturgia(datamessa) {
    const splitted = datamessa.split("-");
    let year = splitted[0];
    let month = splitted[1];
    let day = splitted[2];
    return year + month + day;
}