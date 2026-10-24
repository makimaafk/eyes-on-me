const game = document.getElementById("game");
const cat = document.getElementById("cat");
const heart = document.getElementById("heart");
const scoreDisplay = document.getElementById("score");
const hint = document.getElementById("hint");
const messageBtn = document.getElementById("messageBtn");
const restartBtn = document.getElementById("restartBtn");
const modal = document.getElementById("messageModal");
const closeBtn = document.getElementById("closeBtn");
const anotherBtn = document.getElementById("anotherBtn");
const messageText = document.getElementById("messageText");

const messages = [
  "If I could give you one thing in this world, it would be the ability to see yourself through my eyes. Then you'd understand how special you really are. ♡",
  "Just a little reminder that you deserve happiness, soft days, genuine smiles, and a love that makes you feel safe. You matter more than you know. 💗",
  "Even on your hardest days, I hope you remember that you are enough. You don't have to be perfect to be loved. Please take care of yourself, okay? 🐱",
  "If this little cat could deliver one thing to you, it would be a warm hug and a reminder that someone is wishing you all the happiness in the world. 💌"
];

let x = 35;
let y = 145;
let score = 0;
let messageIndex = 0;

const speed = 17;
const target = 5;

function randomPosition(element) {
  const maxX = game.clientWidth - element.offsetWidth - 5;
  const maxY = game.clientHeight - element.offsetHeight - 40;

  return {
    x: Math.max(5, Math.floor(Math.random() * maxX)),
    y: Math.max(5, Math.floor(Math.random() * maxY))
  };
}

function placeHeart() {
  const position = randomPosition(heart);
  heart.style.left = position.x + "px";
  heart.style.top = position.y + "px";
}

function updateCat() {
  const maxX = game.clientWidth - cat.offsetWidth;
  const maxY = game.clientHeight - cat.offsetHeight - 34;

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  cat.style.left = x + "px";
  cat.style.top = y + "px";

  checkCollision();
}

function checkCollision() {
  const catRect = cat.getBoundingClientRect();
  const heartRect = heart.getBoundingClientRect();

  const touching =
    catRect.left < heartRect.right &&
    catRect.right > heartRect.left &&
    catRect.top < heartRect.bottom &&
    catRect.bottom > heartRect.top;

  if (touching) {
    collectHeart();
  }
}

function collectHeart() {
  if (score >= target) return;

  score++;
  scoreDisplay.textContent = score;

  cat.textContent = "😻";
  setTimeout(() => {
    cat.textContent = "🐈";
  }, 250);

  if (score >= target) {
    hint.textContent = "You collected all the love! 💗";
    heart.style.display = "none";
    messageBtn.disabled = false;
    messageBtn.textContent = "Open your special message 💌";
  } else {
    hint.textContent = [
      "A little love for you! 💗",
      "You're doing great! ♡",
      "Keep going, kitty! 🐾",
      "Almost there! 💌"
    ][score - 1];

    placeHeart();
  }
}

function moveCat(direction) {
  if (modal.classList.contains("show")) return;

  switch (direction) {
    case "up":
      y -= speed;
      break;
    case "down":
      y += speed;
      break;
    case "left":
      x -= speed;
      break;
    case "right":
      x += speed;
      break;
  }

  updateCat();
}

document.addEventListener("keydown", (event) => {
  const keys = {
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right"
  };

  const direction = keys[event.key];

  if (direction) {
    event.preventDefault();
    moveCat(direction);
  }
});

document.querySelectorAll(".direction").forEach((button) => {
  button.addEventListener("click", () => {
    moveCat(button.dataset.dir);
  });
});

// Allow players to tap the game area to move the cat.
game.addEventListener("click", (event) => {
  if (event.target.closest("button")) return;


  const rect = game.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;

    x = targetX - cat.offsetWidth / 2;
    y = targetY - cat.offsetHeight / 2;

    updateCat();
  });

  function openMessage() {
    if (score < target) return;

    messageText.textContent = messages[messageIndex];
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeMessage() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  messageBtn.addEventListener("click", openMessage);
  closeBtn.addEventListener("click", closeMessage);
  anotherBtn.addEventListener("click", () => {
    messageIndex = (messageIndex + 1) % messages.length;
    messageText.textContent = messages[messageIndex];
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeMessage();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMessage();
  });

  restartBtn.addEventListener("click", () => {
    score = 0;
    x = 35;
    y = 145;

    scoreDisplay.textContent = score;
    cat.textContent = "🐈";
    heart.style.display = "flex";

    hint.textContent = "Move around and catch the hearts!";
    messageBtn.disabled = true;
    messageBtn.textContent = "Collect 5 hearts to open your message 💌";

    closeMessage();
    placeHeart();
    updateCat();
  });

  // Keep the cat inside the game when the screen resizes.
  window.addEventListener("resize", () => {
    updateCat();
    placeHeart();
  });

  // Start the game.
  placeHeart();
  updateCat();