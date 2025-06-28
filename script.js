// Array delle copertine
const covers = [
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f72eee0c948ae06a27eb_copertina1.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/681f492d73079ca8a805cd44_copertina2.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f730d73c833bcf868591_copertina3.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f73154dc72ddec03193f_copertina4.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f72ee68feaf9fdea0c8e_copertina5.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f72d58ed7c3c86932cde_copertina6.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f72d4d5f2f4c04b29464_copertina7.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f72d053ef4359c71d965_copertina8.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f72dc1d4b4c4a9a4d5e7_copertina9.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f72d5056f0ee668601aa_copertina10.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/681b28fe71c92065de7d0058_copertina11.jpg',
  'https://cdn.prod.website-files.com/67eab2b3417e8e61b93ee455/6814f72dc1d4b4c4a9a4d5ef_copertina12.jpg',
];

// Configurazioni
const config = {
  total: covers.length,
  baseRadius: 30,
  imageSize: 6,
  expandedRadius: 32,
};

// Selettori
const circle = document.getElementById('circle');
const echoContainer = document.querySelector('.echo-container');
const detailsImage = document.getElementById('detailsImage');
const aboutPanel = document.getElementById('aboutPanel');
const closeAbout = document.getElementById('closeAbout');
const homeLink = document.getElementById('home-link');
const aboutLink = document.getElementById('about-link');

// Stato globale
let images = [];
let currentIndex = 0;
let currentAngle = 0;

// Calcola il raggio corretto
const adjustedRadius = config.baseRadius - config.imageSize / 2;

// Funzione per caricare le immagini
function loadImages() {
  const promises = covers.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = () => {
        console.error(`Errore nel caricamento dell'immagine: ${src}`);
        img.src = 'assets/img/fallback.png'; // Immagine di fallback (opzionale)
        resolve(); // Risolve anche in caso di errore per non bloccare
      };
    });
  });
  return Promise.all(promises);
}

// Inizializza le immagini
function initImages() {
  covers.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.dataset.index = i;
    img.alt = `Copertina ${i + 1}`;
    
    // Gestione errore caricamento immagine
    img.onerror = () => {
      console.error(`Errore nel caricamento dell'immagine: ${src}`);
      img.src = 'assets/img/fallback.png'; // Immagine di fallback (opzionale)
    };

    positionImage(img, i, adjustedRadius);
    circle.appendChild(img);
    images.push(img);

    // Evento click sull'immagine
    img.addEventListener('click', () => handleImageClick(i));
  });
}

// Posiziona un'immagine nel cerchio
function positionImage(img, index, radius) {
  const angle = (index / config.total) * 2 * Math.PI;
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);
  img.style.left = `${x}%`;
  img.style.top = `${y}%`;
  img.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
}

// Calcola la rotazione più breve
function shortestRotation(fromIndex, toIndex) {
  const fromAngle = (fromIndex / config.total) * 2 * Math.PI;
  const toAngle = (toIndex / config.total) * 2 * Math.PI;
  let delta = toAngle - fromAngle;
  if (delta > Math.PI) delta -= 2 * Math.PI;
  if (delta < -Math.PI) delta += 2 * Math.PI;
  return currentAngle + delta;
}

// Ottiene la rotazione attuale
function getCurrentRotation(el) {
  const style = window.getComputedStyle(el);
  const transform = style.transform || 'none';
  if (transform === 'none') return 0;

  const match = transform.match(/matrix\(([^)]+)\)/);
  if (!match) return 0;

  const values = match[1].split(',').map(parseFloat);
  const a = values[0], b = values[1];
  let radians = Math.atan2(b, a);
  if (radians < 0) radians += 2 * Math.PI;
  return radians;
}

// Gestisce il click su un'immagine
function handleImageClick(index) {
  // Ferma la rotazione e fissa la posizione attuale
  const currentRotation = getCurrentRotation(circle);
  circle.classList.remove('rotating');
  circle.style.animation = 'none';
  circle.style.transform = `translate(-50%, -50%) rotate(${currentRotation}rad)`;

  // Calcola la nuova rotazione
  const newAngle = shortestRotation(currentIndex, index);

  // Forza il reflow per applicare la transizione
  void circle.offsetWidth;

  // Applica lo spostamento a sinistra e la rotazione opposta
  circle.style.transition = 'transform 0.8s ease-in-out, left 0.8s ease-in-out';
  circle.style.transform = `translate(-70%, -50%) rotate(${newAngle * -1}rad)`;
  circle.classList.add('shrinked');

  // Aggiorna selezione immagine
  images.forEach(img => img.classList.remove('selected'));
  images[index].classList.add('selected');

  // Cambia immagine di dettaglio a destra
  const detailSrc = `./assets/img/risorsa${index + 1}.png`;
  detailsImage.innerHTML = `<img src="${detailSrc}" alt="Dettaglio ${index + 1}" />`;
  detailsImage.style.opacity = 1;

  // Sposta l'echo-container in alto
  echoContainer.style.transition = 'transform 0.8s ease-in-out';
  echoContainer.style.transform = 'translate(-50%, -600%)';

  currentAngle = newAngle;
  currentIndex = index;

  // Ridisponi le immagini su un raggio più largo
  setTimeout(() => {
    images.forEach((img, i) => positionImage(img, i, config.expandedRadius));
  }, 0);
}

// Inizializzazione dopo il caricamento delle immagini
window.onload = () => {
  loadImages().then(() => {
    initImages();
    circle.classList.add('rotating');
    // Forza il reflow per il cerchio e l'echo-container
    circle.style.transform = `translate(-50%, -50%) rotate(0rad)`;
    echoContainer.style.transform = `translate(-50%, -50%)`;
    void circle.offsetWidth; // Forza il reflow
    void echoContainer.offsetWidth;
  });
};

// Evento click su HOME
homeLink.addEventListener('click', (e) => {
  e.preventDefault();
  location.reload();
});

// Gestione pannello About
aboutLink.addEventListener('click', (e) => {
  e.preventDefault();
  aboutPanel.classList.add('open');
  document.body.classList.add('no-scroll');
  // Forza il reflow per stabilizzare il layout
  void circle.offsetWidth;
  void echoContainer.offsetWidth;
});

closeAbout.addEventListener('click', () => {
  aboutPanel.classList.remove('open');
  document.body.classList.remove('no-scroll');
  // Forza il reflow al chiusura per sicurezza
  void circle.offsetWidth;
  void echoContainer.offsetWidth;
});