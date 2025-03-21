/*************** ASSETS ****************/
// Balloon skins (images for balloons)
const balloonSkins = [
  "Symbol 100001.png", "Symbol 100002.png", "Symbol 100003.png", "Symbol 100004.png",
  "Symbol 100005.png", "Symbol 100006.png", "Symbol 100007.png", "Symbol 100008.png",
  "Symbol 100009.png", "Symbol 100010.png"
];

// Alphabet overlay images for letters A-Z
const alphabetSkins = [
  "Symbol 10001.png", "Symbol 10002.png", "Symbol 10003.png", "Symbol 10004.png",
  "Symbol 10005.png", "Symbol 10006.png", "Symbol 10007.png", "Symbol 10008.png",
  "Symbol 10009.png", "Symbol 10010.png", "Symbol 10011.png", "Symbol 10012.png",
  "Symbol 10013.png", "Symbol 10014.png", "Symbol 10015.png", "Symbol 10016.png",
  "Symbol 10017.png", "Symbol 10018.png", "Symbol 10019.png", "Symbol 10020.png",
  "Symbol 10021.png", "Symbol 10022.png", "Symbol 10023.png", "Symbol 10024.png",
  "Symbol 10025.png", "Symbol 10026.png"
];

/*************** GAME VARIABLES ****************/
const gameArea = document.getElementById("gameArea"); // Game area element
const scoreDisplay = document.getElementById("score"); // Score display element
const balloonsContainer = document.getElementById("balloonsContainer"); // Balloons container
const pumpLever = document.getElementById("pumpLever"); // Pump lever element
const pumpMain = document.getElementById("pumpMain"); // Pump main body element
const pumpRelease = document.getElementById("pumpRelease"); // Pump release element

let currentSize = 0; // Current size of the balloon being inflated
const maxSize = 100; // Maximum size of the balloon
const inflationSpeed = 2; // Speed at which the balloon inflates
let pumpInterval = null; // Interval for inflating the balloon
let pumpPressed = false; // Tracks if the pump lever is pressed
let score = 0; // Player's score
let balloons = []; // Array to store all balloons

/*************** UTILITY FUNCTIONS ****************/
// Generates a random integer between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generates a random letter from A to Z
function randomLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters.charAt(randomInt(0, letters.length - 1));
}

// Converts a letter to its corresponding index (A=0, B=1, ..., Z=25)
function letterToIndex(letter) {
  return letter.charCodeAt(0) - "A".charCodeAt(0);
}

/*************** PUMP HANDLERS ****************/
// Handles pump lever press
function handlePumpPress() {
  if (pumpPressed) return; // If already pressed, do nothing
  pumpPressed = true; // Mark as pressed
  pumpLever.classList.add("lever-pressed", "push-down"); // Add squeeze and push-down effects
  pumpMain.classList.add("lever-pressed"); // Add squeeze effect to the main body
  pumpRelease.classList.add("release-active"); // Add squeeze effect to the release
  currentSize = 0; // Reset balloon size
  pumpInterval = setInterval(() => {
    currentSize += inflationSpeed; // Increase balloon size
    if (currentSize >= maxSize) { // If balloon reaches max size
      clearInterval(pumpInterval); // Stop inflating
      releaseBalloon(); // Release the balloon
    }
  }, 50); // Inflate every 50ms
}

// Handles pump lever release
function handlePumpRelease() {
  if (!pumpPressed) return; // If not pressed, do nothing
  pumpPressed = false; // Mark as released
  pumpLever.classList.remove("lever-pressed", "push-down"); // Remove effects
  pumpMain.classList.remove("lever-pressed"); // Remove squeeze effect
  pumpRelease.classList.remove("release-active"); // Remove squeeze effect
  clearInterval(pumpInterval); // Stop inflating
  if (currentSize > 0 && currentSize < maxSize) { // If balloon is partially inflated
    releaseBalloon(); // Release the balloon
  }
}

// Add event listeners for pump lever
pumpLever.addEventListener("mousedown", handlePumpPress); // Mouse press
pumpLever.addEventListener("touchstart", (e) => { e.preventDefault(); handlePumpPress(); }); // Touch press
document.addEventListener("mouseup", handlePumpRelease); // Mouse release
document.addEventListener("touchend", handlePumpRelease); // Touch release

