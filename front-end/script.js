document
  .getElementById("playGameBtn")
  .addEventListener("click", handlePlayGameBtnClick);
document
  .getElementById("leaderBoardBtn")
  .addEventListener("click", handleLeaderBoardBtnClick);

function handlePlayGameBtnClick() {
  const playName = document.getElementById("playerName").value;
  console.log(`playGameBtn was clicked...\nplayer name is ${playName}.`);
  if (playName) {
    setCookie("playerName", playName, 2);
  }
}

function handleLeaderBoardBtnClick() {
  console.log("leaderBoardBtn was clicked...");
}

function setCookie(cName, cValue, exHours) {
  var d = new Date();
  d.setTime(d.getTime() + exHours * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
}
