document
  .getElementById("playGameBtn")
  .addEventListener("click", handlePlayGameBtnClick);
document
  .getElementById("leaderBoardBtn")
  .addEventListener("click", handleLeaderBoardBtnClick);

function handlePlayGameBtnClick() {
  const playName = document.getElementById("playerName").value;
  console.log(`playGameBtn was clicked...\nplayer name is ${playName}.`);
}

function handleLeaderBoardBtnClick() {
  console.log("leaderBoardBtn was clicked...");
}