/*************** BALLOON CREATION & ANIMATION ****************/
// Releases a balloon into the game area
function releaseBalloon() {
  const balloonSize = 100 + (currentSize / maxSize) * 100; // Calculate balloon size
  const skin = balloonSkins[randomInt(0, balloonSkins.length - 1)]; // Random balloon skin
  const letter = randomLetter(); // Random letter
  const letterImg = alphabetSkins[letterToIndex(letter)]; // Letter image

  // Fixed spawn point for all balloons
  const spawnX = 1070; // X coordinate
  const spawnY = 510; // Y coordinate

  // Random horizontal and vertical movement speeds
  const dx = (Math.random() - 0.5) * 4; // Random horizontal speed (-2 to 2)
  const dy = -2 - Math.random() * 2; // Random vertical speed (upward, -2 to -4)

  // Create balloon element
  const balloonEl = document.createElement("div");
  balloonEl.classList.add("balloon");
  balloonEl.style.width = balloonSize + "px";
  balloonEl.style.height = balloonSize * 1.2 + "px";
  balloonEl.style.left = spawnX + "px";
  balloonEl.style.top = spawnY + "px";

  // Add balloon background image
  const bgImg = document.createElement("img");
  bgImg.classList.add("bg");
  bgImg.src = skin;
  bgImg.alt = "Balloon";
  balloonEl.appendChild(bgImg);

  // Add letter overlay
  const letterOverlay = document.createElement("img");
  letterOverlay.classList.add("letter");
  letterOverlay.src = letterImg;
  letterOverlay.alt = letter;
  balloonEl.appendChild(letterOverlay);

  // Add balloon to the container
  balloonsContainer.appendChild(balloonEl);
  balloons.push({ el: balloonEl, x: spawnX, y: spawnY, dx, dy, size: balloonSize, popped: false });
  currentSize = 0; // Reset balloon size
}

// Updates balloon positions
function updateBalloons() {
  for (let i = 0; i < balloons.length; i++) {
    const b = balloons[i];
    if (b.popped) continue; // Skip popped balloons
    b.y += b.dy; // Move balloon vertically
    b.x += b.dx; // Move balloon horizontally
    b.el.style.top = b.y + "px";
    b.el.style.left = b.x + "px";
    if (b.y + b.size < 0 || b.x + b.size < 0 || b.x > window.innerWidth) { // If balloon goes off-screen
      balloonsContainer.removeChild(b.el); // Remove balloon
      balloons.splice(i, 1); // Remove from array
      i--;
    }
  }
  requestAnimationFrame(updateBalloons); // Continue updating
}
requestAnimationFrame(updateBalloons); // Start updating

/*************** BALLOON POP HANDLER ****************/
// Handles balloon pop
function popBalloon(balloonEl) {
  const index = balloons.findIndex((b) => b.el === balloonEl); // Find balloon index
  if (index === -1) return; // If not found, do nothing
  balloons[index].popped = true; // Mark as popped
  balloonEl.classList.add("pop"); // Add pop animation
  createFragments(balloonEl); // Create fragments
  score++; // Increase score
  scoreDisplay.textContent = score; // Update score display
  setTimeout(() => {
    if (balloonEl.parentNode === balloonsContainer) {
      balloonsContainer.removeChild(balloonEl); // Remove balloon after animation
    }
    balloons.splice(index, 1); // Remove from array
  }, 500); // Wait for animation to finish
}

// Creates balloon fragments
function createFragments(balloonEl) {
  const fragmentCount = 8; // Number of fragments
  for (let i = 0; i < fragmentCount; i++) {
    const fragment = document.createElement("div");
    fragment.classList.add("balloon-fragment");

    // Random dispersion direction
    const angle = (Math.PI * 2 * i) / fragmentCount; // Angle for dispersion
    const distance = randomInt(50, 150); // Random distance
    const dx = Math.cos(angle) * distance; // Horizontal movement
    const dy = Math.sin(angle) * distance; // Vertical movement

    fragment.style.setProperty("--dx", `${dx}px`); // Set horizontal movement
    fragment.style.setProperty("--dy", `${dy}px`); // Set vertical movement

    // Position fragments at the balloon's center
    const rect = balloonEl.getBoundingClientRect();
    fragment.style.left = `${rect.left + rect.width / 2}px`;
    fragment.style.top = `${rect.top + rect.height / 2}px`;

    balloonsContainer.appendChild(fragment); // Add fragment to container

    // Remove fragment after animation
    setTimeout(() => {
      fragment.remove();
    }, 1000);
  }
}

// Add click event listener for balloons
balloonsContainer.addEventListener("click", function (e) {
  const balloonEl = e.target.closest(".balloon"); // Find clicked balloon
  if (!balloonEl) return; // If not a balloon, do nothing
  popBalloon(balloonEl); // Pop the balloon
});