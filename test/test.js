const container = document.getElementById('hearts-container');

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('floating-heart');
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${2 + Math.random() * 3}s`;
  container.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5000);
}

setInterval(createHeart, 500);
