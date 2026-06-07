const titleScreen = document.getElementById('screen-title');
const orientationScreen = document.getElementById('screen-menu');
const startButton = document.getElementById('start-btn');
const partMenu = document.getElementById('books-wrap');

function showOrientation() {
  titleScreen?.classList.remove('active');
  orientationScreen?.classList.add('active');
}

startButton?.addEventListener('click', showOrientation);

if (window.location.hash === '#orientation') {
  showOrientation();
}

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#orientation') {
    showOrientation();
  }
});

partMenu?.addEventListener('click', (event) => {
  const button = event.target.closest('.book');
  if (!button) return;
  const part = button.dataset.part;
  window.location.href = `part.html?part=${encodeURIComponent(part)}`;
});
