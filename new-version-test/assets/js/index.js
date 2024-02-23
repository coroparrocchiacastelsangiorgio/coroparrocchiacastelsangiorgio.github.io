document.addEventListener('DOMContentLoaded', mostraCantiDelGiorno);

function mostraCantiDelGiorno() {
    // inizializzazione
    let messaTrovata = false;
    // TODO
    // setta dataMessa = data di oggi
    let dataMessa = "2024-01-28";
    // get data del giorno
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('data')) {
        dataMessa = urlParams.get('data');
    }
    console.log(dataMessa);
    // setta il calendario su quella data
    // TODO
    // setta il link alla liturgia del giorno
    // TODO
    // container.querySelector(".link-liturgia").href += formatdatamessaperliturgia(datamessa);
    // recupera messa dal db
    fetch("https://coroparrocchiacastelsangiorgio.github.io/db/storico-messe/" + dataMessa + ".json")
        .then(responseMessa => responseMessa.text())
        .then(datiMessa => {
            messaTrovata = true;
            let elencoMesse = JSON.parse(datiMessa);
            let sectionMessa = document.querySelector("#faq-section");
            // se ci sono più messe in un giorno, clona il container
            for (let i = 1; i < elencoMesse.length; i++) {
                let container = sectionMessa.querySelector(".container");
                let nuovoContainer = container.cloneNode(true);
                sectionMessa.appendChild(nuovoContainer);
            }
            // carica dati della messa
            for (let i = 0; i < elencoMesse.length; i++) {
                let container = sectionMessa.querySelectorAll(".container")[i];
                let messa = elencoMesse[i];
                container.querySelector(".data-messa").textContent = messa.datamessa;
                container.querySelector(".nome-messa").textContent = messa.nome;
                //container.querySelector(".sottotitolo-messa").textContent = messa.sottotitolo;
                // popola momenti e canti
                let accordion = container.querySelector(".accordion");
                let accordionItem = accordion.querySelector("#canto-container-0");
                // aggiungi tanti accordion-item quanti sono i canti
                for (let j = 1; j < messa.scaletta.length; j++) {
                    let nuovoAccordionItem = accordionItem.cloneNode(true);
                    nuovoAccordionItem.id = "canto-container-" + j;
                    nuovoAccordionItem.querySelector(".accordion-button").setAttribute("data-bs-target", "#faq-content-"+j);
                    nuovoAccordionItem.querySelector(".num").id ="num"+j;
                    nuovoAccordionItem.querySelector(".accordion-collapse").id = "faq-content-"+j;
                    accordion.appendChild(nuovoAccordionItem);
                }
                // popola canti
                for (let j = 0; j < messa.scaletta.length; j++) {
                    let datiMomento = messa.scaletta[j];
                    let accordionMomento = accordion.querySelectorAll(".accordion-item")[j];
                    console.log(accordionMomento);
                    accordionMomento.querySelector(".num").textContent = datiMomento.momento;
                    if ("idcanto" in datiMomento) {
                        popolaTitoloCanto(i, j, datiMomento.idcanto);
                        popolaTestoCanto(i, j, datiMomento.idcanto);
                    }
                    if ("testocanto" in datiMomento) {
                        console.log("salmo");
                        accordionMomento.querySelector(".accordion-body").innerHTML = datiMomento.testocanto;
                    }
                }
            }
        });
    if (!messaTrovata) {
        // TODO informare l'utente che non ci sono messe caricate
    }
}

function formatDataMessaPerLiturgia(dataMessa) {
    const splitted = dataMessa.split("-");
    let year = splitted[0];
    let month = splitted[1];
    let day = splitted[2];
    return year + month + day;
}

function popolaTitoloCanto(iMessa, jCanto, idCanto) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "https://coroparrocchiacastelsangiorgio.github.io/db/indice.json", true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let status = xhr.status;
        if (status == 200) {
            let indicejson = xhr.response;
            // cerca il canto nell'indice
            let metadatijson = indicejson.find(canto => {
                return canto.id == idCanto;
            });
            let dapopolare = document.querySelectorAll(".accordion")[iMessa].querySelectorAll(".accordion-item")[jCanto];
            dapopolare.querySelector(".num").textContent = metadatijson.titolo;
        }
    };
    xhr.send();
}

function popolaTestoCanto(iMessa, jCanto, idCanto) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://coroparrocchiacastelsangiorgio.github.io/db/testi/' + idCanto + '.html', true);
    xhr.responseType = 'text';
    xhr.onload = function() {
        let status = xhr.status;
        if (status == 200) {
            let dapopolare = document.querySelectorAll(".accordion")[iMessa].querySelectorAll(".accordion-item")[jCanto];
            dapopolare.querySelector(".accordion-body").innerHTML = xhr.response;
        }
    };
    xhr.send();
}

