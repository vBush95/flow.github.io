let points = 0;
let pointsPerSecond = 0;
let iterator = 0;
// auto clickers
let priceNyanCat = 20;
let amountNyanCats = 0;
const nyanCatCostFactor = 1.1;
const nyanCatEfficiency = 1;
// auto clicker upgrade
let priceSuperNyanCat = 200;
let amountSuperNyanCats = 0;
const superNyanCatCostFactor = 1.2;
const superNyanCatUpgradeEfficiency = 5;
// super auto clicker upgrade
let priceUltraNyanCat = 500;
let amountUltraNyanCat = 0;
const ultraNyanCatUpgradeCostFactor = 1.2;
const ultraNyanCatUpgradeEfficiency = 15;
// catnip booster
const boosterEfficiency = 1.5;
const priceBooster = 100;
let amountBooster = 0;
const boosterBaseAmount = 100;

window.addEventListener("load", (event) => {
  update();
});

// DOM Elements
const pointsDisplay = document.getElementById("points");
const pointsPerSecondDisplay = document.getElementById("pointsPerSecond");
const autoClickerButtonButton = document.getElementById("autoClickerButton");
const upgradeAutoClickerButton = document.getElementById("upgradeAutoClicker");
const upgradeSuperAutoClickerButton = document.getElementById(
  "upgradeSuperAutoClicker"
);
const buyCatNipButton = document.getElementById("buyCatNip");

// tooltips
const pointsTooltip = tippy(pointsDisplay, {
  theme: "customTooltip",
  content: `<strong >You currently have ${points} 🦄</strong>`,
  allowHTML: true,
  dynamicTitle: true,
});
const pointsPerSecondTooltip = tippy(pointsPerSecondDisplay, {
  theme: "customTooltip",
  content: `<strong >You currently gain ${pointsPerSecond} 🦄 per second</strong>`,
  allowHTML: true,
  dynamicTitle: true,
});

function updateTooltips() {
  pointsTooltip.setContent(`<strong >You currently have ${points} 🦄</strong>`);
  pointsPerSecondTooltip.setContent(
    `<strong >You currently gain ${pointsPerSecond} 🦄 per second</strong>`
  );
}

//update function
function update() {
  pointsPerSecond =
    nyanCatEfficiency * amountNyanCats +
    superNyanCatUpgradeEfficiency * amountSuperNyanCats +
    ultraNyanCatUpgradeEfficiency * amountUltraNyanCat;

  if (amountBooster > 0) {
    pointsPerSecond = pointsPerSecond * boosterEfficiency;
    if (iterator % 5 === 0) {
      amountBooster =
        amountBooster -
        (amountNyanCats + +amountSuperNyanCats + amountUltraNyanCat);
      if (amountBooster < 0) {
        amountBooster = 0;
      }
    }
  }

  autoClickerButtonButton.dataset.price = priceNyanCat;
  upgradeAutoClickerButton.dataset.price = priceSuperNyanCat;
  upgradeSuperAutoClickerButton.dataset.price = priceUltraNyanCat;
  buyCatNipButton.dataset.price = priceBooster;
  updatePoints();
  updateCanPurchase();
  updatePointsPerSecond(pointsPerSecond);
  updateFields();
  updateTooltips();

  iterator++;
}

function generatePoints() {
  points += pointsPerSecond;
}

setInterval(update, 1000);
setInterval(generatePoints, 1000);

function updatePoints() {
  pointsDisplay.innerHTML = points;
}

function updatePointsPerSecond(pointsPerSecond) {
  pointsPerSecondDisplay.innerHTML = pointsPerSecond;
}

function updateFields() {
  // auto clickers
  if (amountNyanCats > 0) {
    document.getElementById("autoclickerCost").innerHTML = priceNyanCat;
    document.getElementById("amountAutoClicker").innerHTML =
      "Nyan Cats: " + amountNyanCats;
  } else {
    document.getElementById("amountAutoClicker").innerHTML = "";
  }
  // upgraded clickers
  document.getElementById("upgradeAutoClicker").dataset.ownedNyanCats =
    amountNyanCats;
  if (amountSuperNyanCats) {
    document.getElementById("upgradeAutoClickerCost").innerHTML =
      priceSuperNyanCat;
    document.getElementById("amountUpgradedClickers").innerHTML =
      "Super Nyan Cats: " + amountSuperNyanCats;
  } else {
    document.getElementById("amountUpgradedClickers").innerHTML = "";
  }
  // super upgraded clickers
  document.getElementById(
    "upgradeSuperAutoClicker"
  ).dataset.ownedSuperNyanCats = amountSuperNyanCats;
  if (amountUltraNyanCat) {
    document.getElementById("upgradeSuperAutoClickerCost").innerHTML =
      priceUltraNyanCat;
    document.getElementById("amountSuperUpgradedClickers").innerHTML =
      "Ultra Nyan Cats: " + amountUltraNyanCat;
  } else {
    document.getElementById("amountSuperUpgradedClickers").innerHTML = "";
  }

  // catnip
  if (amountBooster) {
    document.getElementById("amountCatNip").innerHTML =
      "Catnip left: " + amountBooster;
  } else {
    document.getElementById("amountCatNip").innerHTML = "";
  }
}

