//remote
const backend = "https://fruitwars.herokuapp.com/";
//local
//const backend = "http://localHost:8080/";

//Default control panel
document.getElementById("buy").addEventListener("click", switchToBuyControl);
document.getElementById("sell").addEventListener("click", switchToSellControl);
document
  .getElementById("travel")
  .addEventListener("click", switchToTravelControl);

//use cookies to get player name
let cookieArray = document.cookie.split("=");
let currentPlayer = cookieArray[1];
document.getElementById("player").innerHTML = currentPlayer;

//restart game
document.getElementById("restart").addEventListener("click", restartGame);
displayGameInfo();

//show game information
function displayGameInfo() {
  const urlUser = backend + "users";
  fetch(urlUser)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((user) => {
        const { userName, day, money, inventory, location } = user;
        if (userName === currentPlayer) {
          let inventoryDisplay = "";
          let priceDisplay = "";
          for (const [key, value] of Object.entries(inventory)) {
            inventoryDisplay += `<div>
          ${key}: ${value}
          </div>`;
          }
          const { city, prices } = location;
          for (const [key, value] of Object.entries(prices)) {
            priceDisplay += `<div>
          ${key}: ${value}
          </div>`;
          }

          document.getElementById("balance").innerHTML = `$ ${money}`;
          document.getElementById("cityName").innerHTML = city;
          document.getElementById("day").innerHTML = `Day: ${day}`;
          document.getElementById("inventory").innerHTML = inventoryDisplay;
          document.getElementById("prices").innerHTML = priceDisplay;
        }
      });
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
  document.getElementById("buyFruitSelector").value = "none";
  document.getElementById("buyAmount").value = 0;
  document.getElementById("buyLabel").innerHTML = "0($0)";
  document.getElementById("buyAmount").setAttribute("max", "0");
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

function handleSellSelector(evt) {
  console.log(evt);
  console.log(evt.value);
  // To-do: just setting a value for testing. This should be read from the server.
  document.getElementById("sellAmount").setAttribute("cost", "3");
}

function handleSellAmountDrag(evt) {
  //console.log(evt);
  //console.log(evt.value);
  const amount = evt.value;
  const cost = evt.getAttribute("cost");
  console.log(amount);
  console.log(cost);
  document.getElementById("sellLabel").innerHTML = `${amount}(+$${
    amount * cost
  })`;
}

async function handleBuySelector(evt) {
  //console.log(evt);
  const fruit = evt.value;
  // To-do: just setting a value for testing. This should be read from the server.
  let cookieArray = document.cookie.split("=");
  const user = cookieArray[1];
  const payload = { userName: user };
  const playerData = await fetch(backend + "getPlayer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
  const playerMoney = playerData.money;
  const fruitCost = playerData.location.prices[fruit];
  console.log("playerMoney: " + playerMoney);
  console.log("fruitCost: " + fruitCost);
  document.getElementById("buyAmount").value = 0;
  document.getElementById("buyLabel").innerHTML = "0($0)";
  if (fruit === "none") {
    document.getElementById("buyAmount").setAttribute("cost", "0");
    document.getElementById("buyAmount").setAttribute("max", "0");
  } else {
    const maxPurchase = playerMoney / fruitCost;
    document.getElementById("buyAmount").setAttribute("cost", fruitCost);
    document.getElementById("buyAmount").setAttribute("max", maxPurchase);
  }
}

function handleBuyAmountDrag(evt) {
  //console.log(evt);
  //console.log(evt.value);
  const amount = evt.value;
  const cost = evt.getAttribute("cost");
  //console.log(amount);
  //console.log(cost);
  document.getElementById("buyLabel").innerHTML = `${amount}(-$${
    amount * cost
  })`;

  // Not sure why this was added into the buyAmount slider event handler;
  /*
  // creating random Event Display
  const autoTimed = setInterval(randomLine, 10000);
  let events = [
    "Trade war is here... over supply of all farm produce, all fruits price dropped dramatically. Trade wisely.",
    "Due to inclement weather shipment has been delayed. Shortage of fruits in the market. Trade wisely. ",
    "Summer is here and the demand for fruits has gone up... Time to make $",
    "More than 50% of the fruits nationwide were damaged due to pests. Demand for fruits has gone up. Trade wisely.",
    "You might be able to find better rates in other cities...",
  ];
  function randomLine() {
    let randomLines = Math.floor(Math.random() * events.length);
    document.getElementById("eventLines").innerHTML = events[randomLines];
  }
  */
}
