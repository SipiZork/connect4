const cols = document.querySelectorAll('.col');

let round = 0;
let clickable = true;

let dropSpeedMs = 200;
let dropSpeedWithDelayMs = dropSpeedMs + 100;

for (let i = 0; i < cols.length; i++) {
  cols[i].addEventListener('click', (e) => {
    if (clickable) {
      clickable = false;
      const playerId = round % 2;
      const color = playerId === 0 ? 'yellow' : 'red';
      dropBtn(i, color, playerId);
      round++;
    }
  });
}

function dropBtn(colNumber, color, playerId) {
  const columns = [
    [0, 8, 16, 24, 32, 40],
    [1, 9, 17, 25, 33, 41],
    [2, 10, 18, 26, 34, 42],
    [3, 11, 19, 27, 35, 43],
    [4, 12, 20, 28, 36, 44],
    [5, 13, 21, 29, 37, 45],
    [6, 14, 22, 30, 38, 46],
    [7, 15, 23, 31, 39, 47]
  ]

  if (colNumber === 0) {
    var col = columns[0];
  } else {
    var col = columns.find(col => col.find(num => num === colNumber));
  }

  let painted = false;
  let line = [];
  let fields = 0;
  for (let i = 0; i < col.length; i++) {
    
    if (i + 1 !== col.length) {
      if (fields === 0 && cols[col[i]].dataset.clicked === '1') {
        painted = true;
      }
      else if (cols[col[i + 1]].dataset.clicked === '1' && !painted) {
        painted = true;
        setTimeout(() => {
          cols[col[i]].classList.add(color);
          cols[col[i]].dataset.clicked = 1;
          cols[col[i]].dataset.player = playerId;
        }, fields * dropSpeedWithDelayMs);
      } else if(!painted) {
        line.push(col[i]);
        fields++;
      }
    } else if (i === col.length - 1 && !painted) {
      painted = true;
      setTimeout(() => {
        cols[col[i]].classList.add(color);
        cols[col[i]].dataset.clicked = 1;
        cols[col[i]].dataset.player = playerId;
      }, fields * dropSpeedWithDelayMs);
    } 
  }

  if (fields > 0) {
    dropLine(line, fields, color, playerId);
  }
}

function checkLine(playerId, indicies) {
  let oneRow = 0;
  for (let i = 0; i < indicies.length; i++) {

    if (parseInt(cols[indicies[i]].dataset.player, 10) === playerId) {
      oneRow++;
    } else if(parseInt(cols[indicies[i]].dataset.player, 10) !== playerId && oneRow < 4) {
      oneRow = 0;
    }
  }
  if (oneRow >= 4) {
    return true;
  } else {
    return false;
  }
}

function dropLine(line, number, color, playerId) {

  let actual = 0;
  var timesRun = 0;
  var addColor = setInterval(() => {
    if (timesRun >= line.length) {
      clearInterval(addColor);
    } else {
      cols[line[actual]].classList.add(color);
    }
    }, dropSpeedMs);
  var removeColor = setInterval(() => {
    if (timesRun >= line.length) {
      clearInterval(removeColor);
      
      const result = [
        //check columns
        checkLine(playerId, [0, 8, 16, 24, 32, 40]),
        checkLine(playerId, [1, 9, 17, 25, 33, 41]),
        checkLine(playerId, [2, 10, 18, 26, 34, 42]),
        checkLine(playerId, [3, 11, 19, 27, 35, 43]),
        checkLine(playerId, [4, 12, 20, 28, 36, 44]),
        checkLine(playerId, [5, 13, 21, 29, 37, 45]),
        checkLine(playerId, [6, 14, 22, 30, 38, 46]),
        checkLine(playerId, [7, 15, 23, 31, 39, 47]),

        //check rows
        checkLine(playerId, [0, 1, 2, 3, 4, 5, 6, 7]),
        checkLine(playerId, [8, 9, 10, 11, 12, 13, 14, 15]),
        checkLine(playerId, [16, 17, 18, 19, 20, 21, 22, 23]),
        checkLine(playerId, [24, 25, 26, 27, 28, 29, 30, 31]),
        checkLine(playerId, [32, 33, 34, 35, 36, 37, 38, 39]),
        checkLine(playerId, [40, 41, 42, 43, 44, 45, 46, 47]),
        
        // check diagonal
        checkLine(playerId, [3, 10, 17, 24]),
        checkLine(playerId, [ 4, 11, 18, 25, 32]),
        checkLine(playerId, [5, 12, 19, 26, 33, 40]),
        checkLine(playerId, [6, 13, 20, 27, 34, 41]),
        checkLine(playerId, [7, 14, 21, 28, 35, 42]),
        checkLine(playerId, [15, 22, 29, 36, 43]),
        checkLine(playerId, [23, 30, 37, 44]),

        checkLine(playerId, [4, 13, 22, 31]),
        checkLine(playerId, [3, 12, 21, 30, 39]),
        checkLine(playerId, [2, 11, 20, 29, 38, 47]),
        checkLine(playerId, [1, 10, 19, 28, 37, 46]),
        checkLine(playerId, [0, 9, 18, 27, 36, 45]),
        checkLine(playerId, [8, 17, 26, 35, 44]),
        checkLine(playerId, [16, 25, 34, 43]),
      ];

      const amIWin = result.some(i => i);

      if (amIWin) {
        alert('Nyertes');
      }
      clickable = true;
    } else {
      cols[line[actual]].classList.remove(color);
      timesRun++;
    }
    actual++;
    }, dropSpeedWithDelayMs);
}