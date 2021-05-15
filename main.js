function zeigeDaten(daten) {

    //Rückgabe der d3.selectAll - Methode in variable p speichern.(Alle Kindelemente von content, die p- Elemente sind.) Am Anfang gibt es noch keine.
    let p = d3.select("#content").selectAll("p").data(daten);

    //.enter().append(): Daten hinzufuegen falls es mehr Daten als Elemente im HTML gibt.
    //geschieht hier für jede Zeile von daten.
    p.enter().append("p")
        .text(function (daten) {
            return "Uhrzeit: " + daten.datum + " Wert: " + daten.werte["Person B"];
        });
    //.exit().remove(): Daten löschen, falls es mehr Elemente im HTML als Daten gibt.
    p.exit().remove();
}

function empfangeDaten(datenEmpfangen,error) {
    if (error) {
        console.log(error);
    } else {
        zeigeDaten(datenEmpfangen);
    }
}

function aktualisiere() {
    //d3.json nutzen, um Link aufzurufen und das Ergebnis an die empfangeDaten- Methode zu übergeben.
    d3.json("http://it2wi1.if-lab.de/rest/beispiel/Parameter/Person%20B/tag/1").then(function (data, error) {
        empfangeDaten(data, error)
    });
}

//[{"datum":"01.05.16 00:00","werte":{"Person B":"80,88344508"}},{"datum":"01.05.16 01:00","werte":{"Person B":"82,55572389"}},{"datum":"01.05.16 02:00","werte":{"Person B":"88,13546479"}},{"datum":"01.05.16 03:00","werte":{"Person B":"89,09479071"}},{"datum":"01.05.16 04:00","werte":{"Person B":"87,31534159"}},{"datum":"01.05.16 05:00","werte":{"Person B":"88,52362804"}},{"datum":"01.05.16 06:00","werte":{"Person B":"82,0556928"}},{"datum":"01.05.16 07:00","werte":{"Person B":"90,82933353"}},{"datum":"01.05.16 08:00","werte":{"Person B":"83,22141035"}},{"datum":"01.05.16 09:00","werte":{"Person B":"79,13323167"}},{"datum":"01.05.16 10:00","werte":{"Person B":"82,34691301"}},{"datum":"01.05.16 11:00","werte":{"Person B":"82,04686161"}},{"datum":"01.05.16 12:00","werte":{"Person B":"91,8970985"}},{"datum":"01.05.16 13:00","werte":{"Person B":"86,21662197"}},{"datum":"01.05.16 14:00","werte":{"Person B":"80,91037522"}},{"datum":"01.05.16 15:00","werte":{"Person B":"83,31818059"}},{"datum":"01.05.16 16:00","werte":{"Person B":"90,13505256"}},{"datum":"01.05.16 17:00","werte":{"Person B":"91,82515747"}},{"datum":"01.05.16 18:00","werte":{"Person B":"88,15213583"}},{"datum":"01.05.16 19:00","werte":{"Person B":"80,22598955"}},{"datum":"01.05.16 20:00","werte":{"Person B":"87,76936134"}},{"datum":"01.05.16 21:00","werte":{"Person B":"81,21965799"}},{"datum":"01.05.16 22:00","werte":{"Person B":"87,15933142"}},{"datum":"01.05.16 23:00","werte":{"Person B":"90,06401193"}}]