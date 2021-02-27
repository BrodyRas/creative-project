/* 
title
dsDescription
dataProvider
edmPreview (image)
country
year
type (text, painting)
score (relevance to search?)
 */
let color = document.getElementById("europeana_color");
let check = document.getElementById("europeana_check");
color.disabled = true;

check.onchange = function () {
    color.disabled = !this.checked;
};

let submit = document.getElementById("europeana_submit");
submit.addEventListener("click", function (event) {
    event.preventDefault();
    let value = document.getElementById("europeana_input").value;
    if (value === "") value = "*";
    console.log(value);

    // const clr = check.checked ? `&colourpalette=%23696969` : "";
    const clr = check.checked ? `&colourpalette=%23${color.value}` : "";
    const url = "https://api.europeana.eu/record/v2/search.json?query=" + value + clr + "&reusability=open&media=true&wskey=derskyupeary";

    fetch(url)
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            // console.log(json);
            let results = "";

            if (json.items.length === 0) {
                results += "<h2>No results! Try a different search</h2>";
            } else {
                for (let i of json.items) {
                    console.log(i);
                    results += `<a class='e_search_item' href='${i.guid}'>`;
                    results += `<img src="${i.edmPreview}">`;
                    let titleCutoff = 100;
                    let ell = i.title.toString().length > titleCutoff ? "..." : "";
                    results += `<h3>${i.title.toString().substr(0, titleCutoff)}${ell}</h3>`;
                    if (typeof i.country !== "undefined") {
                        results += `<p class="e_country"><em>${i.country}</em></p>`;
                    }
                    if (typeof i.dcDescription !== "undefined") {
                        let descCutoff = 200;
                        let ell2 = i.dcDescription[0].toString().length > descCutoff ? "..." : "";
                        results += `<p class="e_dcDescription">${i.dcDescription[0].toString().substr(0,descCutoff)}${ell2}</p>`;
                    }
                    results += "</a>";
                }
            }

            let europeana_results = document.getElementById("europeana_results");
            europeana_results.innerHTML = results;
        })
})