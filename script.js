//remote
const backend = "https://fruitwars.herokuapp.com/";
//local
//const backend = "http://localHost:8080/";

document
  .getElementById("playGameBtn")
  .addEventListener("click", handlePlayGameBtnClick);
document
  .getElementById("leaderBoardBtn")
  .addEventListener("click", handleLeaderBoardBtnClick);

async function handlePlayGameBtnClick() {
  const playerName = document.getElementById("playerName").value;
  const URL = backend + "addPlayer";
  if (playerName) {
    const urlPrice = backend + "prices";
    let locPrices = {};
    await fetch(urlPrice)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        locPrices = data[Math.floor(Math.random() * 100) % 6];
      });
    const player = generateNewPlayer(playerName, locPrices);
    const payload = { playerData: player };
    // check if playerName is free...
    await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.status === 200) {
        startGame(playerName);
        location.href = "game.html";
      } else {
        handleDuplicateUser(playerName);
      }
    });
  }
}

function handleLeaderBoardBtnClick() {
  location.href = "leaderboard.html";
}

function setCookie(cName, cValue, exHours) {
  var d = new Date();
  d.setTime(d.getTime() + exHours * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
}

function generateNewPlayer(playerName, startingLocation) {
  const player = {
    userName: playerName,
    money: 100,
    day: 0,
    inventory: {
      pineapple: 0,
      apples: 0,
      cherries: 0,
      strawberries: 0,
      keyLimes: 0,
      avacadoes: 0,
    },
    location: startingLocation,
  };
  return player;
}

function startGame(user) {
  setCookie("userName", user, 2);
}

function handleDuplicateUser(user) {
  // code to handle dupe
  alert(`The name ${user} is already in use`);
}
