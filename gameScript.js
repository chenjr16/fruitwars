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

//restart game, end game, go to leaderboard buttons
document.getElementById("restart").addEventListener("click", restartGame);
document.getElementById("end").addEventListener("click", function () {
  if (confirm("Are you sure you want to end this game?")) {
    handleEndGame();
  }
});
document.getElementById("leader").addEventListener("click", handleLeaderBoard);
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
  const cityClicked = evt.value;
  const dayLimit = 30;
  const urlUser = backend + "users";
  let userData = {};
  fetch(urlUser)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((user) => {
        let { userName, day, money, inventory, location } = user;
        if (userName === currentPlayer) {
          day += 1;
          if (day > 30) {
            handleEndGame();
          } else {
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
                    userData.location.prices = getCurrentPrices(city);
                    fetch(backend + "updatePlayer", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ playerData: userData }),
                    }).then((res) => {
                      triggerEvent();
                      displayGameInfo();
                      handleBackBtnClick();
                    });
                  }
                });
              });
          }
        }
      });
    });
  //displayGameInfo();
  //handleBackBtnClick();
}

async function handleSellSelector(evt) {
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
  const amount = evt.value;
  const cost = evt.getAttribute("cost");
  document.getElementById("sellLabel").innerHTML = `${amount}(+$${
    amount * cost
  })`;
}

async function handleBuySelector(evt) {
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
  const amount = evt.value;
  const cost = evt.getAttribute("cost");
  document.getElementById("buyLabel").innerHTML = `${amount}(-$${
    amount * cost
  })`;
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
  triggerEvent();
  handleSellSelector(document.getElementById("fruitSelector"));
  displayGameInfo();
}

async function handleBuyConfirmBtnClick() {
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
  triggerEvent();
  handleBuySelector(document.getElementById("buyFruitSelector"));
  displayGameInfo();
}

function handleEndGame() {
  const urlUser = backend + "users";
  fetch(urlUser)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((user) => {
        const { userName, day, money } = user;
        if (userName === currentPlayer) {
          const playerInfo = {
            playerName: userName,
            days: day,
            currentAmount: money,
          };
          const currentPlayer = { userName };
          fetch(backend + "updateLeaderboard", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerData: playerInfo }),
          }).then((res) => {
            alert(
              `Congratulations ${userName}, you completed ${day} days of game, and won $ ${money}!`
            );
            document.getElementById("defaultControl").style.display = "none";
            document.getElementById("buyControl").style.display = "none";
            document.getElementById("sellControl").style.display = "none";
            document.getElementById("travelControl").style.display = "none";
            fetch(backend + "removeActivePlayer", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(currentPlayer),
            });
          });
        }
      });
    });
}

function triggerEvent() {
  const randNumber = (Math.floor(Math.random() * 100) % 60) + 1;
  if (randNumber <= 40) {
    document.getElementById("eventLines").innerHTML =
      "It's time to get rich... Good Luck!";
  } else if (randNumber <= 45) {
    // positive event
    generatePositveEvent();
  } else {
    // negative event
    generateNegativeEvent();
  }
}

async function generatePositveEvent() {
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

  const randomNumber = Math.floor(Math.random() * 100) % 2;
  if (randomNumber === 0) {
    const userMoney = userData.money;
    const moneyGained = (Math.floor(Math.random() * 10000000) % userMoney) + 1;
    userData.money += moneyGained;
    document.getElementById(
      "eventLines"
    ).innerHTML = `You won $${moneyGained} in the lottery.`;
  } else {
    const randFruit = getRandomFruit();
    const randFruitAmount = (Math.floor(Math.random() * 100) % 50) + 1;
    userData.inventory[randFruit] += randFruitAmount;
    document.getElementById(
      "eventLines"
    ).innerHTML = `You found ${randFruitAmount} units of ${randFruit} in storage.`;
  }

  const updatePayload = { playerData: userData };
  await fetch(backend + "updatePlayer", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatePayload),
  });
  displayGameInfo();
}

async function generateNegativeEvent() {
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

  const randomNumber = Math.floor(Math.random() * 100) % 2;
  if (randomNumber === 0) {
    const userMoney = userData.money;
    const moneyLost = (Math.floor(Math.random() * 10000000) % userMoney) + 1;
    userData.money -= moneyLost;
    document.getElementById(
      "eventLines"
    ).innerHTML = `You mugged and lost $${moneyLost}.`;
  } else {
    const fruits = [
      "pineapple",
      "apples",
      "cherries",
      "strawberries",
      "keyLimes",
      "avacadoes",
    ];
    const fruitArr = [];
    const fruitCntArr = [];
    for (let i = 0; i < fruits.length; i++) {
      if (userData.inventory[fruits[i]] > 0) {
        fruitArr.push(fruits[i]);
        fruitCntArr.push(userData.inventory[fruits[i]]);
      }
    }
    if (fruitArr.length > 0) {
      const randomNum = Math.floor(Math.random() * 100) % fruitArr.length;
      const fruitRotAmount =
        Math.floor(Math.random() * 100) % fruitCntArr[randomNum];
      document.getElementById(
        "eventLines"
      ).innerHTML = `You have lost ${fruitRotAmount} units of ${fruitArr[randomNum]} due to poor storage conditions.`;
      userData.inventory[fruitArr[randomNum]] -= fruitRotAmount;
    }
  }

  const updatePayload = { playerData: userData };
  await fetch(backend + "updatePlayer", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatePayload),
  });
  displayGameInfo();
}

function getRandomFruit() {
  const fruits = [
    "pineapple",
    "apples",
    "cherries",
    "strawberries",
    "keyLimes",
    "avacadoes",
  ];
  return fruits[Math.floor(Math.random() * 100) % 6];
}

function getCurrentPrices(city) {
  switch (city) {
    case "Honolulu":
      return {
        pineapple: random(5, 10),
        apples: random(5, 20),
        cherries: random(20, 40),
        strawberries: random(15, 60),
        keyLimes: random(30, 80),
        avacadoes: random(50, 100),
      };
      break;
    case "Seattle":
      return {
        pineapple: random(10, 20),
        apples: random(5, 20),
        cherries: random(10, 45),
        strawberries: random(10, 40),
        keyLimes: random(20, 80),
        avacadoes: random(60, 120),
      };
      break;
    case "New York":
      return {
        pineapple: random(15, 25),
        apples: random(10, 25),
        cherries: random(20, 50),
        strawberries: random(20, 50),
        keyLimes: random(25, 75),
        avacadoes: random(75, 120),
      };
      break;
    case "Los Angeles":
      return {
        pineapple: random(15, 25),
        apples: random(10, 30),
        cherries: random(15, 50),
        strawberries: random(10, 45),
        keyLimes: random(20, 50),
        avacadoes: random(70, 110),
      };
      break;
    case "Miami":
      return {
        pineapple: random(10, 30),
        apples: random(5, 30),
        cherries: random(20, 50),
        strawberries: random(25, 55),
        keyLimes: random(15, 60),
        avacadoes: random(45, 110),
      };
      break;
    case "Denver":
      return {
        pineapple: random(15, 35),
        apples: random(20, 50),
        cherries: random(35, 75),
        strawberries: random(5, 40),
        keyLimes: random(25, 65),
        avacadoes: random(50, 115),
      };
      break;
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
