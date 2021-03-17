// Remote
// const backend = "https://fruitwars.herokuapp.com/";

// local
const backend = "http://localHost:8080/";

//displaying the player info and scores on LeaderBoard
const URL = backend + "players";
fetch(URL)
  .then((res) => res.json())
  .then((users) => displayResults(users))
  .catch((err) => console.log(err));

function displayResults(users) {
  document.getElementById("list").innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const { playerName, days, currentAmount } = user;
    const displayCard = `
    <div class="item">
      <div class="rank">1</div>
      <div class="name">${playerName}</div>
      <div class="days">${days}</div>
      <div class="score">${currentAmount}</div>
    </div>
    `;

    document.getElementById("list").innerHTML += displayCard;
  }
}