function updateCanPurchase() {
  document.querySelectorAll("button").forEach((button) => {
    if (button.dataset.price) {
      button.disabled = button.dataset.price > points;
    }
    if (button.dataset.ownedNyanCats) {
      button.disabled =
        parseInt(button.dataset.ownedNyanCats) === 0 ||
        button.dataset.price > points;
    }
    if (button.dataset.ownedSuperNyanCats) {
      button.disabled =
        parseInt(button.dataset.ownedSuperNyanCats) === 0 ||
        button.dataset.price > points;
    }
  });
}

function addPoints() {
  points++;
  updatePoints();
  updateTooltips();
}

function buyItem(amount) {
  if (points < amount) {
    return false;
  }

  points = points - amount;
  update();
  return true;
}

function buyAutoClicker() {
  if (buyItem(priceNyanCat)) {
    priceNyanCat =
      Math.ceil(Math.round(priceNyanCat * nyanCatCostFactor) / 5) * 5;
    amountNyanCats += 1;
    if (amountNyanCats <= 50) {
      createAutoClicker();
    }
  }
}

function upgradeAutoClicker() {
  if (amountNyanCats > 0) {
    if (buyItem(priceSuperNyanCat)) {
      amountNyanCats -= 1;
      amountSuperNyanCats += 1;
      priceSuperNyanCat =
        Math.ceil(Math.round(priceSuperNyanCat * superNyanCatCostFactor) / 5) *
        5;
      document.getElementById("upgradeAutoClickerCost").innerHTML =
        priceSuperNyanCat;
      let upgradedClicker = document.getElementsByClassName("autoClicker")[0];
      if (upgradedClicker) {
        const minDuration = 3;
        const maxDuration = 6;
        const duration =
          Math.random() * (maxDuration - minDuration) + minDuration;
        upgradedClicker.classList.replace("autoClicker", "autoClickerUpgrade");
        upgradedClicker.style.setProperty(
          "--animation-duration",
          `${duration}s`
        );
      }
    }
  }
}

function upgradeSuperAutoClicker() {
  if (amountSuperNyanCats > 0) {
    if (buyItem(priceUltraNyanCat)) {
      amountSuperNyanCats -= 1;
      amountUltraNyanCat += 1;
      priceUltraNyanCat =
        Math.ceil(
          Math.round(priceUltraNyanCat * ultraNyanCatUpgradeCostFactor) / 5
        ) * 5;
      document.getElementById("upgradeSuperAutoClickerCost").innerHTML =
        priceUltraNyanCat;
      let upgradedClicker =
        document.getElementsByClassName("autoClickerUpgrade")[0];
      if (upgradedClicker) {
        const minDuration = 2;
        const maxDuration = 4;
        const duration =
          Math.random() * (maxDuration - minDuration) + minDuration;
        upgradedClicker.classList.replace(
          "autoClickerUpgrade",
          "autoClickerSuperUpgrade"
        );
        upgradedClicker.style.setProperty(
          "--animation-duration",
          `${duration}s`
        );
      }
    }
  }
}

function buyCatNip() {
  if (buyItem(priceBooster)) {
    amountBooster += boosterBaseAmount;
  }
}

function createAutoClicker() {
  const minDuration = 5;
  const maxDuration = 10;
  const duration = Math.random() * (maxDuration - minDuration) + minDuration;
  const clicker = document.createElement("div");
  const clickerContainer = document.createElement("div");
  clicker.classList.add("autoClicker");
  clickerContainer.classList.add("autoClicker-container");
  clickerContainer.appendChild(clicker);
  clicker.style.setProperty("--animation-duration", `${duration}s`);
  document.body.appendChild(clickerContainer);
}
