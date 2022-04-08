function autocomplete(inp, arr) {
  var currentFocus;
  let hintsenabled = getCookie("hintsenabled", false)
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      // card = getCardName(arr[i][0])
      card = arr[i][0]

      let matches = card.substr(0, val.length).toUpperCase() == val.toUpperCase() ? 1 : 0
      let words = card.split(" ")
      let highlight = true
      for (j = 0; j < words.length; j++) {
        matches += words[j].substr(0, val.length).toUpperCase() == val.toUpperCase() ? 1 : 0
      }
      if (matches == 0) {
        highlight = false
        let filters = val.split(" ")
        let fvalues = []
        for (f = 0; f < filters.length; f++) {
          let filter = filters[f]
          if (filter.includes("gen:")) {
            fvalues.push(arr[i][1][0].toString() == filter.split(":")[1] ? 1 : 0)
          }
          else if (filter.includes("gen!")) {
            fvalues.push(arr[i][1][0].toString() != filter.split("!")[1] ? 1 : 0)
          }
          else if (filter.includes("gen>")) {
            fvalues.push(arr[i][1][0] > parseInt(filter.split(">")[1]) ? 1 : 0)
          }
          else if (filter.includes("gen<")) {
            fvalues.push(arr[i][1][0] < parseInt(filter.split("<")[1]) ? 1 : 0)
          }

          else if (filter.includes("type1:")) {
            fvalues.push(arr[i][1][1].toLowerCase() == filter.split(":")[1].toLowerCase() ? 1 : 0)
          }
          else if (filter.includes("type1!")) {
            fvalues.push(arr[i][1][1].toLowerCase() != filter.split("!")[1].toLowerCase() ? 1 : 0)
          }

          else if (filter.includes("type2:")) {
            let t2 = filter.split(":")[1].toLowerCase()
            t2 = t2 == "" ? "-" : t2
            t2 = t2 == "none" ? "" : t2
            fvalues.push(arr[i][1][2].toLowerCase() == t2 ? 1 : 0)
          }
          else if (filter.includes("type2!")) {
            let t2 = filter.split("!")[1].toLowerCase()
            t2 = t2 == "" ? "-" : t2
            t2 = t2 == "none" ? "" : t2
            fvalues.push(arr[i][1][2].toLowerCase() != t2 ? 1 : 0)
          }

          else if (filter.includes("type:")) {
            let t1 = filter.split(":")[1].toLowerCase()
            let t2 = t1 == "" ? "-" : t1
            t2 = t2 == "none" ? "" : t2
            fvalues.push(arr[i][1][1].toLowerCase() == t1 || arr[i][1][2].toLowerCase() == t2 ? 1 : 0)
          }
          else if (filter.includes("type!")) {
            let t1 = filter.split("!")[1].toLowerCase()
            let t2 = t1 == "" ? "-" : t1
            t2 = t2 == "none" ? "" : t2
            fvalues.push(arr[i][1][1].toLowerCase() != t1 && arr[i][1][2].toLowerCase() != t2 ? 1 : 0)
          }

          else if (filter.includes("height:")) {
            fvalues.push(arr[i][1][3].toString() == filter.split(":")[1] ? 1 : 0)
          }
          else if (filter.includes("height!")) {
            fvalues.push(arr[i][1][3].toString() != filter.split("!")[1] ? 1 : 0)
          }
          else if (filter.includes("height>")) {
            fvalues.push(arr[i][1][3] > parseFloat(filter.split(">")[1]) ? 1 : 0)
          }
          else if (filter.includes("height<")) {
            fvalues.push(arr[i][1][3] < parseFloat(filter.split("<")[1]) ? 1 : 0)
          }

          else if (filter.includes("weight:")) {
            fvalues.push(arr[i][1][4].toString() == filter.split(":")[1] ? 1 : 0)
          }
          else if (filter.includes("weight!")) {
            fvalues.push(arr[i][1][4].toString() != filter.split("!")[1] ? 1 : 0)
          }
          else if (filter.includes("weight>")) {
            fvalues.push(arr[i][1][4] > parseFloat(filter.split(">")[1]) ? 1 : 0)
          }
          else if (filter.includes("weight<")) {
            fvalues.push(arr[i][1][4] < parseFloat(filter.split("<")[1]) ? 1 : 0)
          }
        }
        matches = fvalues.length > 0 ? Math.min(...fvalues) : 0
      }
      if (matches > 0) {
        b = document.createElement("DIV");
        index = card.toLowerCase().indexOf(val.toLowerCase())
        if (highlight) {
          b.innerHTML = card.substr(0, index)
          b.innerHTML += "<strong>" + card.substr(index, val.length) + "</strong>";
          b.innerHTML += card.substr(index + val.length);
        } else {
          b.innerHTML = card
        }
        if (hintsenabled == "1" | hintsenabled == "") {
          let type = arr[i][1][0]
          let attribute = arr[i][1][1]
          let monster = arr[i][1][2]
          let level = arr[i][1][3]
          let attack = arr[i][1][4]
          let defense = arr[i][1][5]
          b.innerHTML += "<br><span class=\"dropinfo\"> "
            + attribute + ", "
            + type
            + (monster == "None" ? "" : "/" + monster )
            // + (monster == "None" ? "" : "/" + monster )
            + ", " + level
            + ", " + attack + (defense < 0 ? "" : "/" + defense)
            +  "</span>";
        }
        value = card.replace("'", "&#39;")
        b.innerHTML += "<input type='hidden' value='" + value + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function replaceAt(str, index, ch) {
  return str.replace(/./g, (c, i) => i == index ? ch : c);
}

function copyCurrentDay(day, names) {
  let attempts = parseInt(getCookie("t_attempts", day > -1))
  var guesses = JSON.parse(getCookie("guessesv2", day > -1))
  var gnum = guesses.length
  if (document.getElementById('lost').style.display == "block") {
    gnum = "X"
  }
  var dailyinfo = day == -1 ? "" : ("Daily " + day + " - ")

  var text = ""
  for (const guess of guesses) {
    let mosaic = guess.mosaic
    if (day > -1 & (mosaic[0] == "2" | mosaic[0] == "3")) {
      mosaic = replaceAt(mosaic, 0, '6')
    }
    text = text + "\n" + mosaic + (names ? getCardFromId(guess.name) : "")
  }

  text = text.replace(/1/g, '🟩');
  text = text.replace(/2/g, '🔼');
  text = text.replace(/3/g, '🔽');
  text = text.replace(/4/g, '🟨');
  text = text.replace(/5/g, '🟥');
  text = text.replace(/6/g, '🟦');


  text = "Squirdle " + dailyinfo + gnum + "/" + attempts + text

  var success = "Copied mosaic to clipboard!";
  if (window.clipboardData && window.clipboardData.setData) {
    alert(success);
    return clipboardData.setData("Text", text);
  } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");
    } catch (ex) {
      console.warn("Copy to clipboard failed. Let Fireblend know!", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
      alert(success);
    }
  }
}

function setLanguage(lang, isDaily){
  setCookie("lang", lang, 100, false)
  for (x in [0, 1, 2, 3, 4, 5, 6, 7]) {
    const elem = document.getElementById('guess' + x) || false
    elem ? elem.remove() : false
  }
  if (lang == "en" | lang == "") {
    lang_map = ""
    rev_map = ""
    document.getElementById("guess").placeholder = "Card name"
    handleLoad(isDaily)
   } // else {
  //   $.getJSON( "data/"+lang+".json", function( data ) {
  //     lang_map = data
  //     rev_map = {}
  //     for(var prop in lang_map){
  //       rev_map[lang_map[prop]] = prop
  //     }
  //     if (lang == "ja"){
  //       document.getElementById("guess").placeholder = "秘密のポケモンは？"
  //     }
  //     else if (lang == "ko"){
  //       document.getElementById("guess").placeholder = "포켓몬은?"
  //     }
  //     else if (lang == "fr"){
  //       document.getElementById("guess").placeholder = "Quel est ce Pokemon?"
  //     }
  //     handleLoad(isDaily)
  // });
  // }
}


function setCookie(cname, cvalue, exdays, daily) {
  cname = (daily ? "d_" : "") + cname
  const d = new Date();
  if (daily) {
    d.setHours(23,59,59,0)
  } else {
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  }
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";samesite=strict";
}

function getCookie(cname, daily) {
  cname = (daily ? "d_" : "") + cname
  var cookies = ` ${document.cookie}`.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].split("=");
    if (cookie[0] == ` ${cname}`) {
      return cookie[1];
    }
  }
  return "";
}

