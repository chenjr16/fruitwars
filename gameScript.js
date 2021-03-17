const backend = "https://fruitwars.herokuapp.com/";
//const backend = "http://localhost:8080/";

//Default control panel
document.getElementById("buy").addEventListener("click", switchToBuyControl);
document.getElementById("sell").addEventListener("click", switchToSellControl);
document
  .getElementById("travel")
  .addEventListener("click", switchToTravelControl);

//use cookies to get player name
let cookieArray = document.cookie.split("=");
document.getElementById("player").innerHTML = `${cookieArray[1]}`;

//restart game
document.getElementById("restart").addEventListener("click", restartGame);
displayInventory();

//show prices
const urlPrice = backend + "prices";
let cityName = document.getElementById("cityName").innerHTML;
fetch(urlPrice)
  .then((res) => res.json())
  .then((data) => {
    data.forEach((user) => {
      const { city, prices } = user;
      let priceDisplay = "";
      if (city === cityName) {
        for (const [key, value] of Object.entries(prices)) {
          priceDisplay += `<div>
          ${key}: ${value}
          </div>`;
        }
        document.getElementById("prices").innerHTML = priceDisplay;
      }
    });
  });

//show inventory

function displayInventory() {
  const urlUser = backend + "users";
  fetch(urlUser)
    .then((res) => res.json())
    .then((data) => {
      const { userName, money, inventory, location } = data[0];
      let inventoryDisplay = "";
      for (const [key, value] of Object.entries(inventory)) {
        inventoryDisplay += `<div>
          ${key}: ${value}
          </div>`;
      }
      document.getElementById("inventory").innerHTML = inventoryDisplay;
    });
}

//restart function
function restartGame() {
  if (confirm("Are you sure you want to restart a new game?")) {
    location.href = "index.html";
  }
}
//show buy control panel
function switchToBuyControl() {
  document.getElementById("defaultControl").style.display = "none";
  document.getElementById("buyControl").style.display = "block";
}

//show sell control panel
function switchToSellControl() {
  document.getElementById("defaultControl").style.display = "none";
  document.getElementById("sellControl").style.display = "block";
}

//show travel panel
function switchToTravelControl() {
  document.getElementById("defaultControl").style.display = "none";
  document.getElementById("travelControl").style.display = "block";
}

// Setup back buttons
document
  .getElementById("buyBackBtn")
  .addEventListener("click", handleBackBtnClick);

document
  .getElementById("sellBackBtn")
  .addEventListener("click", handleBackBtnClick);

document
  .getElementById("travelBackBtn")
  .addEventListener("click", handleBackBtnClick);

function handleBackBtnClick() {
  document.getElementById("defaultControl").style.display = "block";
  document.getElementById("buyControl").style.display = "none";
  document.getElementById("sellControl").style.display = "none";
  document.getElementById("travelControl").style.display = "none";
}

function handleCityClick(evt) {
  //console.log(evt);
  //console.log(evt.value);
  // To-Do: handle changing city
}