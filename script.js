//remote
const backend = "https://fruitwars.herokuapp.com/";
//local
//onst backend = "http://localHost:8080/";

document
  .getElementById("playGameBtn")
  .addEventListener("click", handlePlayGameBtnClick);
document
  .getElementById("leaderBoardBtn")
  .addEventListener("click", handleLeaderBoardBtnClick);

async function handlePlayGameBtnClick() {
  const playerName = document.getElementById("playerName").value;
  //console.log(`playGameBtn was clicked...\nplayer name is ${playerName}.`);
  const URL = backend + "addPlayer";
  //console.log(URL);
  if (playerName) {
    const urlPrice = backend + "prices";
    let locPrices = {};
    await fetch(urlPrice)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("In Fetch....");
        console.log(data);
        locPrices = data[Math.floor(Math.random() * 100) % 6];
      });
    const player = generateNewPlayer(playerName, locPrices);
    console.log(player);
    const payload = { playerData: player };
    // check if playerName is free...
    await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => {
      console.log(res);
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
  console.log("leaderBoardBtn was clicked...");
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
    money: 2000,
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
  console.log("In startGame()...");
  setCookie("userName", user, 2);
}

function handleDuplicateUser(user) {
  console.log("In handleDuplicateUser()...");

  // code to handle dupe
}