function getCardFromId(id) {
  return isNaN(id) ? id : getCardName(Object.keys(pokedex)[parseInt(id)]);
}

function getIdFromCard(card) {
  return Object.keys(pokedex).indexOf(card);
}

let createElement = (initObj) => {
  var element = document.createElement(initObj.Tag);
  for (var prop in initObj) {
    if (prop === "childNodes") {
      initObj.childNodes.forEach(function (node) { element.appendChild(node); });
    }
    else if (prop === "attributes") {
      initObj.attributes.forEach(function (attr) { element.setAttribute(attr.key, attr.value) });
    }
    else element[prop] = initObj[prop];
  }
  return element;
}

function showState(daily) {
  let enabled = getCookie("hintsenabled", false)
  document.getElementById("toggleinfo").innerHTML = "📋 Yu-Gi-Oh! Info " + (enabled == "0" ? "OFF" : "ON");

  let guesses = getCookie("guessesv2", daily)
  let attempts = getCookie("t_attempts", daily)

  guesses = guesses == "" ? [] : JSON.parse(guesses)
  let guessesCont = document.getElementById("guesses")
  let hintTitles = document.getElementById("hinttitles")

  if (guesses.length > 0) {
    if (guessesCont.style.display == "none") {
      guessesCont.style.display = "block";
      window.getComputedStyle(hintTitles).opacity;
      hintTitles.className += ' in';
    }
  } else {
    guessesCont.style.display = "none"
    hintTitles.className = 'row';
  }
  let lastAttempt = ""

  for (const [index, guess] of guesses.entries()) {
    if (!(document.getElementById('guess' + index) || false)) {
      lastAttempt = getCardFromId(guess.name)

      var rowElement = createElement({ Tag: "div", id: 'guess' + index, classList: 'row' })

      for (const hint of guess.hints) {
        var img = createElement({ Tag: "img", classList: 'emoji', src: hint })
        var colElement = createElement({ Tag: "div", classList: 'column', childNodes: [img] })
        rowElement.appendChild(colElement)
      }
      var pokename = createElement({ Tag: "p", classList: 'guess', innerHTML: lastAttempt })
      var pokeinfo = createElement({ Tag: "span", classList: 'tooltiptext', innerHTML: guess.info })
      var tooltip = createElement({ Tag: "div", classList: 'tooltip', childNodes: [pokename, pokeinfo] })
      var colElement = createElement({ Tag: "div", classList: 'column', childNodes: [tooltip] })

      rowElement.appendChild(colElement)

      guessesCont.appendChild(rowElement);
      window.getComputedStyle(rowElement).opacity;
      rowElement.className += ' in';

      let guessedPoke = pokedex[getRevCardName(lastAttempt)]
      let typecorrect = guess.mosaic[1] == "1" | guess.mosaic[1] == "4"

      let type1elem = document.getElementById("type_" + guessedPoke[1])
      type1elem.style.opacity = typecorrect ? "1" : "0.12";
      type1elem.style.borderStyle = typecorrect ? "solid" : "none";

    }
  }

  let secret_name = getCardFromId(getCookie("secret_poke", daily).replace(/"/g, ''));
  if (secret_name == lastAttempt) {
    document.getElementById("secretpoke").innerHTML = secret_name
    document.getElementById("guessform").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("won").style.display = "block";
  }
  else if (guesses.length == attempts) {
    document.getElementById("secretpoke").innerHTML = secret_name
    document.getElementById("guessform").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("lost").style.display = "block";
  }
  document.getElementById("attempts").innerHTML = attempts - guesses.length
}

function handleGuess(daily) {
  // const imgs = { '1': "imgs/correct.png", '2': "imgs/up.png", '3': "imgs/down.png", '4': "imgs/wrongpos.png", '5': "imgs/wrong.png" }
  const imgs = { '1': "imgs/correct.png", '2': "imgs/up.png", '3': "imgs/down.png", '4': "imgs/wrongpos.png", '5': "imgs/wrong.png" }
  let guess_name = getRevCardName(document.getElementById("guess").value)
  let secret_name = getRevCardName(getCardFromId(getCookie("secret_poke", daily).replace(/"/g, '')));
  let guess = pokedex[guess_name]

  if (guess == null) {
    document.getElementById("error").style.display = "block";
    return
  }
  document.getElementById("error").style.display = "none";
  document.getElementById("guess").value = "";

  secret = pokedex[secret_name]

  let type = guess[0] == secret[0] ? "1" : '5'
  let attribute = guess[1] == secret[1] ? "1" : '5'
  // let extra = guess[2] == secret[2] ? "1" : '5'
  let monster = guess[2] == secret[2] ? "1" :'5'
  let level = guess[3] == secret[3] ? "1" : guess[3] < secret[3] ? '2' : '3'
  let attack = guess[4] == secret[4] ? "1" : guess[4] < secret[4] ? '2' : '3'
  let defense = guess[5] == secret[5] ? "1" : guess[5] < secret[5] ? '2' : '3'

  let pokeinfo = "<b>Attribute:</b> " + guess[1] + "<br><b>Type:</b> " + guess[0] +
    // "<br><b>Extra:</b> " + (guess[2] == "" ? "None" : guess[2]) +
    "<br><b>Monster:</b> " + guess[2].split(" ")[0] + "<br><b>Level:</b> " + guess[3] + "<br><b>Attack:</b> " + guess[4] + "<br><b>Defense:</b> " + guess[5]

  let guess_info = {
    "hints": [ imgs[attribute], imgs[type],imgs[monster], imgs[level], imgs[attack], imgs[defense]],
    "name": getIdFromCard(guess_name), "info": pokeinfo, "mosaic": type + attribute  + monster+ level + attack + defense
  }


  let guesses = getCookie("guessesv2", daily)
  guesses = guesses == "" ? [] : JSON.parse(guesses)

  guesses.push(guess_info)

  setCookie("guessesv2", JSON.stringify(guesses), 100, daily)
  showState(daily)
}

function toggleHints(daily) {
  let enabled = getCookie("hintsenabled", false)
  let min = parseInt(getCookie("min_gene", daily))
  let max = parseInt(getCookie("max_gene", daily))

  enabled = enabled == "0" ? "1" : "0"
  setCookie("hintsenabled", enabled)
  document.getElementById("toggleinfo").innerHTML = "📋 Yu-Gi-Oh! Info " + (enabled == "1" ? "ON" : "OFF");

  filterRes = getCard(min, max)
  autocomplete(document.getElementById("guess"), filterRes[1]);
}

function getCardName(name){
  if (lang_map == "") return name;
  return lang_map[name]
}
function getRevCardName(name){
  if (rev_map == "") return name;
  return rev_map[name]
}

function getCard() {
  let filtered = []
  for (const [name, info] of Object.entries(pokedex)) {
      filtered.push([name, info])
  }
  let chosen = filtered[filtered.length * Math.random() | 0][0];
  return [getIdFromCard(chosen), filtered]
}

function newGame(isDaily) {


  filterRes = isDaily ? [getIdFromCard(dailypoke), pokedex] : getCard()
  setCookie('guessesv2', "", 30, isDaily)
  setCookie('secret_poke', filterRes[0], 30, isDaily)
  setCookie('t_attempts', '10', 30, isDaily)

  autocomplete(document.getElementById("guess"), filterRes[1]);

  for (x in [0, 1, 2, 3, 4, 5, 6, 7]) {
    const elem = document.getElementById('guess' + x) || false
    elem ? elem.remove() : false
  }

  let types2 = ["DARK", "DIVINE", "EARTH", "FIRE", "LIGHT", "WATER", "WIND"]

  for (i = 0; i < types2.length; i++) {
    type = types2[i];
    let typeb = document.getElementById("type_" + type)
    typeb.style.opacity = "0.7"
    typeb.style.borderStyle = "none"
  }

  document.getElementById("guessform").style.display = "block";
  document.getElementById("results").style.display = "none";
  document.getElementById("lost").style.display = "none";
  document.getElementById("won").style.display = "none";
  document.getElementById("secretpoke").innerHTML = getCardFromId(filterRes[0])
  showState(isDaily)
}

function handleLoad(isDaily) {
  let poke = ''//getCookie("secret_poke", isDaily)

  if (poke == "") {
    newGame(isDaily)
  }
  let v = getCard()
  autocomplete(document.getElementById("guess"), v[1]);
  showState(isDaily)
}
