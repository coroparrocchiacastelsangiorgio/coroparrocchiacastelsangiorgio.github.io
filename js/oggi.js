document.addEventListener('DOMContentLoaded', caricamessadelgiorno);

function caricamessadelgiorno() {
    cemessa = false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('data')) {
        datamessa = urlParams.get('data');

//function caricamessadelgiorno() {
//    fetch('https://coroparrocchiacastelsangiorgio.github.io/oggi.json')
//        .then(response1 => response1.text())
//        .then(data1 => {
//            datamessa = JSON.parse(data1);
        fetch("https://coroparrocchiacastelsangiorgio.github.io/db/storico-messe/" + datamessa + ".json")
            .then(response2 => response2.text())
            .then(data2 => {
                cemessa = true;
                elencomesse = JSON.parse(data2);
                divmesse = document.querySelector(".messe-div");
                divmessa = divmesse.querySelector(".messa-div");
                for (i = 1; i < elencomesse.length; i++) {
                    nuovodiv = divmessa.cloneNode(true);
                    divmesse.appendChild(nuovodiv);
                }
                for (i = 0; i < elencomesse.length; i++) {
                    divmessa = divmesse.querySelectorAll(".messa-div")[i];
                    messa = elencomesse[i];
                    document.title = messa.datamessa;
                    divmessa.querySelector(".data-messa").textContent = messa.datamessa;
                    divmessa.querySelector(".nome-messa").textContent = messa.nome;
                    divmessa.querySelector(".sottotitolo-messa").textContent = messa.sottotitolo;
                    divmessa.querySelector(".link-liturgia").href += formatdatamessaperliturgia(datamessa);
                    divmessa.querySelector(".link-liturgia").style.visibility = 'visible';
                    divmomenti = divmessa.querySelector(".momenti");
                    divmomento = divmomenti.querySelector(".momento-div");
                    for (j = 1; j < messa.scaletta.length; j++) {
                        nuovomomento = divmomento.cloneNode(true);
                        divmomenti.appendChild(nuovomomento);
                    }
                    for (j = 0; j < messa.scaletta.length; j++) {
                        infomomento = messa.scaletta[j];
                        divmomento = divmomenti.querySelectorAll(".momento-div")[j];
                        divmomento.querySelector(".nome-momento").textContent = infomomento.momento;
                        if ("idcanto" in infomomento) {
                            popolatitolocanto(i, j, infomomento.idcanto);
                            popolatestocanto(i, j, infomomento.idcanto);
                        }
                        if ("testocanto" in infomomento) {
                            divmomento.querySelector(".testo-canto").innerHTML = infomomento.testocanto;
                        }
                    }
                }
                document.querySelector("#nomessa").style.visibility = 'hidden';
            });
        if (!cemessa) {
            document.querySelector("#nomessa").style.visibility = 'visible';
            document.querySelector(".link-liturgia").style.visibility = 'hidden';
        }
        else {
            alert("wee");
            document.querySelector("#nomessa").style.visibility = 'hidden';
        }
    }
    else {
        document.querySelector("#nomessa").style.visibility = 'hidden';
        document.querySelector(".link-liturgia").style.visibility = 'hidden';
    }
}

function formatdatamessaperliturgia(datamessa) {
    const splitted = datamessa.split("-");
    let year = splitted[0];
    let month = splitted[1];
    let day = splitted[2];
    return year + month + day;
}

function popolatitolocanto(imessa, jcanto, idcanto) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://coroparrocchiacastelsangiorgio.github.io/db/indice.json", true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            indicejson = xhr.response;
            // cerca il canto nell'indice
            metadatijson = indicejson.find(canto => {
                return canto.id == idcanto;
            });
            dapopolare = document.querySelectorAll(".messa-div")[imessa].querySelectorAll(".momento-div")[jcanto];
            dapopolare.querySelector(".titolo-canto").textContent = metadatijson.titolo;
        }
    };
    xhr.send();
}

function popolatestocanto(imessa, jcanto, idcanto) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://coroparrocchiacastelsangiorgio.github.io/db/testi/' + idcanto + '.html', true);
    xhr.responseType = 'text';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            dapopolare = document.querySelectorAll(".messa-div")[imessa].querySelectorAll(".momento-div")[jcanto];
            dapopolare.querySelector(".testo-canto").innerHTML = xhr.response;
        }
    };
    xhr.send();
}

