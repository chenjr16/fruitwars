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

document
  .getElementById("sellConfirmBtn")
  .addEventListener("click", handleSellConfirmBtnClick);

document
  .getElementById("buyConfirmBtn")
  .addEventListener("click", handleBuyConfirmBtnClick);

//use cookies to get player name
let cookieArray = document.cookie.split("=");
let currentPlayer = cookieArray[1];
document.getElementById("player").innerHTML = currentPlayer;

//restart game
document.getElementById("restart").addEventListener("click", restartGame);
document.getElementById("end").addEventListener("click", handleEndGame);
document.getElementById("leader").addEventListener("click", handleLeaderBoard)
displayGameInfo();

//go to leaderBoard
function handleLeaderBoard() {
  location.href = "leaderboard.html";
}

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
  document.getElementById("fruitSelector").value = "none";
  document.getElementById("sellAmount").value = 0;
  document.getElementById("sellLabel").innerHTML = "0($0)";
  document.getElementById("sellAmount").setAttribute("max", "0");
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
  const cityClicked = evt.value;
  //console.log(evt.value);
  // To-Do: handle changing city
  const urlUser = backend + "users";
  let userData = {};
  fetch(urlUser)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((user) => {
        let { userName, day, money, inventory, location } = user;
        if (userName === currentPlayer) {
          day += 1;
          let urlLocation = backend + "prices";
          fetch(urlLocation)
            .then((res) => res.json())
            .then((data) => {
              data.forEach((locPrice) => {
                const { city, prices } = locPrice;
                if (cityClicked === city) {
                  location.city = city;
                  location.prices = prices;
                  userData = {
                    userName,
                    day,
                    money,
                    inventory,
                    location,
                  };
                  fetch(backend + "updatePlayer", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ playerData: userData }),
                  }).then((res) => {
                    displayGameInfo();
                    handleBackBtnClick();
                  });
                }
              });
            });
        }
      });
    });
  //displayGameInfo();
  //handleBackBtnClick();
}

async function handleSellSelector(evt) {
  //console.log(evt);
  //console.log(evt.value);
  // To-do: just setting a value for testing. This should be read from the server.
  const fruit = evt.value;
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
  const fruitInventory = playerData.inventory[fruit];
  const fruitCost = playerData.location.prices[fruit];
  console.log("fruitInventory: " + fruitInventory);
  console.log("fruitCost: " + fruitCost);
  document.getElementById("sellLabel").innerHTML = "0($0)";
  if (fruit === "none") {
    document.getElementById("sellAmount").setAttribute("cost", "0");
    document.getElementById("sellAmount").setAttribute("max", "0");
  } else {
    document.getElementById("sellAmount").setAttribute("cost", fruitCost);
    document.getElementById("sellAmount").setAttribute("max", fruitInventory);
  }
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

async function handleSellConfirmBtnClick() {
  const fruit = document.getElementById("fruitSelector").value;
  if (fruit !== "none") {
    let cookieArray = document.cookie.split("=");
    const user = cookieArray[1];
    const payload = { userName: user };
    const userData = await fetch(backend + "getPlayer", {
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

    const userFruitCount = userData.inventory[fruit];
    const sellAmount = document.getElementById("sellAmount").value;
    if (sellAmount <= userFruitCount) {
      const fruitCost = userData.location.prices[fruit];
      moneyEarned = sellAmount * fruitCost;
      userData.money += moneyEarned;
      userData.inventory[fruit] -= sellAmount;
    }
    const updatePayload = { playerData: userData };
    await fetch(backend + "updatePlayer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });
  }
  handleSellSelector(document.getElementById("fruitSelector"));
  displayGameInfo();
}

async function handleBuyConfirmBtnClick() {
  //console.log("In handleBuyConfirmBtnClick()...");
  const fruit = document.getElementById("buyFruitSelector").value;
  if (fruit !== "none") {
    let cookieArray = document.cookie.split("=");
    const user = cookieArray[1];
    const payload = { userName: user };
    const userData = await fetch(backend + "getPlayer", {
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

    const userMoney = userData.money;
    const fruitCost = userData.location.prices[fruit];
    const buyAmount = document.getElementById("buyAmount").value;
    const transactionTotal = fruitCost * buyAmount;
    if (transactionTotal <= userMoney) {
      userData.money -= transactionTotal;
      userData.inventory[fruit] += parseInt(buyAmount);
    }

    const updatePayload = { playerData: userData };
    await fetch(backend + "updatePlayer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });
  }
  handleBuySelector(document.getElementById("buyFruitSelector"));
  displayGameInfo();
}

async function handleEndGame() {
  const urlUser = backend + "users";
  //const dayLimit = 30;
  await fetch(urlUser)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((user) => {
        const { userName, day, money} = user;
        if (userName === currentPlayer) {
          console.log("End Game");
          const playerInfo = {playerName:userName, days:day, currentAmount:money}
          await fetch(backend + "updateLeaderboard", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({playerData:playerInfo}),
          }).then(res => {
          document.getElementById("endGame").innerHTML = `Congratulations, you completed ${day}days of game, and won $ ${money}!`
          })
        }
      });
    });
}

