document.addEventListener('DOMContentLoaded', mostraCantiDelGiorno);

function mostraCantiDelGiorno() {
    // inizializzazione
    let messaTrovata = false;
    let dataMessa = formatData(window.glob);
    // setta il link alla liturgia del giorno
    document.querySelector(".link-liturgia").setAttribute("href","https://www.chiesacattolica.it/liturgia-del-giorno/?data-liturgia=" + formatDataMessaPerLiturgia(dataMessa));
    // recupera messa dal db
    fetch("https://coroparrocchiacastelsangiorgio.github.io/db/storico-messe/" + dataMessa + ".json")
        .then(responseMessa => responseMessa.text())
        .then(datiMessa => {
            messaTrovata = true;
            try {
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
                    accordion.id = "faqlist-" + i;
                    let accordionItem = accordion.querySelector("#canto-container-0");
                    // aggiungi tanti accordion-item quanti sono i canti
                    for (let j = 1; j < messa.scaletta.length; j++) {
                        let nuovoAccordionItem = accordionItem.cloneNode(true);
                        nuovoAccordionItem.id = "canto-container-" + j;
                        nuovoAccordionItem.querySelector(".accordion-button").setAttribute("data-bs-target", "#faq-content-"+j);
                        nuovoAccordionItem.querySelector(".num").id ="num"+j;
                        nuovoAccordionItem.querySelector(".tit").id ="tit"+j;
                        nuovoAccordionItem.querySelector(".accordion-collapse").id = "faq-content-"+j;
                        nuovoAccordionItem.querySelector(".accordion-collapse").setAttribute("data-bs-parent", "#faqlist-"+i);
                        accordion.appendChild(nuovoAccordionItem);
                    }
                    // popola canti
                    for (let j = 0; j < messa.scaletta.length; j++) {
                        let datiMomento = messa.scaletta[j];
                        let accordionMomento = accordion.querySelectorAll(".accordion-item")[j];
                        accordionMomento.querySelector(".num").textContent = datiMomento.momento;
                        if ("idcanto" in datiMomento) {
                            popolaTitoloCanto(i, j, datiMomento.idcanto);
                            popolaTestoCanto(i, j, datiMomento.idcanto);
                        }
                        if ("testocanto" in datiMomento) {
                            accordionMomento.querySelector(".tit").textContent = datiMomento.testocanto;
                            bottoneDaDisabilitare = accordionMomento.querySelector(".accordion-button");
                            bottoneDaDisabilitare.removeAttribute("type");
                            bottoneDaDisabilitare.removeAttribute("data-bs-toggle");
                            bottoneDaDisabilitare.removeAttribute("data-bs-target");
                            bottoneDaDisabilitare.style.pointerEvents = "none";
                        }
                    }
                }
            }
            catch (err) {
                if (!messaTrovata) {
                    // TODO informare l'utente che non ci sono messe caricate
                    console.log("Messa non trovata per data: " + dataMessa);
                }
            }
        });
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
            dapopolare.querySelector(".tit").textContent = metadatijson.titolo;
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


function formatData(dataOdierna) {
    let dataMessa;
    // get data richiesta
    let dayOdierno = dataOdierna.getDate();
    if (dayOdierno < 10) dayOdierno = "0" +dayOdierno;
    let monthOdierno = dataOdierna.getMonth() + 1;
    if (monthOdierno < 10) monthOdierno = "0" +monthOdierno;
    let yearOdierno = dataOdierna.getFullYear();
    dataMessa = `${yearOdierno}-${monthOdierno}-${dayOdierno}`;
    return dataMessa;
}
