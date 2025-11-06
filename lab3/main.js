let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

document.getElementById("getLocation").addEventListener("click", function() {
  if (!navigator.geolocation) {
    alert("Twoja przeglądarka nie obsługuje geolokalizacji!");
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    map.setView([lat, lon], 18);
  }, err => console.error(err));
});

document.getElementById("saveButton").addEventListener("click", function() {
  leafletImage(map, function (err, canvas) {
    if (err) return console.error(err);

    let rasterCanvas = document.getElementById("rasterMap");
    let ctx = rasterCanvas.getContext("2d");
    ctx.clearRect(0, 0, rasterCanvas.width, rasterCanvas.height);
    ctx.drawImage(canvas, 0, 0, rasterCanvas.width, rasterCanvas.height);

    const imgData = rasterCanvas.toDataURL();
    createPuzzle(imgData);
  });
});

function createPuzzle(imageSrc) {
  const piecesContainer = document.getElementById('piecesContainer');
  const boardContainer = document.getElementById('boardContainer');
  piecesContainer.innerHTML = '';
  boardContainer.innerHTML = '';

  const size = 4; // 4x4
  const pieceSize = 75;
  const pieces = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundImage = `url(${imageSrc})`;
      piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;
      piece.setAttribute('data-x', x);
      piece.setAttribute('data-y', y);
      piece.draggable = true;
      piece.addEventListener('dragstart', dragStart);
      pieces.push(piece);

      const dropzone = document.createElement('div');
      dropzone.classList.add('dropzone');
      dropzone.setAttribute('data-x', x);
      dropzone.setAttribute('data-y', y);
      dropzone.addEventListener('dragover', dragOver);
      dropzone.addEventListener('dragleave', dragLeave);
      dropzone.addEventListener('drop', dropPiece);
      boardContainer.appendChild(dropzone);
    }
  }

  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(p => piecesContainer.appendChild(p));
}

let draggedPiece = null;

function dragStart(e) {
  draggedPiece = e.target;
  e.dataTransfer.effectAllowed = "move";
}

function dragOver(e) {
  e.preventDefault();
  e.target.classList.add('highlight');
}

function dragLeave(e) {
  e.target.classList.remove('highlight');
}

function dropPiece(e) {
  e.preventDefault();
  e.target.classList.remove('highlight');

  if (!draggedPiece) return;

  if (e.target.firstChild) return;

  e.target.appendChild(draggedPiece);
  checkWin();
}

function checkWin() {
  const zones = document.querySelectorAll('.dropzone');
  for (let zone of zones) {
    const piece = zone.firstChild;
    if (!piece) return;
    if (
      piece.getAttribute('data-x') !== zone.getAttribute('data-x') ||
      piece.getAttribute('data-y') !== zone.getAttribute('data-y')
    ) {
      return;
    }
  }
  if (Notification.permission === 'granted') {
    new Notification('Gratulacje! Ułożyłeś puzzle!');
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Gratulacje! Ułożyłeś puzzle!');
      }
    });
  }
  console.log("Gratulacje! Ułożyłeś puzzle!");
}