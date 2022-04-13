var summon_types = [
  'Effect',
  'Normal',
  'Flip',
  'Union',
  'Fusion',
  'Pendulum',
  'Link',
  'XYZ',
  'Synchro',
  'Tuner',
  'Gemini',
  'Spirit',
  'Ritual',
  'Toon',
  'Synchro',
  'Pendulum',
];

function autocomplete(inp, arr) {
  let currentFocus;

  inp.addEventListener('input', function (e) {
    let autocomplete_element,
      b,
      i,
      val = this.value;

    closeAllLists();
    if (!val) {
      return false;
    }

    currentFocus = -1;
    autocomplete_element = document.createElement('DIV');
    autocomplete_element.setAttribute('id', this.id + 'autocomplete-list');
    autocomplete_element.setAttribute('class', 'autocomplete-items');
    this.parentNode.appendChild(autocomplete_element);
    for (i = 0; i < arr.length; i++) {
      card_name = arr[i][0];

      let matches =
        card_name.substr(0, val.length).toUpperCase() == val.toUpperCase()
          ? 1
          : 0;
      let words = card_name.split(' ');
      let highlight = true;
      for (j = 0; j < words.length; j++) {
        matches +=
          words[j].substr(0, val.length).toUpperCase() == val.toUpperCase()
            ? 1
            : 0;
      }
      if (matches == 0) {
        highlight = false;
        matches = filterUsingAttributes(val, arr[i][1]);
      }
      if (matches > 0) {
        autocomplete_element.append(
          addAutocompleteEntry(val, highlight, arr[i], inp),
        );
      }
    }
  });

  // create keydown event
  inp.addEventListener('keydown', function (e) {
    let x = document.getElementById(this.id + 'autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
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
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add('autocomplete-active');
  }

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }

  document.addEventListener('click', function (e) {
    closeAllLists(e.target);
  });
  function addAutocompleteEntry(query, highlight, card, inp) {
    // Create autocomplete options for cards related to typed query
    let hintsenabled = getCookie('hintsenabled', false);
    let b = document.createElement('DIV');
    let card_name = card[0];
    index = card_name.toLowerCase().indexOf(query.toLowerCase());
    if (highlight) {
      b.innerHTML = card_name.substr(0, index);
      b.innerHTML +=
        '<strong>' + card_name.substr(index, query.length) + '</strong>';
      b.innerHTML += card_name.substr(index + query.length);
    } else {
      b.innerHTML = card;
    }
    if ((hintsenabled == '1') | (hintsenabled == '')) {
      let type = card[1][0];
      let attribute = card[1][1];
      let monster = card[1][2];
      let level = card[1][3];
      let attack = card[1][4];
      let defense = card[1][5];

      // create info to be shown on autocomplete
      b.innerHTML +=
        '<br><span class="dropinfo"> ' +
        attribute +
        ', ' +
        type +
        (monster == 'None' ? '' : '/' + monster) +
        ', ' +
        level +
        ', ' +
        attack +
        (defense < 0 ? '' : '/' + defense) +
        '</span>';
    }
    value = card_name.replace("'", '&#39;');
    b.innerHTML += "<input type='hidden' value='" + value + "'>";

    //create click event to remove all other autocomplete suggestions
    b.addEventListener('click', function (e) {
      inp.value = this.getElementsByTagName('input')[0].value;
      closeAllLists();
    });
    return b;
  }

  function filterUsingAttributes(query, card) {
    //using user specified attributes filter out entries
    let filters = query.split(' ');
    let fvalues = [];
    for (f = 0; f < filters.length; f++) {
      let filter = filters[f];

      //handle type
      if (filter.includes('type:')) {
        fvalues.push(
          card[0].toString().toLowerCase() == filter.split(':')[1] ? 1 : 0,
        );
      } else if (filter.includes('type!')) {
        fvalues.push(
          card[0].toString().toLowerCase() != filter.split('!')[1] ? 1 : 0,
        );

        //handle attribute
      } else if (filter.includes('atr:')) {
        fvalues.push(
          card[1].toLowerCase() == filter.split(':')[1].toLowerCase() ? 1 : 0,
        );
      } else if (filter.includes('atr!')) {
        fvalues.push(
          card[1].toLowerCase() != filter.split('!')[1].toLowerCase() ? 1 : 0,
        );

        //handle level
      } else if (filter.includes('lvl:')) {
        fvalues.push(card[3].toString() == filter.split(':')[1] ? 1 : 0);
      } else if (filter.includes('lvl!')) {
        fvalues.push(card[3].toString() != filter.split('!')[1] ? 1 : 0);
      } else if (filter.includes('lvl>')) {
        fvalues.push(card[3] > parseFloat(filter.split('>')[1]) ? 1 : 0);
      } else if (filter.includes('lvl<')) {
        fvalues.push(card[3] < parseFloat(filter.split('<')[1]) ? 1 : 0);

        //handle attack
      } else if (filter.includes('atk:')) {
        fvalues.push(card[4].toString() == filter.split(':')[1] ? 1 : 0);
      } else if (filter.includes('atk!')) {
        fvalues.push(card[4].toString() != filter.split('!')[1] ? 1 : 0);
      } else if (filter.includes('atk>')) {
        fvalues.push(card[4] > parseFloat(filter.split('>')[1]) ? 1 : 0);
      } else if (filter.includes('atk<')) {
        fvalues.push(card[4] < parseFloat(filter.split('<')[1]) ? 1 : 0);

        //handle def
      } else if (filter.includes('def:')) {
        fvalues.push(card[5].toString() == filter.split(':')[1] ? 1 : 0);
      } else if (filter.includes('def!')) {
        fvalues.push(card[5].toString() != filter.split('!')[1] ? 1 : 0);
      } else if (filter.includes('def>')) {
        fvalues.push(card[5] > parseFloat(filter.split('>')[1]) ? 1 : 0);
      } else if (filter.includes('def<')) {
        fvalues.push(card[5] < parseFloat(filter.split('<')[1]) ? 1 : 0);
      }
    }
    return fvalues.length > 0 ? Math.min(...fvalues) : 0;
  }

  function closeAllLists(elmnt) {
    // close all autosuggestion items
    var x = document.getElementsByClassName('autocomplete-items');
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
}

function copyDay(day, names) {
  function replaceAt(str, index, ch) {
    return str.replace(/./g, (c, i) => (i == index ? ch : c));
  }
  // copies mosaic to clipboard for sharing
  let attempts = parseInt(getCookie('t_attempts', day > -1));
  let guesses = JSON.parse(getCookie('guessesv2', day > -1));
  let gnum = guesses.length;
  if (document.getElementById('lost').style.display == 'block') {
    gnum = 'X';
  }
  let dailyinfo = day == -1 ? '' : 'Daily ' + day + ' - ';

  let text = '';
  for (const guess of guesses) {
    let mosaic = guess.mosaic;
    if ((day > -1) & ((mosaic[0] == '2') | (mosaic[0] == '3'))) {
      mosaic = replaceAt(mosaic, 0, '6');
    }
    text = text + '\n' + mosaic + (names ? getCardFromId(guess.name) : '');
  }

  text = text.replace(/1/g, '🟩');
  text = text.replace(/2/g, '🔼');
  text = text.replace(/3/g, '🔽');
  text = text.replace(/4/g, '🟨');
  text = text.replace(/5/g, '🟥');
  text = text.replace(/6/g, '🟦');

  text = 'Yu-Gi-Ordle ' + dailyinfo + gnum + '/' + attempts + text;

  let success = 'Copied mosaic to clipboard!';
  if (window.clipboardData && window.clipboardData.setData) {
    alert(success);
    return clipboardData.setData('Text', text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    let textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy');
    } catch (ex) {
      console.warn('Copy to clipboard failed!', ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
      alert(success);
    }
  }
}

function setCookie(cname, cvalue, exdays, daily) {
  // sets cookie with expiration date
  cname = (daily ? 'd_' : '') + cname;
  const d = new Date();
  if (daily) {
    d.setHours(23, 59, 59, 0);
  } else {
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  }
  let expires = 'expires=' + d.toUTCString();
  document.cookie =
    cname + '=' + cvalue + ';' + expires + ';path=/' + ';samesite=strict';
}

function getCookie(cname, daily) {
  // retrieves cookie
  cname = (daily ? 'd_' : '') + cname;
  let cookies = ` ${document.cookie}`.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split('=');
    if (cookie[0] == ` ${cname}`) {
      return cookie[1];
    }
  }
  return '';
}

function getCardFromId(id) {
  return isNaN(id) ? id : Object.keys(cardDB)[parseInt(id)];
}

function getIdFromCard(card) {
  return Object.keys(cardDB).indexOf(card);
}

let createElement = (initObj) => {
  let element = document.createElement(initObj.Tag);
  for (let prop in initObj) {
    if (prop === 'childNodes') {
      initObj.childNodes.forEach(function (node) {
        element.appendChild(node);
      });
    } else if (prop === 'attributes') {
      initObj.attributes.forEach(function (attr) {
        element.setAttribute(attr.key, attr.value);
      });
    } else element[prop] = initObj[prop];
  }
  return element;
};

function showState(daily) {
  let enabled = getCookie('hintsenabled', false);
  document.getElementById('toggleinfo').innerHTML =
    '📋 Yu-Gi-Oh! Info ' + (enabled == '0' ? 'OFF' : 'ON');

  let guesses = getCookie('guessesv2', daily);
  let attempts = getCookie('t_attempts', daily);

  guesses = guesses == '' ? [] : JSON.parse(guesses);
  let guessesCont = document.getElementById('guesses');
  let hintTitles = document.getElementById('hinttitles');

  if (guesses.length > 0) {
    if (guessesCont.style.display == 'none') {
      guessesCont.style.display = 'block';
      window.getComputedStyle(hintTitles).opacity;
      hintTitles.className += ' in';
    }
  } else {
    guessesCont.style.display = 'none';
    hintTitles.className = 'row';
  }
  let lastAttempt = '';

  for (const [index, guess] of guesses.entries()) {
    if (!(document.getElementById('guess' + index) || false)) {
      lastAttempt = getCardFromId(guess.name);

      let rowElement = createElement({
        Tag: 'div',
        id: 'guess' + index,
        classList: 'row',
      });

      for (const hint of guess.hints) {
        let img = createElement({
          Tag: 'img',
          classList: 'emoji',
          src: hint,
        });
        let colElement = createElement({
          Tag: 'div',
          classList: 'column',
          childNodes: [img],
        });
        rowElement.appendChild(colElement);
      }
      let cardname = createElement({
        Tag: 'p',
        classList: 'guess',
        innerHTML: lastAttempt,
      });
      let cardinfo = createElement({
        Tag: 'span',
        classList: 'tooltiptext',
        innerHTML: guess.info,
      });
      let tooltip = createElement({
        Tag: 'div',
        classList: 'tooltip',
        childNodes: [cardname, cardinfo],
      });
      let colElement = createElement({
        Tag: 'div',
        classList: 'column',
        childNodes: [tooltip],
      });

      rowElement.appendChild(colElement);

      guessesCont.appendChild(rowElement);
      window.getComputedStyle(rowElement).opacity;
      rowElement.className += ' in';

      let guessedCard = cardDB[lastAttempt];
      let typecorrect = (guess.mosaic[1] == '1') | (guess.mosaic[1] == '4');

      let atrElem = document.getElementById('atr_' + guessedCard[1]);
      atrElem.style.opacity = typecorrect ? '1' : '0.12';
      atrElem.style.borderStyle = typecorrect ? 'solid' : 'none';
    }
  }

  let secret_name = getCardFromId(
    getCookie('secret_card', daily).replace(/"/g, ''),
  );
  if (secret_name == lastAttempt) {
    document.getElementById('secretcard').innerHTML = secret_name;
    document.getElementById('guessform').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('won').style.display = 'block';
  } else if (guesses.length == attempts) {
    document.getElementById('secretcard').innerHTML = secret_name;
    document.getElementById('guessform').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('lost').style.display = 'block';
  }
  document.getElementById('attempts').innerHTML = attempts - guesses.length;
  document.getElementById('summon_type').innerHTML =
    cardDB[secret_name][2].split(' ')[0];
}

function shuffle(array, seed) {
  // <-- ADDED ARGUMENT
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--); // <-- MODIFIED LINE

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed; // <-- ADDED LINE
  }

  return array;
}

function random(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function genDaily() {
  let Ga = new Date(2021, 5, 19, 0, 0, 0, 0);

  function genNum(e, a) {
    let s = new Date(e),
      t = new Date(a).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
    return Math.round(t / 864e5);
  }

  let s = genNum(Ga, Date());
  let summon_type = shuffle(summon_types, Ga)[s % summon_types.length];
  let cards = filterCards(summon_type);
  let l = shuffle(cards, Ga)[s % cards.length][0];
  return l;
}

function handleGuess(daily) {
  const imgs = {
    1: 'imgs/correct.png',
    2: 'imgs/up.png',
    3: 'imgs/down.png',
    4: 'imgs/wrongpos.png',
    5: 'imgs/wrong.png',
  };
  let guess_name = document.getElementById('guess').value;
  let secret_name = getCardFromId(
    getCookie('secret_card', daily).replace(/"/g, ''),
  );
  let guess = cardDB[guess_name];

  if (guess == null) {
    document.getElementById('error').style.display = 'block';
    return;
  }
  document.getElementById('error').style.display = 'none';
  document.getElementById('guess').value = '';

  secret = cardDB[secret_name];

  let name = guess_name == secret_name ? '1' : '5';
  let type = guess[0] == secret[0] ? '1' : '5';
  let attribute = guess[1] == secret[1] ? '1' : '5';
  let level = guess[3] == secret[3] ? '1' : guess[3] < secret[3] ? '2' : '3';
  let attack = guess[4] == secret[4] ? '1' : guess[4] < secret[4] ? '2' : '3';
  let defense = guess[5] == secret[5] ? '1' : guess[5] < secret[5] ? '2' : '3';

  let cardinfo =
    '<b>ATR:</b> ' +
    guess[1] +
    '<br><b>Type:</b> ' +
    guess[0] +
    '<br><b>LVL:</b> ' +
    guess[3] +
    '<br><b>ATK:</b> ' +
    guess[4] +
    (guess[5] != -1 ? '<br><b>DEF:</b> ' + guess[5] : '');

  let guess_info = {
    hints: [
      imgs[name],
      imgs[attribute],
      imgs[type],
      imgs[level],
      imgs[attack],
      imgs[defense],
    ],
    name: getIdFromCard(guess_name),
    info: cardinfo,
    mosaic: name + attribute + type + level + attack + defense,
  };

  let guesses = getCookie('guessesv2', daily);
  guesses = guesses == '' ? [] : JSON.parse(guesses);

  guesses.push(guess_info);

  setCookie('guessesv2', JSON.stringify(guesses), 100, daily);
  showState(daily);
}

function toggleHints() {
  let enabled = getCookie('hintsenabled', false);

  enabled = enabled == '0' ? '1' : '0';
  setCookie('hintsenabled', enabled);
  document.getElementById('toggleinfo').innerHTML =
    '📋 Yu-Gi-Oh! Info ' + (enabled == '1' ? 'ON' : 'OFF');
}

function filterCards(summon_type) {
  let filtered = [];
  for (const [name, info] of Object.entries(cardDB)) {
    if (info[2].split(' ')[0] == summon_type) filtered.push([name, info]);
  }
  return filtered;
}

function generateSecretCard(summon_type) {
  let filtered = filterCards(summon_type);
  let chosen = filtered[(filtered.length * Math.random()) | 0][0];
  return [getIdFromCard(chosen), filtered];
}

function newGame(isDaily) {
  // setup everything fresh for a new game
  let summon_type =
    summon_types[Math.floor(Math.random() * summon_types.length)];
  filterRes = isDaily
    ? [getIdFromCard(dailycard), cardDB]
    : generateSecretCard(summon_type);

  setCookie('guessesv2', '', 30, isDaily);
  setCookie('secret_card', filterRes[0], 30, isDaily);
  setCookie('summon_type', summon_type, 30, isDaily);
  setCookie('t_attempts', '10', 30, isDaily);

  autocomplete(document.getElementById('guess'), filterRes[1]);

  for (x in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    const elem = document.getElementById('guess' + x) || false;
    elem ? elem.remove() : false;
  }

  let attributes = [
    'DARK',
    'DIVINE',
    'EARTH',
    'FIRE',
    'LIGHT',
    'WATER',
    'WIND',
  ];

  for (i = 0; i < attributes.length; i++) {
    type = attributes[i];
    let typeb = document.getElementById('atr_' + type);
    typeb.style.opacity = '0.7';
    typeb.style.borderStyle = 'none';
  }

  document.getElementById('guessform').style.display = 'block';
  document.getElementById('results').style.display = 'none';
  document.getElementById('lost').style.display = 'none';
  document.getElementById('won').style.display = 'none';
  document.getElementById('secretcard').innerHTML = getCardFromId(filterRes[0]);
  showState(isDaily);
}

function handleLoad(isDaily) {
  let card = getCookie('secret_card', isDaily);

  let summon_type = 'Effect';

  if (card == '') {
    if (!isDaily) {
      summon_type =
        summon_types[Math.floor(Math.random() * summon_types.length)];
    }
    newGame(isDaily);
  } else {
    summon_type = getCookie('summon_type', isDaily);
  }

  let v = generateSecretCard(summon_type);
  autocomplete(document.getElementById('guess'), v[1]);
  showState(isDaily);
}
